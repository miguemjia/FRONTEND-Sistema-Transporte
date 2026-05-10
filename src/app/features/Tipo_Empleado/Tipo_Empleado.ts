import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UsuarioService } from '../../core/services/usuario.service';
import { TipoEmpleadoResponse } from '../../models/api.models';

@Component({
  selector: 'app-tipo-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="header-row">
        <div>
        <h1>Tipos de Empleado</h1>
        <p>Listado de tipos de empleado guardados en la base de datos.</p>
        </div>
        <button type="button" class="secondary" (click)="toggleForm()">
          {{ showForm ? 'Cerrar' : 'Agregar' }}
        </button>
      </header>

      <form class="form-card" *ngIf="showForm" (ngSubmit)="createTipoEmpleado()">
        <div class="grid">
          <label class="full">
            Nombre Tipo
            <input name="nombre_Tipo" [(ngModel)]="form.nombre_Tipo" required />
          </label>
        </div>
        <button type="submit" class="primary">Guardar</button>
      </form>

      <p *ngIf="loading">Cargando tipos de empleado...</p>
      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="success" class="success">{{ success }}</p>

      <div class="table-wrap" *ngIf="!loading && !error">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tipo of tiposEmpleado">
              <td>{{ tipo.id }}</td>
              <td>{{ tipo.nombre_Tipo }}</td>
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
export class TipoEmpleadoComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  tiposEmpleado: TipoEmpleadoResponse[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  form = {
    nombre_Tipo: '',
  };

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  private loadTiposEmpleado(): void {
    this.loading = true;
    this.usuarioService.getTiposEmpleado().subscribe({
      next: (tiposEmpleado: TipoEmpleadoResponse[]) => {
        this.tiposEmpleado = tiposEmpleado;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los tipos de empleado.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.loadTiposEmpleado();
  }

  createTipoEmpleado(): void {
    this.error = '';
    this.success = '';

    this.usuarioService.createTipoEmpleado({ ...this.form }).subscribe({
      next: () => {
        this.success = 'Tipo de empleado agregado correctamente.';
        this.form = { nombre_Tipo: '' };
        this.showForm = false;
        this.loadTiposEmpleado();
      },
      error: () => {
        this.error = 'No se pudo guardar el tipo de empleado.';
        this.cdr.detectChanges();
      },
    });
  }
}
