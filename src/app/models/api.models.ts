// Auth Models
export interface LoginRequest {
  documento: string;
  contrasena: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  role: string;
}

// Administradores Models
export interface AdministradorCreate {
  documento: string;
  contrasena: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  descripcion?: string;
}

export interface AdministradorResponse {
  documento: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  descripcion?: string;
}

// Cliente Models
export interface ClienteCreate {
  documento: string;
  contrasena: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface ClienteResponse {
  documento: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

// Empleado Models
export interface EmpleadoCreate {
  documento: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  Tipo_Empleado_id: number;
}

export interface EmpleadoResponse {
  documento: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  Tipo_Empleado_id: number;
}

// Rutas Models
export interface RutaCreate {
  nombre: string;
  descripcion: string;
}

export interface RutaResponse {
  id: string;
  nombre: string;
  descripcion: string;
}

// Tarjeta Models
export interface TarjetaCreate {
  documento_cliente: string;
}

export interface TarjetaResponse {
  numero_tarjeta: string;
  documento_cliente: string;
  saldo: number;
}

// Tipo_Empleado Models
export interface TipoEmpleadoCreate {
  nombre_Tipo: string;
}

export interface TipoEmpleadoResponse {
  id: number;
  nombre_Tipo: string;
}

// Vehiculos Models
export interface VehiculoCreate {
  placa: string;
  marca: string;
  ruta_id: string;
}

export interface VehiculoResponse {
  placa: string;
  marca: string;
  ruta_id: string;
}