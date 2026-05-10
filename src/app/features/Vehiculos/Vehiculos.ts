import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UsuarioService } from '../../core/services/usuario.service';
import { VehiculoResponse } from '../../models/api.models';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="header-row">
        <div>
        <h1>Vehiculos</h1>
        <p>Listado de vehiculos guardados en la base de datos.</p>
        </div>
        <button type="button" class="secondary" (click)="toggleForm()">
          {{ showForm ? 'Cerrar' : 'Agregar' }}
        </button>
      </header>

      <form class="form-card" *ngIf="showForm" (ngSubmit)="createVehiculo()">
        <div class="grid">
          <label>
            Placa
            <input name="placa" [(ngModel)]="form.placa" required />
          </label>
          <label>
            Marca
            <input name="marca" [(ngModel)]="form.marca" required />
          </label>
          <label>
            Ruta Id
            <input name="ruta_id" [(ngModel)]="form.ruta_id" required />
          </label>
        </div>
        <button type="submit" class="primary">Guardar</button>
      </form>

      <p *ngIf="loading">Cargando vehiculos...</p>
      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="success" class="success">{{ success }}</p>

      <div class="table-wrap" *ngIf="!loading && !error">
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Marca</th>
              <th>Ruta</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let vehiculo of vehiculos">
              <td>{{ vehiculo.placa }}</td>
              <td>{{ vehiculo.marca }}</td>
              <td>{{ vehiculo.ruta_id }}</td>
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
export class VehiculosComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  vehiculos: VehiculoResponse[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  form = {
    placa: '',
    marca: '',
    ruta_id: '',
  };

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  private loadVehiculos(): void {
    this.loading = true;
    this.usuarioService.getVehiculos().subscribe({
      next: (vehiculos) => {
        this.vehiculos = vehiculos;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los vehiculos.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.loadVehiculos();
  }

  createVehiculo(): void {
    this.error = '';
    this.success = '';

    this.usuarioService.createVehiculo({ ...this.form }).subscribe({
      next: () => {
        this.success = 'Vehiculo agregado correctamente.';
        this.form = {
          placa: '',
          marca: '',
          ruta_id: '',
        };
        this.showForm = false;
        this.loadVehiculos();
      },
      error: () => {
        this.error = 'No se pudo guardar el vehiculo.';
        this.cdr.detectChanges();
      },
    });
  }
}
