import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AppUser } from '../../core/services/admin.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users">
      <div class="page-header">
        <h2 class="page-title">Users Management</h2>
      </div>

      @if (adminService.users().length > 0) {
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of adminService.users()">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" [class]="user.role">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class]="user.status">
                    {{ user.status }}
                  </span>
                </td>
                <td>{{ user.registeredAt | date:'short' }}</td>
                <td>
                  <div class="actions">
                    <button class="btn-icon" (click)="openModal(user)" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
                      </svg>
                    </button>
                    <button class="btn-icon danger" (click)="deleteUser(user.id!)" title="Delete">
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2"/>
            <circle cx="9" cy="7" r="4" stroke-width="2"/>
          </svg>
          <h3>No users yet</h3>
          <p>Users will appear here once they register</p>
        </div>
      }

      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Edit User</h3>
              <button class="btn-close" (click)="closeModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Name</label>
                <input type="text" [(ngModel)]="formData.name" class="form-input" placeholder="User name">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="formData.email" class="form-input" disabled>
              </div>
              <div class="form-group">
                <label>Role</label>
                <select [(ngModel)]="formData.role" class="form-input">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select [(ngModel)]="formData.status" class="form-input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="closeModal()">Cancel</button>
              <button class="btn-primary" (click)="saveUser()" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .users {
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

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .role-badge.admin {
      background: #dbeafe;
      color: #1e40af;
    }

    .role-badge.user {
      background: #e0e7ff;
      color: #3730a3;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
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
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
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
      width: 100%;
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

    .form-input:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
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
      .users {
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
export class UsersComponent {
  showModal = signal(false);
  editingId = signal<string | null>(null);
  isSaving = signal(false);
  
  formData = {
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'inactive'
  };

  constructor(public adminService: AdminService) {}

  openModal(user: AppUser): void {
    this.editingId.set(user.id!);
    this.formData = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  async saveUser(): Promise<void> {
    this.isSaving.set(true);
    try {
      if (this.editingId()) {
        await this.adminService.updateUser(this.editingId()!, this.formData);
      }
      this.closeModal();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteUser(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await this.adminService.deleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    };
    this.editingId.set(null);
  }
}
