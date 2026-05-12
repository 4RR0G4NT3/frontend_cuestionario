import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <header class="main-header">
      <div class="logo">QuizApp</div>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="main-footer">
      <p>&copy; 2026 QuizApp - Cuestionarios de Derecho y Programación</p>
    </footer>
  `,
  styles: [`
    .main-header {
      background: #007bff;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    main {
      min-height: calc(100vh - 120px);
      background: #f4f7f9;
    }
    .main-footer {
      background: white;
      color: #666;
      text-align: center;
      padding: 1rem;
      border-top: 1px solid #eee;
    }
  `]
})
export class AppComponent {}
