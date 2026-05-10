import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="login-wrap">
      <section class="login-card">
        <h1>Sistema de Transporte</h1>
        <p>Ingresa para continuar.</p>

        <p *ngIf="error" class="error">{{ error }}</p>

        <form (ngSubmit)="onSubmit()">
          <label for="documento">Documento</label>
          <input id="documento" name="documento" [(ngModel)]="documento" required />

          <label for="contrasena">Contrasena</label>
          <input id="contrasena" type="password" name="contrasena" [(ngModel)]="contrasena" required />

          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  `,
  styles: [
    `
      .login-wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1rem;
      }

      .login-card {
        width: min(420px, 100%);
        padding: 1.5rem;
        border-radius: 14px;
        background: #ffffff;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
      }

      h1 {
        margin: 0;
      }

      p {
        margin: 0.35rem 0 1rem;
      }

      form {
        display: grid;
        gap: 0.6rem;
      }

      input {
        border: 1px solid #cfd8dc;
        border-radius: 8px;
        padding: 0.65rem;
      }

      button {
        margin-top: 0.5rem;
        border: 0;
        border-radius: 8px;
        padding: 0.7rem;
        font-weight: 700;
        color: #fff;
        background: #0f766e;
        cursor: pointer;
      }

      .error {
        margin: 0 0 0.75rem;
        color: #b91c1c;
      }
    `,
  ],
})
export class LoginComponent {
  documento = '';
  contrasena = '';
  error = '';

  constructor(
    private readonly router: Router,
    private readonly usuarioService: UsuarioService,
  ) {}

  onSubmit(): void {
    this.error = '';

    this.usuarioService.login({ documento: this.documento, contrasena: this.contrasena }).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('documento', this.documento);
        const target = response.role === 'admin' ? '/app/administradores' : '/app/cliente';
        this.router.navigateByUrl(target);
      },
      error: () => {
        this.error = 'Documento o contrasena invalidos.';
      },
    });
  }
}
