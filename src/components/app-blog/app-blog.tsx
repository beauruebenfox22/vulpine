import { Component, Prop, State, h } from '@stencil/core';
import { journalData } from '../../blogs/journal-data';

@Component({
  tag: 'app-blog',
  styleUrl: 'app-blog.css',
  shadow: false,
})
export class AppBlog {
  @Prop() initialSlug: string;

  @State() activeSlug: string = '';
  @State() columns: number = 3;
  @State() currentPage: number = 1;
  @State() searchQuery: string = '';
  @State() activeTrackFilter: 'all' | 'ai' | 'shopify' = 'all';
  @State() isFilterPanelOpen: boolean = false;

  private itemsPerPage = 6;

  componentWillLoad() {
    if (this.initialSlug) {
      this.activeSlug = this.initialSlug;
    }
    
    // Load column preference
    if (typeof window !== 'undefined') {
      const savedCols = localStorage.getItem('vulpine_blog_cols');
      if (savedCols) {
        this.columns = parseInt(savedCols, 10);
      }
    }
  }

  private setColumns = (cols: number) => {
    this.columns = cols;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vulpine_blog_cols', cols.toString());
    }
  };

  private openPost = (slug: string) => {
    this.activeSlug = slug;
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/blog/' + slug);
    }
  };

  private closeModal = () => {
    this.activeSlug = '';
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/blog');
    }
  };

  private toggleFilterPanel = () => {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  };

  private handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      this.currentPage++;
    } else {
      this.currentPage--;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  render() {
    // 1. Filter Data
    let filteredData = journalData.filter(post => {
      const matchSearch = this.searchQuery === '' || 
                          post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          post.topic.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchTrack = this.activeTrackFilter === 'all' || post.track === this.activeTrackFilter;

      return matchSearch && matchTrack;
    });

    // 2. Pagination Math
    const totalPages = Math.ceil(filteredData.length / this.itemsPerPage) || 1;
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + this.itemsPerPage);

    return (
      <div class="blog-index-wrapper">
        <foxy-hero 
          headline="VULPINE JOURNAL"
          subheadline="Documentation, logic layer architecture, and autonomous commerce engineering."
        ></foxy-hero>

        {/* TOOLBAR */}
        <div class="blog-toolbar">
          
          <div class="toolbar-left">
            <button class="filter-toggle-btn" onClick={this.toggleFilterPanel}>
              {this.isFilterPanelOpen ? '[ CLOSE FILTERS ]' : '[ OPEN FILTERS ]'}
            </button>
            <div class="search-box">
              <input 
                type="text" 
                placeholder="Search index..." 
                value={this.searchQuery}
                onInput={(e: any) => {
                  this.searchQuery = e.target.value;
                  this.currentPage = 1;
                }}
              />
            </div>
          </div>

          <div class="toolbar-right">
            <span class="view-label">VIEW MATRIX:</span>
            <div class="col-toggles">
              <button class={this.columns === 1 ? 'active' : ''} onClick={() => this.setColumns(1)}>I</button>
              <button class={this.columns === 2 ? 'active' : ''} onClick={() => this.setColumns(2)}>II</button>
              <button class={this.columns === 3 ? 'active' : ''} onClick={() => this.setColumns(3)}>III</button>
            </div>
          </div>
        </div>

        {/* REVEALABLE FILTER PANEL */}
        <div class={`filter-panel ${this.isFilterPanelOpen ? 'is-open' : ''}`}>
          <div class="filter-group">
            <label>OPERATIONAL TRACK</label>
            <div class="filter-buttons">
              <button class={this.activeTrackFilter === 'all' ? 'active' : ''} onClick={() => { this.activeTrackFilter = 'all'; this.currentPage = 1; }}>ALL</button>
              <button class={this.activeTrackFilter === 'shopify' ? 'active' : ''} onClick={() => { this.activeTrackFilter = 'shopify'; this.currentPage = 1; }}>COMMERCE (SHOPIFY)</button>
              <button class={this.activeTrackFilter === 'ai' ? 'active' : ''} onClick={() => { this.activeTrackFilter = 'ai'; this.currentPage = 1; }}>INTELLIGENCE (AI)</button>
            </div>
          </div>
          <div class="filter-stats">
            <span>INDEX SIZE: {journalData.length}</span>
            <span>FILTERED MATCHES: {filteredData.length}</span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div class={`blog-grid cols-${this.columns}`}>
          {paginatedData.length === 0 ? (
            <div class="empty-state">NO DATA FOUND FOR QUERY.</div>
          ) : (
            paginatedData.map((post, index) => (
              <div 
                class={`blog-card track-${post.track} staggered-${index % 3}`}
                onClick={() => this.openPost(post.slug)}
              >
                <div class="card-meta">
                  <span class="card-track">[ {post.topic.toUpperCase()} ]</span>
                  <span class="card-date">{post.date}</span>
                </div>
                <h3 class="card-title">{post.title}</h3>
                <p class="card-subtitle">{post.subtitle}</p>
                <div class="card-footer">
                  <span class="card-author">BY {post.author.toUpperCase()}</span>
                  <span class="card-action">[ READ ]</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div class="pagination-controls">
          <button 
            disabled={this.currentPage === 1} 
            onClick={() => this.handlePageChange('prev')}
          >
            [ PREV_PAGE ]
          </button>
          <span class="page-indicator">PAGE 0{this.currentPage} // 0{totalPages}</span>
          <button 
            disabled={this.currentPage === totalPages || totalPages === 0} 
            onClick={() => this.handlePageChange('next')}
          >
            [ NEXT_PAGE ]
          </button>
        </div>

        {/* RENDERER MODAL */}
        {this.activeSlug && (
          <foxy-journal-renderer 
            slug={this.activeSlug} 
            onCloseModal={this.closeModal} 
          />
        )}
      </div>
    );
  }
}
