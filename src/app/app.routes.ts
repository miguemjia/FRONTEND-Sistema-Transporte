import { Routes } from '@angular/router';

import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'Login',
    loadComponent: () => import('./features/Login/Login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () => import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'cliente', pathMatch: 'full' },
      {
        path: 'administradores',
        loadComponent: () =>
          import('./features/Administradores/Administradores').then((m) => m.AdministradoresComponent),
      },
      {
        path: 'cliente',
        loadComponent: () =>
          import('./features/cliente/cliente').then((m) => m.ClienteComponent),
      },
      {
        path: 'empleado',
        loadComponent: () =>
          import('./features/Empleado/Empleado').then((m) => m.EmpleadoComponent),
      },
      {
        path: 'ruta',
        loadComponent: () =>
          import('./features/Ruta/Ruta').then((m) => m.RutaComponent),
      },
      {
        path: 'tarjeta',
        loadComponent: () =>
          import('./features/Tarjeta/Tarjeta').then((m) => m.TarjetaComponent),
      },
      {
        path: 'tipo-empleado',
        loadComponent: () =>
          import('./features/Tipo_Empleado/Tipo_Empleado').then((m) => m.TipoEmpleadoComponent),
      },
      {
        path: 'vehiculos',
        loadComponent: () =>
          import('./features/Vehiculos/Vehiculos').then((m) => m.VehiculosComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];