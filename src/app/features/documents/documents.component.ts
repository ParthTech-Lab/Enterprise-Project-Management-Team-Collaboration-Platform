import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';
import { DocumentItem } from '../../core/models/document.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, BadgeComponent],
  template: `
    <div class="docs-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Collaboration</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">Documents</span>
          </div>
          <h1 class="page-title">Enterprise Knowledge & RFC Repository</h1>
          <p class="page-subtitle">
            12 verified technical specifications, architectural blueprints, audit evidence and RFCs
          </p>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="orbit-btn orbit-btn-primary"
            (click)="notifService.info('Upload Document', 'Select PDF, Markdown or Figma design file')"
          >
            <app-icon name="plus" [size]="15"></app-icon>
            <span>Upload Document</span>
          </button>
        </div>
      </header>

      <!-- Main Layout: Folder Sidebar + Documents Table/Grid -->
      <div class="docs-layout-split">
        <!-- Folders Sidebar -->
        <aside class="folders-sidebar">
          <span class="folder-group-title">FOLDERS & CATEGORIES</span>
          <div class="folder-list">
            <div
              class="folder-item"
              [class.active]="selectedFolder === 'all'"
              (click)="selectedFolder = 'all'"
            >
              <app-icon name="folder" [size]="15"></app-icon>
              <span class="f-name">All Documents</span>
              <span class="f-count">{{ dataService.documents().length }}</span>
            </div>
            <div
              *ngFor="let folder of folders"
              class="folder-item"
              [class.active]="selectedFolder === folder"
              (click)="selectedFolder = folder"
            >
              <app-icon name="folder" [size]="15"></app-icon>
              <span class="f-name">{{ folder }}</span>
              <span class="f-count">{{ getCountByFolder(folder) }}</span>
            </div>
          </div>
        </aside>

        <!-- Document List Area -->
        <main class="docs-content-pane">
          <!-- Toolbar -->
          <div class="docs-toolbar">
            <div class="search-input-box">
              <app-icon name="search" [size]="15" customClass="tb-search-icon"></app-icon>
              <input
                type="text"
                class="tb-input"
                placeholder="Search documents by title, tags, or author..."
                [(ngModel)]="searchQuery"
              />
            </div>

            <div class="sharing-filter-pills">
              <button
                type="button"
                class="s-pill"
                [class.active]="selectedShareStatus === 'all'"
                (click)="selectedShareStatus = 'all'"
              >
                All Visibility
              </button>
              <button
                type="button"
                class="s-pill"
                [class.active]="selectedShareStatus === 'internal'"
                (click)="selectedShareStatus = 'internal'"
              >
                Internal
              </button>
              <button
                type="button"
                class="s-pill"
                [class.active]="selectedShareStatus === 'restricted'"
                (click)="selectedShareStatus = 'restricted'"
              >
                Restricted (SOC2)
              </button>
              <button
                type="button"
                class="s-pill"
                [class.active]="selectedShareStatus === 'public'"
                (click)="selectedShareStatus = 'public'"
              >
                Public API
              </button>
            </div>
          </div>

          <!-- Document Table -->
          <div class="orbit-table-container">
            <table class="orbit-table">
              <thead>
                <tr>
                  <th style="width: 36px;">★</th>
                  <th>Title & Description</th>
                  <th>Folder</th>
                  <th>Type</th>
                  <th>Version</th>
                  <th>Size</th>
                  <th>Owner</th>
                  <th>Visibility</th>
                  <th>Modified</th>
                  <th style="width: 50px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let doc of filteredDocs()"
                  class="doc-tr"
                  (click)="previewDoc(doc)"
                >
                  <td (click)="$event.stopPropagation(); toggleFav(doc)">
                    <span class="star-icon" [class.fav]="doc.favorite">★</span>
                  </td>
                  <td>
                    <div class="doc-title-cell">
                      <span class="doc-main-name">{{ doc.title }}</span>
                      <span class="doc-desc-snippet">{{ doc.description }}</span>
                    </div>
                  </td>
                  <td><span class="folder-tag">{{ doc.folder }}</span></td>
                  <td>
                    <span class="filetype-badge" [ngClass]="doc.fileType">{{ doc.fileType | uppercase }}</span>
                  </td>
                  <td><span class="ver-tag">{{ doc.version }}</span></td>
                  <td><span class="size-txt">{{ doc.size }}</span></td>
                  <td>
                    <div class="owner-cell">
                      <app-avatar [src]="doc.ownerAvatar" [name]="doc.ownerName" size="xs"></app-avatar>
                      <span>{{ doc.ownerName }}</span>
                    </div>
                  </td>
                  <td>
                    <app-badge
                      [variant]="doc.sharedStatus === 'restricted' ? 'crimson' : doc.sharedStatus === 'public' ? 'emerald' : 'graphite'"
                      size="sm"
                    >
                      {{ doc.sharedStatus | uppercase }}
                    </app-badge>
                  </td>
                  <td><span class="date-txt">{{ doc.lastModified | slice:0:10 }}</span></td>
                  <td (click)="$event.stopPropagation()">
                    <button
                      type="button"
                      class="orbit-btn orbit-btn-ghost orbit-btn-icon"
                      (click)="downloadDoc(doc)"
                      title="Download Document"
                    >
                      <app-icon name="download" [size]="14"></app-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <!-- Document Preview Drawer Modal -->
      <div *ngIf="previewingDoc() as doc" class="doc-preview-backdrop" (click)="previewingDoc.set(null)">
        <div class="doc-preview-drawer" (click)="$event.stopPropagation()">
          <div class="dp-header">
            <div class="dp-header-left">
              <span class="filetype-badge" [ngClass]="doc.fileType">{{ doc.fileType | uppercase }}</span>
              <h3 class="dp-title">{{ doc.title }}</h3>
            </div>
            <button type="button" class="dp-close-btn" (click)="previewingDoc.set(null)">
              <app-icon name="x" [size]="16"></app-icon>
            </button>
          </div>

          <div class="dp-body">
            <div class="dp-meta-grid">
              <div><strong>Owner:</strong> {{ doc.ownerName }}</div>
              <div><strong>Version:</strong> {{ doc.version }}</div>
              <div><strong>Folder:</strong> {{ doc.folder }}</div>
              <div><strong>Size:</strong> {{ doc.size }}</div>
            </div>

            <div class="dp-content-box">
              <h4>Executive Summary & Abstract</h4>
              <p>{{ doc.description }}</p>
              <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 16px 0;" />
              <h4>Architectural Constraints & Validation Spec</h4>
              <p>
                This enterprise specification establishes mandatory consensus thresholds, cryptographic verification standards, and zero-downtime cutover parameters. All changes require sign-off by the Principal Solutions Architect and Enterprise Security Leads.
              </p>
              <div class="code-preview-block">
                <code>
                  // Architecture Assertion Contract<br/>
                  TargetSLA: 99.999%<br/>
                  MaxRecoveryWindow: 15s<br/>
                  CipherSuite: TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384<br/>
                  AuditCompliance: ISO27001-2022 / SOC2-Type-II
                </code>
              </div>
            </div>
          </div>

          <div class="dp-footer">
            <button type="button" class="orbit-btn orbit-btn-secondary" (click)="previewingDoc.set(null)">
              Close
            </button>
            <button type="button" class="orbit-btn orbit-btn-primary" (click)="downloadDoc(doc)">
              <app-icon name="download" [size]="14"></app-icon>
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .docs-viewport {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: 100%;
      overflow: hidden;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-shrink: 0;
    }

    .breadcrumb-trail {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .bc-sep { color: var(--border-strong); }
    .bc-active { color: var(--text-secondary); font-weight: 500; }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    /* Layout Split */
    .docs-layout-split {
      display: flex;
      gap: 20px;
      flex: 1;
      overflow: hidden;
    }

    .folders-sidebar {
      width: 240px;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex-shrink: 0;
      overflow-y: auto;
    }

    @media (max-width: 850px) {
      .folders-sidebar {
        display: none;
      }
    }

    .folder-group-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 4px 8px;
    }

    .folder-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .folder-item {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      padding: 0 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 500;
      transition: all 0.12s ease;
    }

    .folder-item:hover {
      background: var(--surface-secondary);
      color: var(--text-primary);
    }

    .folder-item.active {
      background: var(--surface-tertiary);
      color: var(--text-primary);
      font-weight: 600;
    }

    .f-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .f-count {
      font-size: 10px;
      color: var(--text-muted);
    }

    .docs-content-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 14px;
      overflow: hidden;
    }

    .docs-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 10px 14px;
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      flex-wrap: wrap;
    }

    .search-input-box {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 260px;
      height: 32px;
      padding: 0 10px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
    }
    .tb-search-icon { color: var(--text-muted); }
    .tb-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 12px;
      color: var(--text-primary);
    }

    .sharing-filter-pills {
      display: flex;
      gap: 6px;
    }

    .s-pill {
      height: 28px;
      padding: 0 10px;
      font-size: 11px;
      font-weight: 500;
      border-radius: 9999px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .s-pill:hover { background: var(--surface-secondary); }
    .s-pill.active {
      background: var(--surface-tertiary);
      border-color: var(--border-strong);
      color: var(--text-primary);
      font-weight: 600;
    }

    /* Table */
    .doc-tr {
      cursor: pointer;
    }

    .star-icon {
      font-size: 14px;
      color: var(--border-strong);
      cursor: pointer;
    }
    .star-icon.fav {
      color: var(--accent-amber);
    }

    .doc-title-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .doc-main-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .doc-desc-snippet {
      font-size: 11px;
      color: var(--text-muted);
      max-width: 320px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .folder-tag {
      font-size: 11px;
      color: var(--text-muted);
    }

    .filetype-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      letter-spacing: 0.05em;
    }
    .filetype-badge.pdf { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
    .filetype-badge.figma { background: rgba(139, 92, 246, 0.15); color: #8B5CF6; }
    .filetype-badge.markdown { background: rgba(16, 185, 129, 0.15); color: #10B981; }
    .filetype-badge.sheet { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }

    .ver-tag {
      font-size: 11px;
      color: var(--text-muted);
      font-family: monospace;
    }

    .size-txt, .date-txt {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .owner-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      font-size: 12px;
    }

    /* Preview Drawer */
    .doc-preview-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      z-index: 1080;
      display: flex;
      justify-content: flex-end;
    }

    .doc-preview-drawer {
      width: 620px;
      max-width: 100vw;
      background: var(--surface-primary);
      border-left: 1px solid var(--border-default);
      display: flex;
      flex-direction: column;
      animation: slideDrawer 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .dp-header {
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--surface-secondary);
    }

    .dp-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dp-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .dp-close-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
    }

    .dp-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .dp-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 12px 14px;
      background: var(--surface-secondary);
      border-radius: var(--radius-sm);
      font-size: 12px;
      color: var(--text-secondary);
    }

    .dp-content-box {
      font-size: 13px;
      color: var(--text-primary);
      line-height: 1.6;
    }

    .code-preview-block {
      background: var(--surface-secondary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      padding: 14px;
      margin-top: 14px;
      font-family: monospace;
      font-size: 12px;
      color: var(--accent-emerald);
      line-height: 1.5;
    }

    .dp-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      background: var(--surface-secondary);
    }
  `]
})
export class DocumentsComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public searchQuery = '';
  public selectedFolder = 'all';
  public selectedShareStatus = 'all';
  public previewingDoc = signal<DocumentItem | null>(null);

  public folders = [
    'Architecture & RFCs',
    'Design Systems',
    'Security & Governance',
    'Developer Platform',
    'Financials & Executive'
  ];

  getCountByFolder(folder: string): number {
    return this.dataService.documents().filter(d => d.folder === folder).length;
  }

  public filteredDocs = computed(() => {
    let list = this.dataService.documents();

    if (this.selectedFolder !== 'all') {
      list = list.filter(d => d.folder === this.selectedFolder);
    }

    if (this.selectedShareStatus !== 'all') {
      list = list.filter(d => d.sharedStatus === this.selectedShareStatus);
    }

    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        d =>
          d.title.toLowerCase().includes(q) ||
          d.folder.toLowerCase().includes(q) ||
          d.ownerName.toLowerCase().includes(q) ||
          d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  });

  toggleFav(doc: DocumentItem): void {
    doc.favorite = !doc.favorite;
  }

  previewDoc(doc: DocumentItem): void {
    this.previewingDoc.set(doc);
  }

  downloadDoc(doc: DocumentItem): void {
    this.notifService.success('Download Complete', `${doc.title} (${doc.size})`);
  }
}

