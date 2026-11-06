import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { ResourceDomain, PermissionAction } from '../../core/models/role-permission.model';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BadgeComponent, ProgressBarComponent],
  template: `
    <div class="admin-viewport">
      <!-- Header -->
      <header class="page-header">
        <div class="header-left">
          <div class="breadcrumb-trail">
            <span>Administration</span>
            <span class="bc-sep">/</span>
            <span class="bc-active">{{ getTabTitle() }}</span>
          </div>
          <h1 class="page-title">Enterprise System Administration & Governance</h1>
          <p class="page-subtitle">
            Configure global access control, identity federation, third-party integrations, and audit policies
          </p>
        </div>

        <div class="header-right">
          <app-badge variant="emerald" size="md" [dot]="true">SOC2 Type II Compliant</app-badge>
        </div>
      </header>

      <!-- Admin Navigation Tabs -->
      <div class="admin-tabs-nav">
        <button
          type="button"
          class="at-btn"
          [class.active]="activeTab === 'roles'"
          (click)="activeTab = 'roles'"
        >
          <app-icon name="shield" [size]="14"></app-icon>
          <span>Roles & Permissions Matrix</span>
        </button>
        <button
          type="button"
          class="at-btn"
          [class.active]="activeTab === 'integrations'"
          (click)="activeTab = 'integrations'"
        >
          <app-icon name="zap" [size]="14"></app-icon>
          <span>Ecosystem Integrations</span>
        </button>
        <button
          type="button"
          class="at-btn"
          [class.active]="activeTab === 'organization'"
          (click)="activeTab = 'organization'"
        >
          <app-icon name="server" [size]="14"></app-icon>
          <span>Organization Profile</span>
        </button>
        <button
          type="button"
          class="at-btn"
          [class.active]="activeTab === 'billing'"
          (click)="activeTab = 'billing'"
        >
          <app-icon name="credit-card" [size]="14"></app-icon>
          <span>Enterprise Billing</span>
        </button>
        <button
          type="button"
          class="at-btn"
          [class.active]="activeTab === 'audit'"
          (click)="activeTab = 'audit'"
        >
          <app-icon name="activity" [size]="14"></app-icon>
          <span>Security Audit Trail</span>
        </button>
      </div>

      <!-- TAB 1: ROLES & PERMISSIONS MATRIX -->
      <div *ngIf="activeTab === 'roles'" class="admin-tab-body">
        <div class="orbit-card">
          <div class="orbit-card-header">
            <div>
              <h3 class="orbit-card-title">
                <app-icon name="shield" [size]="16"></app-icon>
                <span>Granular Access Control Matrix</span>
              </h3>
              <span class="orbit-card-subtitle">Define domain entitlements for all 7 platform roles</span>
            </div>
            <button
              type="button"
              class="orbit-btn orbit-btn-primary orbit-btn-sm"
              (click)="notifService.success('Permission Matrix Saved', 'Changes propagated to distributed session cache')"
            >
              <app-icon name="check" [size]="13"></app-icon>
              <span>Save Changes</span>
            </button>
          </div>

          <div class="orbit-card-body p-0">
            <div class="orbit-table-container">
              <table class="orbit-table matrix-table">
                <thead>
                  <tr>
                    <th style="width: 220px;">Resource Domain</th>
                    <th>View</th>
                    <th>Create</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Manage</th>
                    <th>Export</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let d of domains">
                    <td>
                      <div class="domain-title-wrap">
                        <span class="d-title">{{ d.label }}</span>
                        <span class="d-sub">{{ d.description }}</span>
                      </div>
                    </td>
                    <td *ngFor="let act of actions" class="text-center">
                      <label class="matrix-checkbox-wrap">
                        <input
                          type="checkbox"
                          class="matrix-chk"
                          [checked]="hasPermission(d.id, act)"
                          (change)="togglePermission(d.id, act)"
                        />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: INTEGRATIONS -->
      <div *ngIf="activeTab === 'integrations'" class="admin-tab-body">
        <div class="integrations-grid">
          <div *ngFor="let int of integrations" class="integration-card">
            <div class="int-card-head">
              <div class="int-icon-box" [style.color]="int.color">
                <app-icon [name]="int.icon" [size]="20"></app-icon>
              </div>
              <app-badge [variant]="int.connected ? 'emerald' : 'graphite'" size="sm">
                {{ int.connected ? 'CONNECTED' : 'DISCONNECTED' }}
              </app-badge>
            </div>
            <h3 class="int-name">{{ int.name }}</h3>
            <p class="int-desc">{{ int.description }}</p>
            <div class="int-card-foot">
              <span class="int-last-sync" *ngIf="int.lastSync">Last sync: {{ int.lastSync }}</span>
              <button
                type="button"
                class="orbit-btn orbit-btn-sm"
                [class.orbit-btn-danger]="int.connected"
                [class.orbit-btn-secondary]="!int.connected"
                (click)="toggleIntegration(int)"
              >
                {{ int.connected ? 'Disconnect' : 'Connect Integration' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: ORGANIZATION -->
      <div *ngIf="activeTab === 'organization'" class="admin-tab-body">
        <div class="orbit-card">
          <div class="orbit-card-header">
            <h3 class="orbit-card-title">
              <app-icon name="server" [size]="16"></app-icon>
              <span>Organization Configuration</span>
            </h3>
          </div>
          <div class="orbit-card-body">
            <div class="org-fields-grid">
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Legal Entity Name</span></label>
                <input type="text" class="orbit-input" value="Global Tech Enterprise Inc." />
              </div>
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Primary SSO Federation Domain</span></label>
                <input type="text" class="orbit-input" value="orbit-enterprise.io" />
              </div>
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Default Data Residency Region</span></label>
                <input type="text" class="orbit-input" value="US-East (N. Virginia, ISO 27001)" />
              </div>
              <div class="orbit-form-group">
                <label class="orbit-label"><span>Audit Log Retention Duration</span></label>
                <input type="text" class="orbit-input" value="7 Years (WORM Immutable Glacier)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: BILLING -->
      <div *ngIf="activeTab === 'billing'" class="admin-tab-body">
        <div class="billing-cards-grid">
          <!-- Subscription Tier -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">Enterprise Tier Subscription</h3>
              <app-badge variant="emerald" size="sm">ACTIVE</app-badge>
            </div>
            <div class="orbit-card-body">
              <div class="billing-metric">
                <span class="bm-amount">₹3,96,000</span>
                <span class="bm-term">/ month billed annually</span>
              </div>
              <p class="bm-desc">
                Includes unlimited projects, advanced telemetry, custom SAML SSO broker, and 24/7 dedicated solutions engineering.
              </p>
              <div class="seats-meter">
                <div class="sm-top">
                  <span>Provisioned Seats</span>
                  <span>20 of 50 Licenses Assigned</span>
                </div>
                <app-progress-bar [value]="40" [height]="6" variant="emerald"></app-progress-bar>
              </div>
            </div>
          </div>

          <!-- Tax & GST Compliance -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">Tax & GSTIN Compliance</h3>
              <app-badge variant="emerald" size="sm">VERIFIED</app-badge>
            </div>
            <div class="orbit-card-body">
              <div class="gst-info-grid">
                <div class="gst-item">
                  <span class="gst-label">Registered Entity</span>
                  <span class="gst-val">Vertex Global Enterprise Technologies Pvt Ltd</span>
                </div>
                <div class="gst-item">
                  <span class="gst-label">GSTIN / Tax ID</span>
                  <span class="gst-val"><code>29AAACV1234F1Z5</code> (Karnataka)</span>
                </div>
                <div class="gst-item">
                  <span class="gst-label">Applicable Tax</span>
                  <span class="gst-val">18% IGST (or 9% CGST + 9% SGST)</span>
                </div>
                <div class="gst-item">
                  <span class="gst-label">TDS Exemption</span>
                  <span class="gst-val">Section 194J Compliant (Form 16A verified)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="orbit-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">Indian Enterprise Payment Methods</h3>
              <button type="button" class="orbit-btn orbit-btn-secondary orbit-btn-sm" (click)="notifService.info('Payment Method', 'Add corporate payment method')">
                <app-icon name="plus" [size]="13"></app-icon>
                <span>Add Method</span>
              </button>
            </div>
            <div class="orbit-card-body">
              <div class="payment-methods-list">
                <div class="pm-row">
                  <div class="pm-info">
                    <span class="pm-type">NEFT / RTGS (Corporate Wire)</span>
                    <span class="pm-sub">HDFC Bank •••• 9401 (Current Account)</span>
                  </div>
                  <app-badge variant="emerald" size="sm">PRIMARY</app-badge>
                </div>
                <div class="pm-row">
                  <div class="pm-info">
                    <span class="pm-type">Corporate NetBanking</span>
                    <span class="pm-sub">ICICI Bank •••• 4120</span>
                  </div>
                  <span class="pm-action-link">Verified</span>
                </div>
                <div class="pm-row">
                  <div class="pm-info">
                    <span class="pm-type">Corporate UPI VPA</span>
                    <span class="pm-sub">vertex.enterprise@hdfcbank</span>
                  </div>
                  <span class="pm-action-link">Active</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Tax Invoices Table -->
          <div class="orbit-card billing-full-card">
            <div class="orbit-card-header">
              <h3 class="orbit-card-title">Recent Tax Invoices & GST Receipts</h3>
              <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-sm" (click)="notifService.success('Tax Package Exported', 'All FY 2026-27 GST invoices downloaded')">
                Download All (ZIP)
              </button>
            </div>
            <div class="orbit-card-body p-0">
              <div class="orbit-table-container">
                <table class="orbit-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Billing Period</th>
                      <th>Gross Amount (INR)</th>
                      <th>GST (18% IGST)</th>
                      <th>Total Paid</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>INV-2026-0891</code></td>
                      <td>01 Oct 2026 – 31 Oct 2026</td>
                      <td>₹3,35,932.20</td>
                      <td>₹60,467.80</td>
                      <td><strong>₹3,96,400.00</strong></td>
                      <td><app-badge variant="emerald" size="sm">PAID</app-badge></td>
                      <td>
                        <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-sm" (click)="notifService.success('Invoice Downloaded', 'INV-2026-0891.pdf')">
                          <app-icon name="download" [size]="13"></app-icon>
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td><code>INV-2026-0812</code></td>
                      <td>01 Sep 2026 – 30 Sep 2026</td>
                      <td>₹3,35,932.20</td>
                      <td>₹60,467.80</td>
                      <td><strong>₹3,96,400.00</strong></td>
                      <td><app-badge variant="emerald" size="sm">PAID</app-badge></td>
                      <td>
                        <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-sm" (click)="notifService.success('Invoice Downloaded', 'INV-2026-0812.pdf')">
                          <app-icon name="download" [size]="13"></app-icon>
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td><code>INV-2026-0740</code></td>
                      <td>01 Aug 2026 – 31 Aug 2026</td>
                      <td>₹3,35,932.20</td>
                      <td>₹60,467.80</td>
                      <td><strong>₹3,96,400.00</strong></td>
                      <td><app-badge variant="emerald" size="sm">PAID</app-badge></td>
                      <td>
                        <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-sm" (click)="notifService.success('Invoice Downloaded', 'INV-2026-0740.pdf')">
                          <app-icon name="download" [size]="13"></app-icon>
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: AUDIT LOGS -->
      <div *ngIf="activeTab === 'audit'" class="admin-tab-body">
        <div class="orbit-card">
          <div class="orbit-card-header">
            <h3 class="orbit-card-title">Immutable Security Event Ledger</h3>
            <button type="button" class="orbit-btn orbit-btn-secondary orbit-btn-sm" (click)="notifService.success('Audit Log Exported', 'SHA256 signature verified')">
              Download Audit Package
            </button>
          </div>
          <div class="orbit-card-body p-0">
            <div class="orbit-table-container">
              <table class="orbit-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Resource Target</th>
                    <th>IP Origin</th>
                    <th>Verification Hash</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let l of auditLogs">
                    <td><span class="log-time">{{ l.timestamp }}</span></td>
                    <td><strong>{{ l.actor }}</strong></td>
                    <td><span class="log-act">{{ l.action }}</span></td>
                    <td>{{ l.target }}</td>
                    <td><code>{{ l.ip }}</code></td>
                    <td><code class="hash-tag">{{ l.hash }}</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-viewport {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
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

    .admin-tabs-nav {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 12px;
      overflow-x: auto;
    }

    .at-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 34px;
      padding: 0 14px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .at-btn:hover { background: var(--surface-secondary); color: var(--text-primary); }
    .at-btn.active {
      background: var(--surface-tertiary);
      border-color: var(--border-strong);
      color: var(--text-primary);
      font-weight: 600;
    }

    .admin-tab-body {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .p-0 { padding: 0; }

    .matrix-table th, .matrix-table td {
      vertical-align: middle;
    }
    .text-center { text-align: center; }

    .domain-title-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .d-title {
      font-weight: 600;
      color: var(--text-primary);
    }
    .d-sub {
      font-size: 11px;
      color: var(--text-muted);
    }

    .matrix-checkbox-wrap {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .matrix-chk {
      width: 16px;
      height: 16px;
      accent-color: var(--accent-emerald);
      cursor: pointer;
    }

    /* Integrations */
    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .integration-card {
      background: var(--surface-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: var(--shadow-sm);
    }

    .int-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .int-icon-box {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .int-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .int-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .int-card-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 12px;
      margin-top: auto;
    }

    .int-last-sync {
      font-size: 11px;
      color: var(--text-muted);
    }

    .org-fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 600px) {
      .org-fields-grid {
        grid-template-columns: 1fr;
      }
    }

    .billing-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 16px;
    }

    .billing-full-card {
      grid-column: 1 / -1;
    }

    .gst-info-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .gst-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12.5px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .gst-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .gst-label {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .gst-val {
      color: var(--text-primary);
      font-weight: 600;
    }

    .payment-methods-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .pm-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: var(--surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
    }

    .pm-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .pm-type {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .pm-sub {
      font-size: 11px;
      color: var(--text-muted);
    }

    .pm-action-link {
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-emerald);
    }
    .bm-amount {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .bm-term {
      font-size: 12px;
      color: var(--text-muted);
    }
    .bm-desc {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 10px 0 16px;
    }

    .seats-meter {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .sm-top {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
    }

    .log-time { font-size: 11px; color: var(--text-muted); }
    .log-act { color: var(--accent-emerald); font-weight: 600; }
    .hash-tag { font-size: 10px; color: var(--text-muted); }
  `]
})
export class AdministrationComponent {
  public dataService = inject(DataService);
  public notifService = inject(NotificationService);

  public activeTab: 'roles' | 'integrations' | 'organization' | 'billing' | 'audit' = 'roles';

  public actions: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'manage', 'export'];

  public domains: { id: ResourceDomain; label: string; description: string }[] = [
    { id: 'projects', label: 'Projects & Workspaces', description: 'Create, modify and archive portfolios' },
    { id: 'tasks', label: 'Tasks & Sprints', description: 'Task state transitions and assignment' },
    { id: 'financials', label: 'Budgets & Financials', description: 'Capital allocation and spend reports' },
    { id: 'team_members', label: 'Personnel & Directory', description: 'User onboarding and role adjustment' },
    { id: 'reports', label: 'Analytics & Reporting', description: 'Executive burndown and audit downloads' },
    { id: 'system_settings', label: 'System Configuration', description: 'SSO, CORS and domain whitelisting' },
    { id: 'integrations', label: 'API & Integrations', description: 'OAuth tokens and webhook credentials' },
    { id: 'audit_logs', label: 'Security Audit Logs', description: 'Immutable WORM compliance archives' }
  ];

  public permissionsState: Record<string, boolean> = {
    'projects:view': true, 'projects:create': true, 'projects:edit': true, 'projects:manage': true, 'projects:export': true,
    'tasks:view': true, 'tasks:create': true, 'tasks:edit': true, 'tasks:delete': true, 'tasks:manage': true, 'tasks:export': true,
    'financials:view': true, 'financials:manage': true, 'financials:export': true,
    'team_members:view': true, 'team_members:create': true, 'team_members:edit': true, 'team_members:manage': true,
    'reports:view': true, 'reports:create': true, 'reports:export': true,
    'system_settings:view': true, 'system_settings:edit': true, 'system_settings:manage': true,
    'integrations:view': true, 'integrations:edit': true, 'integrations:manage': true,
    'audit_logs:view': true, 'audit_logs:export': true
  };

  public integrations = [
    { name: 'GitHub Enterprise', description: 'Automated PR sync, commit linking, and CI/CD status checks', icon: 'zap', color: '#10B981', connected: true, lastSync: '2m ago' },
    { name: 'Slack Workplace', description: 'Real-time alert notifications and direct incident triggers', icon: 'message-square', color: '#F59E0B', connected: true, lastSync: '10m ago' },
    { name: 'Figma Design Tokens', description: 'Sync typography and color token variables directly into SCSS', icon: 'layers', color: '#8B5CF6', connected: true, lastSync: '1h ago' },
    { name: 'Jira Cloud Bi-Directional', description: 'Two-way sync for legacy enterprise service desk tickets', icon: 'check-square', color: '#059669', connected: true, lastSync: '4h ago' },
    { name: 'Sentry Crash Telemetry', description: 'Correlate production exception spikes with sprint deployments', icon: 'alert-triangle', color: '#EF4444', connected: false },
    { name: 'AWS CloudWatch & EKS', description: 'Real-time node metrics, pod autoscaling alerts, and ingress logs', icon: 'server', color: '#EA580C', connected: true, lastSync: '15m ago' }
  ];

  public auditLogs = [
    { timestamp: '05 Nov 2026, 15:44 IST', actor: 'Ananya Iyer', action: 'PROJECT_BUDGET_ADJUSTED', target: 'PRJ-ALPHA (Budget +₹45,00,000)', ip: '192.168.1.104', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { timestamp: '05 Nov 2026, 14:10 IST', actor: 'Vikram Malhotra', action: 'WEBAUTHN_POLICY_ENFORCE', target: 'Zero-Trust FIDO2 Enclave', ip: '192.168.2.45', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
    { timestamp: '04 Nov 2026, 17:52 IST', actor: 'Priya Sharma', action: 'DATABASE_FAILOVER_SIMULATE', target: 'PostgreSQL Citus Worker Pool', ip: '10.0.12.88', hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
    { timestamp: '04 Nov 2026, 11:20 IST', actor: 'Rohan Deshmukh', action: 'SECURITY_AUDIT_VERIFIED', target: 'SOC2 & ISO-27001 Cryptographic Ledger', ip: '10.0.14.22', hash: '9b821a37c92ebbfca31c944810a911dca99017bc9a888b172a0f829a8829f001' }
  ];

  getTabTitle(): string {
    switch (this.activeTab) {
      case 'roles': return 'Roles & Permissions';
      case 'integrations': return 'Integrations';
      case 'organization': return 'Organization';
      case 'billing': return 'Billing';
      case 'audit': return 'Audit Logs';
    }
  }

  hasPermission(domain: ResourceDomain, action: PermissionAction): boolean {
    return !!this.permissionsState[`${domain}:${action}`];
  }

  togglePermission(domain: ResourceDomain, action: PermissionAction): void {
    const key = `${domain}:${action}`;
    this.permissionsState[key] = !this.permissionsState[key];
  }

  toggleIntegration(int: any): void {
    int.connected = !int.connected;
    if (int.connected) {
      int.lastSync = 'Just now';
      this.notifService.success('Integration Connected', `${int.name} successfully authorized`);
    } else {
      this.notifService.warning('Integration Disconnected', `${int.name} disconnected`);
    }
  }
}

