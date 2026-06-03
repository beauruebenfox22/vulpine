// @ts-nocheck
import { Config, Context } from "@netlify/edge-functions";
import { SignJWT, importPKCS8 } from "https://deno.land/x/jose@v4.14.4/index.ts";

export const config: Config = {
  path: "/api/booking",
};

// Helper: Get Google OAuth Token via Service Account
async function getGoogleToken() {
  const saRaw = Netlify.env.get("GOOGLE_SERVICE_ACCOUNT");
  if (!saRaw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT");
  
  const sa = JSON.parse(saRaw);
  const privateKeyString = sa.private_key.replace(/\\n/g, '\n');
  const privateKey = await importPKCS8(privateKeyString, 'RS256');

  const jwt = await new SignJWT({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
    aud: sa.token_uri,
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  const response = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Failed to retrieve Google Access Token: " + JSON.stringify(data));
  }
  return data.access_token;
}

// Helper: Call Gemini
async function callGemini(contents: any[], systemInstruction: string) {
  const apiKey = Netlify.env.get("GEMINI_CONCEIRGE_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  
  const body = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: contents,
    generationConfig: {
      temperature: 0.2
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!data.candidates || !data.candidates[0].content) {
    throw new Error("Gemini API Error: " + JSON.stringify(data));
  }
  return data.candidates[0].content.parts[0].text;
}

// Helper: Generate .ics File Content
function generateICS(name: string, email: string, start: Date, end: Date): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const now = formatDate(new Date());
  const dtStart = formatDate(start);
  const dtEnd = formatDate(end);
  const uid = `${Date.now()}@vulpine.digital`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vulpine Digital//Concierge//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `ORGANIZER;CN="Vulpine Digital":mailto:hello@vulpine.digital`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN="${name}":mailto:${email}`,
    `SUMMARY:Vulpine Briefing: ${name}`,
    `DESCRIPTION:Automated booking secured by VULPINE_CONCIERGE.\\nClient: ${name}\\nContact: ${email}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'DESCRIPTION:Reminder',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\\r\\n');
}

// Get Available Slots
async function getAvailableSlots() {
  const token = await getGoogleToken();
  const calendarId = Netlify.env.get("GOOGLE_CALENDAR_ID");

  const timeMin = new Date();
  timeMin.setDate(timeMin.getDate() + 1); // Start tomorrow
  timeMin.setHours(9, 0, 0, 0);

  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 14); // Next 14 days
  timeMax.setHours(17, 0, 0, 0);

  // Fetch Free/Busy
  const fbRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: 'Europe/London',
      items: [{ id: calendarId }]
    })
  });

  const fbData = await fbRes.json();
  const busySlots = fbData.calendars[calendarId as string]?.busy || [];

  // Generate all possible slots (Mon-Fri, 10am - 4pm)
  const availableSlots: string[] = [];
  const currentDate = new Date(timeMin);

  while (currentDate <= timeMax) {
    const day = currentDate.getDay();
    if (day !== 0 && day !== 6) { // Skip weekends
      // Check 10am, 12pm, 2pm, 4pm slots
      [10, 12, 14, 16].forEach(hour => {
        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Check if slot overlaps with busy
        const isBusy = busySlots.some((busy: any) => {
          const bStart = new Date(busy.start);
          const bEnd = new Date(busy.end);
          return (slotStart < bEnd && slotEnd > bStart);
        });

        if (!isBusy) {
          // Format slot: DD.MM.YYYY at HH:MM AM/PM
          const dateStr = slotStart.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
          const timeStr = slotStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          availableSlots.push(`${dateStr} at ${timeStr}`);
        }
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableSlots.slice(0, 10); // Return up to 10 available slots
}

// Main Handler
export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const payload = await req.json();
    const { action, history, name, email, date, time, estimateContext } = payload;

    const basePrompt = `You are Vulpine, the proprietary AI intelligence of Vulpine Digital. You act as a scheduling concierge. 
    You are direct, slightly aloof, and highly efficient. Do not use pleasantries.
    Your goal is to book a meeting with the user. Follow these steps:
    1. Ask the user when they would like a meeting.
    2. If they suggest a time, or ask for availability, offer up to 3 slots from the AVAILABLE SLOTS below. You MUST STRICTLY format them as: [SLOT: DD.MM.YYYY at HH:MM AM/PM]. Do not offer slots that aren't in the list.
    3. The user can negotiate. If they don't like the times, offer different ones from the list.
    4. Once the user selects or agrees to a specific time, ask for their Name and Email address to secure the booking.
    5. ONLY when you have their Name, Email, and agreed Date/Time, output the following EXACT string (and NOTHING ELSE after it):
    [BOOKING_CONFIRMED: Name="<name>", Email="<email>", Date="<date>", Time="<time>"]`;

    if (action === 'CHECK_AVAILABILITY') {
      const slots = await getAvailableSlots();
      const prompt = `${basePrompt}\n\nAVAILABLE SLOTS: ${slots.join(', ')}\n\nGreet the user and offer 3 of these slots naturally.`;
      
      const contents = [{ role: 'user', parts: [{ text: 'Initiate booking sequence.' }] }];
      const responseText = await callGemini(contents, prompt);
      
      return new Response(JSON.stringify({ text: responseText }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (action === 'CHAT') {
      const slots = await getAvailableSlots();
      const prompt = `${basePrompt}\n\nAVAILABLE SLOTS: ${slots.join(', ')}`;
      let responseText = await callGemini(history, prompt);
      
      let booked = false;
      let bookedDate = '';
      let bookedTime = '';

      // Check for the confirmation token
      const match = responseText.match(/\[BOOKING_CONFIRMED:\s*Name="([^"]+)",\s*Email="([^"]+)",\s*Date="([^"]+)",\s*Time="([^"]+)"\]/);
      if (match) {
        const [fullMatch, bName, bEmail, bDate, bTime] = match;
        
        // Remove token from output text
        responseText = responseText.replace(fullMatch, `Confirmed. I have secured your briefing for ${bDate} at ${bTime}. A Google Calendar transmission has been dispatched to ${bEmail}.`);
        
        // Actually book it
        const token = await getGoogleToken();
        const calendarId = Netlify.env.get("GOOGLE_CALENDAR_ID");

        const [day, month, year] = bDate.trim().split('.');
        const [timeMatch, hoursStr, minutesStr, modifier] = bTime.trim().match(/(\d+):(\d+)\s*(AM|PM)/) || [];
        
        let hours = parseInt(hoursStr, 10);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const eventStart = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, parseInt(minutesStr));
        const eventEnd = new Date(eventStart);
        eventEnd.setHours(eventEnd.getHours() + 1);

        const eventBody = {
          summary: `Vulpine Briefing: ${bName}`,
          description: `Automated booking secured by VULPINE_CONCIERGE.\nClient: ${bName}\nContact: ${bEmail}`,
          start: { dateTime: eventStart.toISOString(), timeZone: 'Europe/London' },
          end: { dateTime: eventEnd.toISOString(), timeZone: 'Europe/London' },
          reminders: { useDefault: true },
          guestsCanModify: false,
        };

        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?sendUpdates=all`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventBody)
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("Calendar Error", errText);
          responseText = "Error: Failed to secure transmission to Google Calendar. Please try again later.";
        } else {
          booked = true;
          bookedDate = bDate;
          bookedTime = bTime;

          // Dispatch Custom Email via Resend with .ics Attachment
          const resendApiKey = Netlify.env.get("RESEND_API_KEY");
          if (resendApiKey) {
            const icsContent = generateICS(bName, bEmail, eventStart, eventEnd);
            const emailHtml = `
              <div style="background-color: #080808; color: #ffffff; font-family: 'Courier New', Courier, monospace; padding: 40px; border: 1px solid #c8102e; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff2e44; letter-spacing: 0.2em; text-transform: uppercase;">Transmission Secured</h2>
                <p>Greetings ${bName},</p>
                <p>VULPINE_CONCIERGE has successfully locked your briefing into our scheduling matrix.</p>
                <div style="background-color: #121214; padding: 20px; border-left: 4px solid #c8102e; margin: 30px 0;">
                  <p style="margin: 0;"><strong>Date:</strong> ${bDate}</p>
                  <p style="margin: 0; margin-top: 10px;"><strong>Time:</strong> ${bTime}</p>
                </div>
                <p>Please find the attached calendar invitation file to add this briefing to your local scheduling module.</p>
                ${estimateContext ? `
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px dashed #333;">
                  <h3 style="color: #bdbdbd; font-size: 0.9em; letter-spacing: 0.1em; margin-bottom: 15px;">// ATTACHED ESTIMATOR CONTEXT</h3>
                  <div style="color: #888; font-family: 'Courier New', monospace; font-size: 0.85em; white-space: pre-wrap; background: #0c0c0e; padding: 15px; border: 1px solid #1a1a1c;">${estimateContext}</div>
                </div>
                ` : ''}
                <p style="opacity: 0.6; font-size: 0.8em; margin-top: 40px;">// VULPINE DIGITAL AUTOMATED DISPATCH</p>
              </div>
            `;

            try {
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${resendApiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  from: 'Vulpine Concierge <onboarding@resend.dev>', // Change this once domain is verified in Resend
                  to: bEmail,
                  subject: 'Vulpine Briefing Secured',
                  html: emailHtml,
                  attachments: [
                    {
                      filename: 'vulpine-briefing.ics',
                      content: btoa(unescape(encodeURIComponent(icsContent)))
                    }
                  ]
                })
              });
            } catch (emailErr) {
              console.error("Resend API Error:", emailErr);
            }
          }
        }
      }

      return new Response(JSON.stringify({ text: responseText, booked, date: bookedDate, time: bookedTime }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Invalid Action", { status: 400 });

  } catch (error: any) {
    console.error("[Booking API Error]", error);
    
    let fallbackText = "My cognitive subroutines encountered an error. Please try again.";
    if (error.message && (error.message.includes("quota") || error.message.includes("429") || error.message.includes("Too Many Requests"))) {
      fallbackText = "My neural pathways are currently overwhelmed by too many requests. Please give me a moment to reset, and try again.";
    }

    return new Response(JSON.stringify({ text: fallbackText, error: error.message }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
