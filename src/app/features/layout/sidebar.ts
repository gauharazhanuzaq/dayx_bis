import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.open]="isOpen()">
      <nav class="nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2"/>
          </svg>
          <span>Dashboard</span>
        </a>
        
        <a routerLink="/reports" routerLinkActive="active" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="2"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke-width="2"/>
          </svg>
          <span>Reports</span>
        </a>
        
        <a routerLink="/users" routerLinkActive="active" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2"/>
            <circle cx="9" cy="7" r="4" stroke-width="2"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2"/>
          </svg>
          <span>Users</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      background: white;
      border-right: 1px solid #e5e7eb;
      width: 250px;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      padding-top: 5rem;
      transition: transform 0.3s;
    }

    .nav {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 0.5rem;
      transition: all 0.2s;
      font-weight: 500;
    }

    .nav-item:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .nav-item.active {
      background: #3b82f6;
      color: white;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        z-index: 40;
      }

      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  isOpen = input<boolean>(false);
}
