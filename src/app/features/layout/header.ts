import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-content">
    <div class="header-logo">
      <img src="/logo2.png" alt="logo">
    </div>
        
        <h1 class="header-title">Admin Panel</h1>
        
        <div class="header-actions">
          <div class="user-info">
            <span class="user-name">{{ authService.currentUser()?.displayName || authService.currentUser()?.email }}</span>
            <span class="user-role">{{ authService.currentUser()?.role }}</span>
          </div>
          <button class="btn-logout" (click)="authService.logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-width="2"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height:70px;
      align-items:center;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      width: 100%;
      inset: 0; 
    }
    .header-logo img {
      width: 70px;
      height: auto;
      object-fit: contain;
    }
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
    }

    .menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      color: #374151;
      padding: 0.5rem;
      display: none;
    }

    .header-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .user-name {
      font-weight: 600;
      color: #111827;
      font-size: 0.875rem;
    }

    .user-role {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
    }

    .btn-logout {
      background: #dc2626;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-logout:hover {
      background: #b91c1c;
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: block;
      }

      .header-title {
        font-size: 1.25rem;
      }

      .user-info {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  toggleSidebar = output<void>();

  constructor(public authService: AuthService) { }
}