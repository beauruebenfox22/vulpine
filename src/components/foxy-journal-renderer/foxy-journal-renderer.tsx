import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { journalData, JournalEntry } from '../../blogs/journal-data';

@Component({
  tag: 'foxy-journal-renderer',
  styleUrl: 'foxy-journal-renderer.css',
  shadow: false,
})
export class FoxyJournalRenderer {
  @Prop() slug: string;
  @Event() closeModal: EventEmitter<void>;

  private getPost(): JournalEntry | null {
    return journalData.find(post => post.slug === this.slug) || null;
  }

  componentDidLoad() {
    if (typeof document !== 'undefined') {
      document.body.classList.add('modal-open');
    }
  }

  disconnectedCallback() {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }

  render() {
    const post = this.getPost();

    if (!post) {
      return (
        <div class="renderer-modal error-state">
          <div class="error-box">
            <h2>404 // FRAGMENT NOT FOUND</h2>
            <button onClick={() => this.closeModal.emit()}>[ CLOSE ]</button>
          </div>
        </div>
      );
    }

    const isAI = post.track === 'ai';

    return (
      <div class="renderer-modal">
        <button class="close-btn" onClick={() => this.closeModal.emit()} title="Close Renderer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>

        <div class="scroll-container">
          <div class="renderer-layout">
            {/* LEFT 30% MARGIN */}
            <aside class="renderer-meta">
              <div class="tracking-line">
                <div class={`data-node ${isAI ? 'node-ai' : 'node-shopify'}`}></div>
              </div>
              <div class="meta-data">
                <span class="meta-label">AUTHOR // {post.author.toUpperCase()}</span>
                <span class="meta-date">EXEC: {post.date}</span>
              </div>
            </aside>

            {/* RIGHT 70% CONTENT */}
            <article class="renderer-content">
              <header class="post-header">
                <span class={`post-track ${isAI ? 'track-ai' : 'track-shopify'}`}>
                  [ {post.topic.toUpperCase()} ]
                </span>
                <h1 class="post-title">{post.title}</h1>
                <h2 class="post-subtitle">{post.subtitle}</h2>
              </header>

              <div class="post-body" innerHTML={post.body}></div>
            </article>
          </div>
        </div>
      </div>
    );
  }
}
