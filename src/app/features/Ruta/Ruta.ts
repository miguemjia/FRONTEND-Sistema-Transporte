import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UsuarioService } from '../../core/services/usuario.service';
import { RutaResponse } from '../../models/api.models';

@Component({
  selector: 'app-ruta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="header-row">
        <div>
        <h1>Rutas</h1>
        <p>Listado de rutas guardadas en la base de datos.</p>
        </div>
        <button type="button" class="secondary" (click)="toggleForm()">
          {{ showForm ? 'Cerrar' : 'Agregar' }}
        </button>
      </header>

      <form class="form-card" *ngIf="showForm" (ngSubmit)="createRuta()">
        <div class="grid">
          <label>
            Nombre
            <input name="nombre" [(ngModel)]="form.nombre" required />
          </label>
          <label class="full">
            Descripcion
            <input name="descripcion" [(ngModel)]="form.descripcion" required />
          </label>
        </div>
        <button type="submit" class="primary">Guardar</button>
      </form>

      <p *ngIf="loading">Cargando rutas...</p>
      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="success" class="success">{{ success }}</p>

      <div class="table-wrap" *ngIf="!loading && !error">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ruta of rutas">
              <td>{{ ruta.id }}</td>
              <td>{{ ruta.nombre }}</td>
              <td>{{ ruta.descripcion }}</td>
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
export class RutaComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  rutas: RutaResponse[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  form = {
    nombre: '',
    descripcion: '',
  };

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  private loadRutas(): void {
    this.loading = true;
    this.usuarioService.getRutas().subscribe({
      next: (rutas) => {
        this.rutas = rutas;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las rutas.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.loadRutas();
  }

  createRuta(): void {
    this.error = '';
    this.success = '';

    this.usuarioService.createRuta({ ...this.form }).subscribe({
      next: () => {
        this.success = 'Ruta agregada correctamente.';
        this.form = { nombre: '', descripcion: '' };
        this.showForm = false;
        this.loadRutas();
      },
      error: () => {
        this.error = 'No se pudo guardar la ruta.';
        this.cdr.detectChanges();
      },
    });
  }
}
