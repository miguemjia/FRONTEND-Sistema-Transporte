import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <aside>
        <h2>Transporte</h2>
        <nav>
          <a routerLink="administradores" routerLinkActive="active">Administradores</a>
          <a routerLink="cliente" routerLinkActive="active">Cliente</a>
          <a routerLink="empleado" routerLinkActive="active">Empleado</a>
          <a routerLink="ruta" routerLinkActive="active">Ruta</a>
          <a routerLink="tarjeta" routerLinkActive="active">Tarjeta</a>
          <a routerLink="tipo-empleado" routerLinkActive="active">Tipo Empleado</a>
          <a routerLink="vehiculos" routerLinkActive="active">Vehiculos</a>
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
  constructor(private readonly router: Router) {}

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('/login');
  }
}
