import { Component, h } from '@stencil/core';

@Component({
  tag: 'foxy-footer',
  styleUrl: 'foxy-footer.css',
  shadow: false,
})
export class FoxyFooter {
  render() {
    return (
      <footer class="foxy-footer-container">
        <div class="footer-wrap">
          <div class="footer-left">
            <span class="footer-copyright">© 2026 VOLPINE CONSULTANCY. ALL RIGHTS RESERVED.</span>
          </div>
          <div class="footer-right">
            <a href="#" class="footer-link" onClick={(e) => { e.preventDefault(); alert("Manifesto Clicked"); }}>MANIFESTO</a>
            <span class="footer-dot">•</span>
            <a href="#" class="footer-link" onClick={(e) => { e.preventDefault(); alert("Terms of Engagement Clicked"); }}>TERMS OF ENGAGEMENT</a>
          </div>
        </div>
      </footer>
    );
  }
}
