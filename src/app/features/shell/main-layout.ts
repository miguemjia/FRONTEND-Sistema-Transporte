import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <aside>
        <h2>Panel {{ isAdmin ? 'Administrador' : 'Cliente' }}</h2>
        <nav>
          <a *ngFor="let link of navLinks" [routerLink]="link.path" routerLinkActive="active">{{ link.label }}</a>
        </nav>
        <button type="button" (click)="logout()">Cerrar sesion</button>
      </aside>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .layout {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 250px 1fr;
      }

      aside {
        padding: 1rem;
        background: #0f172a;
        color: #e2e8f0;
      }

      h2 {
        margin-top: 0;
      }

      nav {
        display: grid;
        gap: 0.3rem;
        margin-bottom: 1rem;
      }

      a {
        color: #e2e8f0;
        text-decoration: none;
        padding: 0.4rem 0.55rem;
        border-radius: 7px;
      }

      a.active,
      a:hover {
        background: #1e293b;
      }

      button {
        border: 0;
        border-radius: 8px;
        padding: 0.5rem 0.65rem;
        cursor: pointer;
      }

      main {
        padding: 1rem;
      }

      @media (max-width: 900px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class MainLayoutComponent {
  private readonly adminLinks: NavLink[] = [
    { path: 'administradores', label: 'Administradores' },
    { path: 'empleado', label: 'Empleado' },
    { path: 'ruta', label: 'Ruta' },
    { path: 'tarjeta', label: 'Tarjeta' },
    { path: 'tipo-empleado', label: 'Tipo Empleado' },
    { path: 'vehiculos', label: 'Vehiculos' },
  ];

  private readonly clientLinks: NavLink[] = [
    { path: 'cliente', label: 'Cliente' },
  ];

  get role(): string | null {
    return localStorage.getItem('role');
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get navLinks(): NavLink[] {
    return this.isAdmin ? this.adminLinks : this.clientLinks;
  }

  constructor(private readonly router: Router) {}

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('documento');
    this.router.navigateByUrl('/login');
  }
}
