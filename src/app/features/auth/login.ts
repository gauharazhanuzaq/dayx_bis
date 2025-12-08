import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
            <img src="/logo2.png" alt="logo">
          <h1>Admin Panel</h1>
          <p>Sign in with your Firebase account</p>
        </div>
        
        @if (errorMessage()) {
          <div class="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path d="M12 8v4M12 16h.01" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form (ngSubmit)="login()" class="login-form">
          <div class="form-group">
            <label for="email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke-width="2"/>
                <path d="M22 6l-10 7L2 6" stroke-width="2"/>
              </svg>
              Email
            </label>
            <input 
              id="email"
              type="email" 
              [(ngModel)]="email" 
              name="email"
              class="form-input"
              placeholder="admin@example.com"
              autocomplete="email"
              [class.has-error]="errorMessage()"
              required
            >
          </div>

          <div class="form-group">
            <label for="password">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-width="2"/>
              </svg>
              Password
            </label>
            <div class="password-wrapper">
              <input 
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password" 
                class="form-input"
                placeholder="Enter your password"
                autocomplete="current-password"
                [class.has-error]="errorMessage()"
                required
              >
              <button 
                type="button" 
                class="toggle-password"
                (click)="togglePassword()"
              >
                @if (showPassword()) {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke-width="2"/>
                  </svg>
                } @else {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke-width="2"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke-width="2"/>
                  </svg>
                }
              </button>
            </div>
          </div>

          <button type="submit" class="btn-login" [disabled]="isLoading()">
            @if (isLoading()) {
              <span class="spinner"></span>
              <span>Signing in...</span>
            } @else {
              <span>Sign In</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            }
          </button>
        </form>

        <div class="info-section">
          <p class="info-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Only admin accounts can access this panel
          </p>
        </div>
      </div>

      <div class="login-footer">
        <p>© 2024 Admin Panel. Powered by Firebase</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      position: fixed; 
      inset: 0;    
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #dde8f0ff;
      overflow: auto;  
      z-index: 0;    
    }

    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 1.25rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-width: 440px;
      position: relative;
      z-index: 1;
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo-section {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo-section img {
      width: 30%;
      height: 30%;
      object-fit: contain;
    }
    .logo-section h1 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .logo-section p {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
      padding: 0.875rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid #fecaca;
      animation: shake 0.4s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input {
      width: 92%;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      transition: all 0.2s;
      background: #f9fafb;
    }

    .form-input:focus {
      outline: none;
      border-color: #121e56ff;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-input.has-error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .password-wrapper {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }

    .toggle-password:hover {
      color: #374151;
    }

    .btn-login {
      width: 100%;
      background: #214992ff;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
      margin-top: 0.5rem;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .info-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .info-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
      font-size: 0.875rem;
      justify-content: center;
    }

    .info-text svg {
      flex-shrink: 0;
    }

    .login-footer {
      margin-top: 2rem;
      text-align: center;
      color: rgba(2, 2, 2, 0.8);
      font-size: 0.875rem;
      position: relative;
      z-index: 1;
    }

    @media (max-width: 640px) {
      .login-container {
        padding: 1rem;
      }

      .login-card {
        padding: 2rem 1.5rem;
      }

      .logo-circle {
        width: 64px;
        height: 64px;
      }

      .logo-section h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = signal('');
  showPassword = signal(false);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async login(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      let message = 'Login failed. Please try again.';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Invalid credentials. Please check your email and password.';
      } else if (error.message === 'Access denied. Admin role required.') {
        message = 'Access denied. Only admin accounts can login.';
      } else if (error.message === 'User profile not found. Please contact administrator.') {
        message = 'User profile not found. Check Firestore database.';
      }

      this.errorMessage.set(message);
      console.error('Full error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}