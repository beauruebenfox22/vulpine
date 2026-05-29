import { Component, Prop, State, Event, EventEmitter, Watch, h } from '@stencil/core';
import { triggerToast } from '../../utils/toast';

interface DebateAgent {
  id: string;
  name: string;
  stance: 'for' | 'against' | 'neutral';
  personality: string;
}

interface TranscriptEntry {
  agentName: string;
  role: string;
  message?: string;
  verdict?: 'for' | 'against';
  reasoning?: string;
}

@Component({
  tag: 'foxy-debate-takeover',
  styleUrl: 'foxy-debate-takeover.css',
  shadow: false,
})
export class FoxyDebateTakeover {
  @Prop() active: boolean = false;
  @Event() debateClose: EventEmitter<void>;

  @State() isDebating: boolean = false;
  @State() topic: string = 'Is AGI a threat to humanity?';
  @State() agentCount: number = 3;
  @State() agents: DebateAgent[] = [];
  @State() manipulationEnabled: boolean = false;

  @State() activeAgentIndex: number | null = null;
  @State() transcripts: TranscriptEntry[] = [
    { agentName: 'SYSTEM', role: 'judge', message: 'Debate initialized. Awaiting configuration.' }
  ];

  componentWillLoad() {
    this.syncAgents();
  }

  @Watch('agentCount')
  syncAgents() {
    const current = [...this.agents];
    this.agents = Array.from({ length: this.agentCount }).map((_, i) => {
      if (current[i]) return current[i];
      return {
        id: `NODE 0${i + 1}`,
        name: `Agent ${String.fromCharCode(65 + i)}`,
        stance: i === 0 ? 'for' : (i === 1 ? 'against' : 'neutral'),
        personality: 'professional'
      };
    });
  }

  private updateAgent(index: number, key: keyof DebateAgent, value: string) {
    const newAgents = [...this.agents];
    newAgents[index] = { ...newAgents[index], [key]: value };
    this.agents = newAgents;
  }

  private handleClose = () => {
    if (!this.isDebating) {
      this.debateClose.emit();
    } else {
      triggerToast('Cannot close during active computation.', 'alert');
    }
  };

  private agentTurn = async (agent: DebateAgent, isFinalRound: boolean = false) => {
    this.activeAgentIndex = this.agents.indexOf(agent);
    
    const judgesProfiles = this.agents
      .filter(a => a.stance === 'neutral')
      .map(a => ({ name: a.name, personality: a.personality }));

    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: this.topic,
          agentName: agent.name,
          agentPersonality: agent.personality,
          agentStance: agent.stance,
          transcript: this.transcripts,
          isFinalRound,
          manipulationEnabled: this.manipulationEnabled,
          judgesProfiles
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        if (isFinalRound && agent.stance === 'neutral') {
          // Attempt to parse JSON verdict
          try {
            const parsed = JSON.parse(data.response);
            this.transcripts = [...this.transcripts, { 
              agentName: agent.name, 
              role: 'verdict', 
              verdict: parsed.verdict.toLowerCase(), 
              reasoning: parsed.reasoning 
            }];
          } catch(err) {
             // Fallback if model hallucinated format
             this.transcripts = [...this.transcripts, { agentName: agent.name, role: agent.stance, message: data.response }];
          }
        } else {
          this.transcripts = [...this.transcripts, { agentName: agent.name, role: agent.stance, message: data.response }];
        }
      } else {
        this.transcripts = [...this.transcripts, { agentName: agent.name, role: agent.stance, message: "[ CONNECTION LOST - EDGE TIMEOUT ]" }];
      }
    } catch (e) {
      this.transcripts = [...this.transcripts, { agentName: agent.name, role: agent.stance, message: "[ ERROR - ORCHESTRATOR FAILED ]" }];
    }
    
    this.scrollToBottom();
  };

  private runSummarizer = async (roundNum: number) => {
    triggerToast(`Summarizing Round ${roundNum}...`, 'info');
    this.activeAgentIndex = 999; 
    
    try {
      const summaryRes = await fetch('/api/orchestrator-summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: this.transcripts, topic: this.topic })
      });
      
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        this.transcripts = [...this.transcripts, { 
          agentName: 'SYSTEM [MIDDLEMAN]', 
          role: 'judge', 
          message: `ROUND ${roundNum} SUMMARY:\n${data.summary}` 
        }];
      } else {
        this.transcripts = [...this.transcripts, { agentName: 'SYSTEM [MIDDLEMAN]', role: 'judge', message: "[ SUMMARIZATION FAILED ]" }];
      }
    } catch (e) {
      this.transcripts = [...this.transcripts, { agentName: 'SYSTEM [MIDDLEMAN]', role: 'judge', message: "[ SUMMARIZATION FAILED ]" }];
    }
    this.scrollToBottom();
  };

  private startDebate = async () => {
    const hasFor = this.agents.some(a => a.stance === 'for');
    const hasAgainst = this.agents.some(a => a.stance === 'against');
    const hasJudge = this.agents.some(a => a.stance === 'neutral');

    if (!hasFor || !hasAgainst || !hasJudge) {
      triggerToast("Debate requires at least one FOR, one AGAINST, and one NEUTRAL judge.", "alert");
      return;
    }

    this.isDebating = true;
    this.transcripts = [{ agentName: 'SYSTEM', role: 'judge', message: `Initiating orchestrator for: ${this.topic}` }];
    triggerToast('Initiating Orchestrator (Round 1)...', 'info');

    const debaters = this.agents.filter(a => a.stance !== 'neutral');
    const judges = this.agents.filter(a => a.stance === 'neutral');

    // Round 1
    for (const agent of this.agents) {
      await this.agentTurn(agent, false);
      await new Promise(r => setTimeout(r, 4000));
    }
    await this.runSummarizer(1);
    await new Promise(r => setTimeout(r, 4000));

    // Round 2
    this.transcripts = [...this.transcripts, { agentName: 'SYSTEM', role: 'judge', message: `--- COMMENCING ROUND 2 ---` }];
    for (const agent of this.agents) {
      await this.agentTurn(agent, false);
      await new Promise(r => setTimeout(r, 4000));
    }
    await this.runSummarizer(2);
    await new Promise(r => setTimeout(r, 4000));

    // Round 3 (Final)
    this.transcripts = [...this.transcripts, { agentName: 'SYSTEM', role: 'judge', message: `--- FINAL ROUND (VERDICTS) ---` }];
    for (const debater of debaters) {
      await this.agentTurn(debater, false);
      await new Promise(r => setTimeout(r, 4000));
    }

    for (const judge of judges) {
      await this.agentTurn(judge, true);
      await new Promise(r => setTimeout(r, 4000));
    }

    this.isDebating = false;
    this.activeAgentIndex = null;
    triggerToast('Debate concluded.', 'info');
  };

  private scrollToBottom() {
    setTimeout(() => {
      const feed = document.querySelector('.transcript-feed');
      if (feed) feed.scrollTop = feed.scrollHeight;
    }, 100);
  }

  render() {
    return (
      <div class={`foxy-debate-takeover ${this.active ? 'is-active' : ''} ${this.isDebating ? 'debate-running' : ''}`}>
        
        {/* CLOSE BUTTON */}
        <button class="debate-close-btn" onClick={this.handleClose}>
          [ CLOSE ]
        </button>

        <div class="debate-layout">
          
          {/* LEFT: CONFIGURATION MATRIX */}
          <div class="debate-config-zone">
            <h2 class="zone-heading">ORCHESTRATION MATRIX</h2>
            
            <div class="config-group">
              <label>DEBATE TOPIC</label>
              <input type="text" value={this.topic} onInput={(e: any) => this.topic = e.target.value} placeholder="Enter a topic..." />
            </div>

            <div class="config-group">
              <label>AGENT COUNT ({this.agentCount})</label>
              <input type="range" min="3" max="5" value={this.agentCount} onInput={(e: any) => this.agentCount = parseInt(e.target.value, 10)} />
            </div>

            <div class="config-group toggle-group">
              <label>PSYCHOLOGICAL WARFARE (MANIPULATION)</label>
              <input type="checkbox" checked={this.manipulationEnabled} onChange={(e: any) => this.manipulationEnabled = e.target.checked} />
            </div>

            <div class="agents-container">
              {this.agents.map((agent, i) => (
                <div class="agent-slot">
                  <div class="agent-slot-header">
                    <span class="agent-id">{agent.id}</span>
                    <select class="agent-stance" onChange={(e: any) => this.updateAgent(i, 'stance', e.target.value)}>
                      <option value="for" selected={agent.stance === 'for'}>[ FOR ]</option>
                      <option value="against" selected={agent.stance === 'against'}>[ AGAINST ]</option>
                      <option value="neutral" selected={agent.stance === 'neutral'}>[ NEUTRAL / JUDGE ]</option>
                    </select>
                  </div>
                  <input type="text" class="agent-name" placeholder="Agent Designation..." value={agent.name} onInput={(e: any) => this.updateAgent(i, 'name', e.target.value)} />
                  <select class="agent-personality" onChange={(e: any) => this.updateAgent(i, 'personality', e.target.value)}>
                    <option value="professional" selected={agent.personality === 'professional'}>[ PROFESSIONAL ]</option>
                    <option value="belligerent" selected={agent.personality === 'belligerent'}>[ BELLIGERENT ]</option>
                    <option value="energetic" selected={agent.personality === 'energetic'}>[ ENERGETIC ]</option>
                    <option value="academic" selected={agent.personality === 'academic'}>[ ACADEMIC ]</option>
                    <option value="genius" selected={agent.personality === 'genius'}>[ GOD TIER GENIUS ]</option>
                  </select>
                </div>
              ))}
            </div>

            <button class="debate-launch-btn" onClick={this.startDebate} disabled={this.isDebating}>
              {this.isDebating ? 'COMPUTING...' : 'INITIATE DEBATE'}
            </button>
          </div>

          {/* RIGHT: DEBATE ARENA */}
          <div class="debate-arena-zone">
            <div class="arena-header">
              <h2 class="zone-heading">TERMINAL OUTPUT</h2>
              <div class="arena-status">
                <span class="status-dot blink"></span>
                <span>{this.isDebating ? 'ORCHESTRATING' : 'STANDBY'}</span>
              </div>
            </div>

            <div class="transcript-feed">
              {this.transcripts.map(t => {
                if (t.role === 'verdict') {
                  // Visual Verdict Render
                  return (
                    <div class={`visual-verdict verdict-${t.verdict}`}>
                      <div class="verdict-header">
                        <span class="verdict-indicator"></span>
                        <span class="verdict-name">{t.agentName}'s VERDICT: {t.verdict?.toUpperCase()}</span>
                      </div>
                      <div class="verdict-reasoning">"{t.reasoning}"</div>
                    </div>
                  );
                }

                // Standard Message Render
                return (
                  <div class={`transcript-entry role-${t.role}`}>
                    <div class="entry-meta">
                      <span class="entry-name">{t.agentName}</span>
                      <span class="entry-role">[{t.role.toUpperCase()}]</span>
                    </div>
                    <div class="entry-message">
                      {t.message}
                    </div>
                  </div>
                );
              })}
              
              {this.isDebating && (
                <div class="transcript-entry typing-indicator">
                  <div class="entry-meta">
                    <span class="entry-name">SYSTEM</span>
                  </div>
                  <div class="entry-message">Awaiting edge response...</div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}
