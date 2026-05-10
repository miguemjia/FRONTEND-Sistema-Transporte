import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UsuarioService } from '../../core/services/usuario.service';
import { ClienteResponse } from '../../models/api.models';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="header-row">
        <div>
        <h1>Clientes</h1>
        <p>Listado de clientes guardados en la base de datos.</p>
        </div>
        <button type="button" class="secondary" (click)="toggleForm()">
          {{ showForm ? 'Cerrar' : 'Agregar' }}
        </button>
      </header>

      <form class="form-card" *ngIf="showForm" (ngSubmit)="createCliente()">
        <div class="grid">
          <label>
            Documento
            <input name="documento" [(ngModel)]="form.documento" required />
          </label>
          <label>
            Contrasena
            <input name="contrasena" type="password" [(ngModel)]="form.contrasena" required />
          </label>
          <label>
            Nombre
            <input name="nombre" [(ngModel)]="form.nombre" required />
          </label>
          <label>
            Email
            <input name="email" [(ngModel)]="form.email" required />
          </label>
          <label>
            Telefono
            <input name="telefono" [(ngModel)]="form.telefono" required />
          </label>
          <label>
            Direccion
            <input name="direccion" [(ngModel)]="form.direccion" required />
          </label>
        </div>
        <button type="submit" class="primary">Guardar</button>
      </form>

      <p *ngIf="loading">Cargando clientes...</p>
      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="success" class="success">{{ success }}</p>

      <div class="table-wrap" *ngIf="!loading && !error">
        <table>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Direccion</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cliente of clientes">
              <td>{{ cliente.documento }}</td>
              <td>{{ cliente.nombre }}</td>
              <td>{{ cliente.email }}</td>
              <td>{{ cliente.telefono }}</td>
              <td>{{ cliente.direccion }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 1rem;
      }

      .header-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: end;
      }

      .form-card {
        border: 1px solid #dbe4ea;
        border-radius: 12px;
        background: #fff;
        padding: 1rem;
        display: grid;
        gap: 1rem;
      }

      .grid {
        display: grid;
        gap: 0.85rem;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      label {
        display: grid;
        gap: 0.35rem;
        font-weight: 600;
      }

      input {
        border: 1px solid #cfd8dc;
        border-radius: 8px;
        padding: 0.65rem;
        font: inherit;
      }

      .primary,
      .secondary {
        border: 0;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        cursor: pointer;
        font-weight: 700;
      }

      .primary {
        background: #0f766e;
        color: #fff;
      }

      .secondary {
        background: #e2e8f0;
        color: #0f172a;
      }

      .table-wrap {
        overflow: auto;
        border: 1px solid #dbe4ea;
        border-radius: 12px;
        background: #fff;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 0.8rem 0.9rem;
        text-align: left;
        border-bottom: 1px solid #e5eef3;
      }

      th {
        background: #f8fafc;
      }

      .error {
        color: #b91c1c;
      }

      .success {
        color: #166534;
      }
    `,
  ],
})
export class ClienteComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  clientes: ClienteResponse[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  form = {
    documento: '',
    contrasena: '',
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  };

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  private loadClientes(): void {
    this.loading = true;
    this.usuarioService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los clientes.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  createCliente(): void {
    this.error = '';
    this.success = '';

    this.usuarioService.createCliente({ ...this.form }).subscribe({
      next: () => {
        this.success = 'Cliente agregado correctamente.';
        this.form = {
          documento: '',
          contrasena: '',
          nombre: '',
          email: '',
          telefono: '',
          direccion: '',
        };
        this.showForm = false;
        this.loadClientes();
      },
      error: () => {
        this.error = 'No se pudo guardar el cliente.';
        this.cdr.detectChanges();
      },
    });
  }
}
