import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UsuarioService } from '../../core/services/usuario.service';
import { TarjetaResponse } from '../../models/api.models';

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="header-row">
        <div>
        <h1>Tarjetas</h1>
        <p>Listado de tarjetas guardadas en la base de datos.</p>
        </div>
        <button type="button" class="secondary" (click)="toggleForm()">
          {{ showForm ? 'Cerrar' : 'Agregar' }}
        </button>
      </header>

      <form class="form-card" *ngIf="showForm" (ngSubmit)="createTarjeta()">
        <div class="grid">
          <label class="full">
            Documento Cliente
            <input name="documento_cliente" [(ngModel)]="form.documento_cliente" required />
          </label>
        </div>
        <button type="submit" class="primary">Guardar</button>
      </form>

      <p *ngIf="loading">Cargando tarjetas...</p>
      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="success" class="success">{{ success }}</p>

      <div class="table-wrap" *ngIf="!loading && !error">
        <table>
          <thead>
            <tr>
              <th>Numero</th>
              <th>Documento Cliente</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tarjeta of tarjetas">
              <td>{{ tarjeta.numero_tarjeta }}</td>
              <td>{{ tarjeta.documento_cliente }}</td>
              <td>{{ tarjeta.saldo }}</td>
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
export class TarjetaComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  tarjetas: TarjetaResponse[] = [];
  loading = true;
  error = '';
  success = '';
  showForm = false;
  form = {
    documento_cliente: '',
  };

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  private loadTarjetas(): void {
    this.loading = true;
    this.usuarioService.getTarjetas().subscribe({
      next: (tarjetas) => {
        this.tarjetas = tarjetas;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las tarjetas.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.loadTarjetas();
  }

  createTarjeta(): void {
    this.error = '';
    this.success = '';

    this.usuarioService.createTarjeta({ ...this.form }).subscribe({
      next: () => {
        this.success = 'Tarjeta agregada correctamente.';
        this.form = { documento_cliente: '' };
        this.showForm = false;
        this.loadTarjetas();
      },
      error: () => {
        this.error = 'No se pudo guardar la tarjeta.';
        this.cdr.detectChanges();
      },
    });
  }
}
