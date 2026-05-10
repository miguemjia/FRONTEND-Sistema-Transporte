import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UsuarioService } from '../../core/services/usuario.service';
import { AdministradorResponse, ClienteResponse } from '../../models/api.models';

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="header-row">
        <div>
        <h1>Administradores</h1>
        <p>Listado de administradores guardados en la base de datos.</p>
        </div>
        <button type="button" class="secondary" (click)="toggleForm()">
          {{ showForm ? 'Cerrar' : 'Agregar' }}
        </button>
      </header>

      <form class="form-card" *ngIf="showForm" (ngSubmit)="createAdministrador()">
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
          <label class="full">
            Descripcion
            <input name="descripcion" [(ngModel)]="form.descripcion" />
          </label>
        </div>
        <button type="submit" class="primary">Guardar</button>
      </form>

      <p *ngIf="loading">Cargando administradores...</p>
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
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let admin of administradores">
              <td>{{ admin.documento }}</td>
              <td>{{ admin.nombre }}</td>
              <td>{{ admin.email }}</td>
              <td>{{ admin.telefono }}</td>
              <td>{{ admin.direccion }}</td>
              <td>{{ admin.descripcion || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <section class="section-block">
        <header class="header-row">
          <div>
            <h2>Clientes</h2>
            <p>Listado de clientes guardados en la base de datos.</p>
          </div>
          <button type="button" class="secondary" (click)="toggleClientForm()">
            {{ showClientForm ? 'Cerrar' : 'Agregar cliente' }}
          </button>
        </header>

        <form class="form-card" *ngIf="showClientForm" (ngSubmit)="createCliente()">
          <div class="grid">
            <label>
              Documento
              <input name="cliente_documento" [(ngModel)]="clientForm.documento" required />
            </label>
            <label>
              Contrasena
              <input name="cliente_contrasena" type="password" [(ngModel)]="clientForm.contrasena" required />
            </label>
            <label>
              Nombre
              <input name="cliente_nombre" [(ngModel)]="clientForm.nombre" required />
            </label>
            <label>
              Email
              <input name="cliente_email" [(ngModel)]="clientForm.email" required />
            </label>
            <label>
              Telefono
              <input name="cliente_telefono" [(ngModel)]="clientForm.telefono" required />
            </label>
            <label>
              Direccion
              <input name="cliente_direccion" [(ngModel)]="clientForm.direccion" required />
            </label>
          </div>
          <button type="submit" class="primary">Guardar cliente</button>
        </form>

        <p *ngIf="loadingClientes">Cargando clientes...</p>
        <div class="table-wrap" *ngIf="!loadingClientes && !clienteError">
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

        <p *ngIf="clienteError" class="error">{{ clienteError }}</p>
        <p *ngIf="clienteSuccess" class="success">{{ clienteSuccess }}</p>
      </section>
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

      .section-block {
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

      .full {
        grid-column: 1 / -1;
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
export class AdministradoresComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  administradores: AdministradorResponse[] = [];
  clientes: ClienteResponse[] = [];
  loading = true;
  loadingClientes = true;
  error = '';
  clienteError = '';
  success = '';
  clienteSuccess = '';
  showForm = false;
  showClientForm = false;
  form = {
    documento: '',
    contrasena: '',
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    descripcion: '',
  };
  clientForm = {
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

  toggleClientForm(): void {
    this.showClientForm = !this.showClientForm;
  }

  private loadAdministradores(): void {
    this.loading = true;
    this.usuarioService.getAdministradores().subscribe({
      next: (administradores: AdministradorResponse[]) => {
        this.administradores = administradores;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los administradores.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadClientes(): void {
    this.loadingClientes = true;
    this.usuarioService.getClientes().subscribe({
      next: (clientes: ClienteResponse[]) => {
        this.clientes = clientes;
        this.loadingClientes = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.clienteError = 'No se pudieron cargar los clientes.';
        this.loadingClientes = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.loadAdministradores();
    this.loadClientes();
  }

  createAdministrador(): void {
    this.error = '';
    this.success = '';

    this.usuarioService.createAdministrador({ ...this.form }).subscribe({
      next: () => {
        this.success = 'Administrador agregado correctamente.';
        this.form = {
          documento: '',
          contrasena: '',
          nombre: '',
          email: '',
          telefono: '',
          direccion: '',
          descripcion: '',
        };
        this.showForm = false;
        this.loadAdministradores();
      },
      error: () => {
        this.error = 'No se pudo guardar el administrador.';
        this.cdr.detectChanges();
      },
    });
  }

  createCliente(): void {
    this.clienteError = '';
    this.clienteSuccess = '';

    this.usuarioService.createCliente({ ...this.clientForm }).subscribe({
      next: () => {
        this.clienteSuccess = 'Cliente agregado correctamente.';
        this.clientForm = {
          documento: '',
          contrasena: '',
          nombre: '',
          email: '',
          telefono: '',
          direccion: '',
        };
        this.showClientForm = false;
        this.loadClientes();
      },
      error: () => {
        this.clienteError = 'No se pudo guardar el cliente.';
        this.cdr.detectChanges();
      },
    });
  }
}
