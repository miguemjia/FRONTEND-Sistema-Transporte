import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UsuarioService } from '../../core/services/usuario.service';
import { EmpleadoResponse } from '../../models/api.models';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="header-row">
        <div>
        <h1>Empleados</h1>
        <p>Listado de empleados guardados en la base de datos.</p>
        </div>
        <button type="button" class="secondary" (click)="toggleForm()">
          {{ showForm ? 'Cerrar' : 'Agregar' }}
        </button>
      </header>

      <form class="form-card" *ngIf="showForm" (ngSubmit)="createEmpleado()">
        <div class="grid">
          <label>
            Documento
            <input name="documento" [(ngModel)]="form.documento" required />
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
          <label>
            Tipo Empleado Id
            <input name="Tipo_Empleado_id" type="number" [(ngModel)]="form.Tipo_Empleado_id" required />
          </label>
        </div>
        <button type="submit" class="primary">Guardar</button>
      </form>

      <p *ngIf="loading">Cargando empleados...</p>
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
              <th>Tipo Empleado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let empleado of empleados">
              <td>{{ empleado.documento }}</td>
              <td>{{ empleado.nombre }}</td>
              <td>{{ empleado.email }}</td>
              <td>{{ empleado.telefono }}</td>
              <td>{{ empleado.direccion }}</td>
              <td>{{ empleado.Tipo_Empleado_id }}</td>
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
export class EmpleadoComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  empleados: EmpleadoResponse[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  form = {
    documento: '',
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    Tipo_Empleado_id: 0,
  };

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  private loadEmpleados(): void {
    this.loading = true;
    this.usuarioService.getEmpleados().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los empleados.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.loadEmpleados();
  }

  createEmpleado(): void {
    this.error = '';
    this.success = '';

    this.usuarioService.createEmpleado({ ...this.form }).subscribe({
      next: () => {
        this.success = 'Empleado agregado correctamente.';
        this.form = {
          documento: '',
          nombre: '',
          email: '',
          telefono: '',
          direccion: '',
          Tipo_Empleado_id: 0,
        };
        this.showForm = false;
        this.loadEmpleados();
      },
      error: () => {
        this.error = 'No se pudo guardar el empleado.';
        this.cdr.detectChanges();
      },
    });
  }
}
