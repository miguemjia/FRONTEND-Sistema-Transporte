import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UsuarioService } from '../../core/services/usuario.service';
import { RutaResponse, TarjetaResponse } from '../../models/api.models';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page">
      <header class="header-row">
        <div>
        <h1>Panel de Cliente</h1>
        <p>Bienvenido, {{ documento }}</p>
        </div>
      </header>

      <!-- Rutas Disponibles -->
      <div class="section">
        <h2>Rutas Disponibles</h2>
        <p *ngIf="loadingRutas">Cargando rutas...</p>
        <div class="rutas-grid" *ngIf="!loadingRutas && rutas.length > 0">
          <div class="ruta-card" *ngFor="let ruta of rutas">
            <h3>{{ ruta.nombre }}</h3>
            <p>{{ ruta.descripcion }}</p>
          </div>
        </div>
        <p *ngIf="!loadingRutas && rutas.length === 0">No hay rutas disponibles.</p>
      </div>

      <!-- Mis Tarjetas -->
      <div class="section">
        <h2>Mis Tarjetas</h2>
        <p *ngIf="loadingTarjetas">Cargando tarjetas...</p>
        <div class="tarjetas-list" *ngIf="!loadingTarjetas && tarjetas.length > 0">
          <div class="tarjeta-card" *ngFor="let tarjeta of tarjetas">
            <div class="tarjeta-info">
              <strong>Número: {{ tarjeta.numero_tarjeta }}</strong>
              <p>Saldo: {{ tarjeta.saldo }}</p>
            </div>
            <button type="button" class="recargar-btn" (click)="seleccionarTarjeta(tarjeta)">Recargar Saldo</button>
          </div>
        </div>
        <p *ngIf="!loadingTarjetas && tarjetas.length === 0">No tienes tarjetas registradas.</p>
      </div>

      <!-- Formulario de Recarga -->
      <div class="section" *ngIf="tarjetaSeleccionada">
        <h2>Recargar Saldo</h2>
        <form class="form-card" (ngSubmit)="recargarSaldo()">
          <div class="grid">
            <label>
              Tarjeta Seleccionada
              <input [value]="tarjetaSeleccionada.numero_tarjeta" readonly />
            </label>
            <label>
              Monto a Recargar
              <input type="number" name="monto" [(ngModel)]="montoRecarga" min="1" required />
            </label>
          </div>
          <div class="buttons">
            <button type="submit" class="primary" [disabled]="loadingRecarga">
              {{ loadingRecarga ? 'Recargando...' : 'Recargar' }}
            </button>
            <button type="button" class="secondary" (click)="cancelarRecarga()">Cancelar</button>
          </div>
        </form>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="success" class="success">{{ success }}</p>
    </section>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 2rem;
      }

      .header-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: end;
      }

      .section {
        border: 1px solid #dbe4ea;
        border-radius: 12px;
        background: #fff;
        padding: 1.5rem;
      }

      .rutas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }

      .ruta-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        background: #f9fafb;
      }

      .tarjetas-list {
        display: grid;
        gap: 1rem;
      }

      .tarjeta-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        background: #f9fafb;
      }

      .tarjeta-info p {
        margin: 0.25rem 0 0 0;
        color: #059669;
        font-weight: 600;
      }

      .recargar-btn {
        background: #059669;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        cursor: pointer;
      }

      .recargar-btn:hover {
        background: #047857;
      }

      .form-card {
        border: 1px solid #dbe4ea;
        border-radius: 12px;
        background: #fff;
        padding: 1rem;
      }

      .grid {
        display: grid;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .buttons {
        display: flex;
        gap: 0.5rem;
      }

      .primary {
        background: #0f766e;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
      }

      .primary:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
      }

      .error {
        color: #dc2626;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 6px;
        padding: 0.75rem;
      }

      .success {
        color: #059669;
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        border-radius: 6px;
        padding: 0.75rem;
      }
    `,
  ],
})
export class ClienteComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);

  documento = localStorage.getItem('documento') || '';
  rutas: RutaResponse[] = [];
  tarjetas: TarjetaResponse[] = [];
  tarjetaSeleccionada: TarjetaResponse | null = null;
  montoRecarga = 0;

  loadingRutas = false;
  loadingTarjetas = false;
  loadingRecarga = false;
  error = '';
  success = '';

  ngOnInit(): void {
    this.loadRutas();
    this.loadTarjetas();
  }

  private loadRutas(): void {
    this.loadingRutas = true;
    this.usuarioService.getRutasPublic().subscribe({
      next: (rutas: RutaResponse[]) => {
        this.rutas = rutas;
        this.loadingRutas = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las rutas.';
        this.loadingRutas = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadTarjetas(): void {
    this.loadingTarjetas = true;
    this.usuarioService.getTarjetasCliente().subscribe({
      next: (tarjetas: TarjetaResponse[]) => {
        this.tarjetas = tarjetas;
        this.loadingTarjetas = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las tarjetas.';
        this.loadingTarjetas = false;
        this.cdr.detectChanges();
      },
    });
  }

  seleccionarTarjeta(tarjeta: TarjetaResponse): void {
    this.tarjetaSeleccionada = tarjeta;
    this.montoRecarga = 0;
    this.error = '';
    this.success = '';
  }

  recargarSaldo(): void {
    if (!this.tarjetaSeleccionada || this.montoRecarga <= 0) return;

    this.loadingRecarga = true;
    this.error = '';
    this.success = '';

    this.usuarioService.recargarSaldoCliente(this.tarjetaSeleccionada.numero_tarjeta, this.montoRecarga).subscribe({
      next: (response) => {
        this.success = `Saldo recargado exitosamente. Nuevo saldo: $${response.saldo}`;
        this.tarjetaSeleccionada!.saldo = response.saldo;
        this.tarjetaSeleccionada = null;
        this.montoRecarga = 0;
        this.loadingRecarga = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo recargar el saldo.';
        this.loadingRecarga = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancelarRecarga(): void {
    this.tarjetaSeleccionada = null;
    this.montoRecarga = 0;
    this.error = '';
    this.success = '';
  }
}
