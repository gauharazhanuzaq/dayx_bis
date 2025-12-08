import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Report } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports">
      <div class="page-header">
        <h2 class="page-title">Reports Management</h2>
        <button class="btn-primary" (click)="openModal('create')">
          + New Report
        </button>
      </div>

      @if (adminService.reports().length > 0) {
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let report of adminService.reports()">
                <td>{{ report.title }}</td>
                <td>{{ report.description }}</td>
                <td>
                  <span class="status-badge" [class]="report.status">
                    {{ report.status }}
                  </span>
                </td>
                <td>{{ report.createdAt | date:'short' }}</td>
                <td>
                  <div class="actions">
                    <button class="btn-icon" (click)="openModal('edit', report)" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
                      </svg>
                    </button>
                    <button class="btn-icon danger" (click)="deleteReport(report.id!)" title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      } @else {
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="2"/>
            <path d="M14 2v6h6" stroke-width="2"/>
          </svg>
          <h3>No reports yet</h3>
          <p>Get started by creating your first report</p>
          <button class="btn-primary" (click)="openModal('create')">Create Report</button>
        </div>
      }

      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ modalMode() === 'create' ? 'Create Report' : 'Edit Report' }}</h3>
              <button class="btn-close" (click)="closeModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Title</label>
                <input type="text" [(ngModel)]="formData.title" class="form-input" placeholder="Report title">
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="formData.description" class="form-input" rows="3" placeholder="Report description"></textarea>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select [(ngModel)]="formData.status" class="form-input">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="closeModal()">Cancel</button>
              <button class="btn-primary" (click)="saveReport()" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .reports {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .table-container {
      background: white;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th,
    .table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    .table th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    .table td {
      color: #6b7280;
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

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: #f3f4f6;
      border: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      color: #374151;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #e5e7eb;
    }

    .btn-icon.danger {
      color: #dc2626;
    }

    .btn-icon.danger:hover {
      background: #fee2e2;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
    }

    .empty-state svg {
      color: #9ca3af;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .modal {
      background: white;
      border-radius: 0.75rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.2rem 1rem;
      border-bottom: 0.5px solid #e5e7eb;
    }

    .modal-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 2rem;
      color: #6b7280;
      cursor: pointer;
      line-height: 1;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-input {
      width: 95%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    @media (max-width: 768px) {
      .reports {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .table {
        font-size: 0.875rem;
      }

      .table th,
      .table td {
        padding: 0.75rem 0.5rem;
      }
    }
  `]
})
export class ReportsComponent {
  showModal = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  editingId = signal<string | null>(null);
  isSaving = signal(false);
  
  formData = {
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  };

  constructor(
    public adminService: AdminService,
    private authService: AuthService
  ) {}

  openModal(mode: 'create' | 'edit', report?: Report): void {
    this.modalMode.set(mode);
    if (mode === 'edit' && report) {
      this.editingId.set(report.id!);
      this.formData = {
        title: report.title,
        description: report.description,
        status: report.status
      };
    } else {
      this.resetForm();
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  async saveReport(): Promise<void> {
    this.isSaving.set(true);
    try {
      if (this.modalMode() === 'create') {
        await this.adminService.addReport({
          ...this.formData,
          createdAt: new Date(),
          userId: this.authService.currentUser()?.uid || ''
        });
      } else if (this.editingId()) {
        await this.adminService.updateReport(this.editingId()!, this.formData);
      }
      this.closeModal();
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteReport(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        await this.adminService.deleteReport(id);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report. Please try again.');
      }
    }
  }

  resetForm(): void {
    this.formData = {
      title: '',
      description: '',
      status: 'pending'
    };
    this.editingId.set(null);
  }
}