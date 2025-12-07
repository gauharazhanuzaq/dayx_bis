import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2 class="page-title">Dashboard Overview</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2"/>
              <circle cx="9" cy="7" r="4" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Users</p>
            <p class="stat-value">{{ stats().totalUsers }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2"/>
              <path d="M22 4L12 14.01l-3-3" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Active Users</p>
            <p class="stat-value">{{ stats().activeUsers }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="2"/>
              <path d="M14 2v6h6" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Reports</p>
            <p class="stat-value">{{ stats().totalReports }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Pending Reports</p>
            <p class="stat-value">{{ stats().pendingReports }}</p>
          </div>
        </div>
      </div>

      <div class="recent-section">
        <h3 class="section-title">Recent Activity</h3>
        @if (recentReports().length > 0) {
          <div class="activity-list">
            <div class="activity-item" *ngFor="let report of recentReports()">
              <div class="activity-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-title">{{ report.title }}</p>
                <p class="activity-desc">{{ report.description }}</p>
                <p class="activity-time">{{ report.createdAt | date:'short' }}</p>
              </div>
              <span class="status-badge" [class]="report.status">
                {{ report.status }}
              </span>
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="2"/>
            </svg>
            <p>No reports yet</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.blue { background: #3b82f6; }
    .stat-icon.green { background: #10b981; }
    .stat-icon.orange { background: #f59e0b; }
    .stat-icon.purple { background: #8b5cf6; }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
    }

    .recent-section {
      background: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      align-items: flex-start;
    }

    .activity-icon {
      color: #3b82f6;
      margin-top: 0.25rem;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .activity-desc {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .activity-time {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #9ca3af;
    }

    .empty-state svg {
      margin: 0 auto 1rem;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  constructor(private adminService: AdminService) {}

  stats = computed(() => {
    const users = this.adminService.users();
    const reports = this.adminService.reports();
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === 'pending').length
    };
  });

  recentReports = computed(() => {
    return this.adminService.reports().slice(0, 5);
  });
}