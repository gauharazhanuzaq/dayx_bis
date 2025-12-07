import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './features/layout/header';
import { SidebarComponent } from './features/layout/sidebar';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <div class="app-layout">
        <app-sidebar [isOpen]="sidebarOpen()" />
        <div class="main-content">
          <app-header (toggleSidebar)="toggleSidebar()" />
          <main>
            <router-outlet />
          </main>
        </div>
      </div>
    } @else {
      <router-outlet />
    }
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: #f9fafb;
    }

    .main-content {
      flex: 1;
      margin-left: 250px;
      transition: margin-left 0.3s;
    }

    main {
      min-height: calc(100vh - 5rem);
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
    }
  `]
})
export class App {
  sidebarOpen = signal(false);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
