import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../enviroments/environments';
import {
	AdministradorResponse,
	AdministradorCreate,
	ClienteCreate,
	ClienteResponse,
	EmpleadoCreate,
	EmpleadoResponse,
	LoginRequest,
	RutaCreate,
	RutaResponse,
	RutaPublicResponse,
	TarjetaCreate,
	TarjetaResponse,
	TipoEmpleadoCreate,
	TipoEmpleadoResponse,
	TokenResponse,
	VehiculoCreate,
	VehiculoResponse,
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
	constructor(private readonly http: HttpClient) {}

	login(data: LoginRequest): Observable<TokenResponse> {
		return this.loginAdmin(data).pipe(
			catchError((error) => {
				if (error?.status !== 401 && error?.status !== 403) {
					return throwError(() => error);
				}

				return this.loginCliente(data);
			}),
		);
	}

	loginAdmin(data: LoginRequest): Observable<TokenResponse> {
		return this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login/admin`, data);
	}

	loginCliente(data: LoginRequest): Observable<TokenResponse> {
		return this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login/cliente`, data);
	}

	getAdministradores(): Observable<AdministradorResponse[]> {
		return this.http.get<AdministradorResponse[]>(`${environment.apiUrl}/administradores/`, {
			headers: this.authHeaders(),
		});
	}

	createAdministrador(data: AdministradorCreate): Observable<AdministradorResponse> {
		return this.http.post<AdministradorResponse>(`${environment.apiUrl}/administradores/`, data, {
			headers: this.authHeaders(),
		});
	}

	getClientes(): Observable<ClienteResponse[]> {
		return this.http.get<ClienteResponse[]>(`${environment.apiUrl}/clientes/`, {
			headers: this.authHeaders(),
		});
	}

	createCliente(data: ClienteCreate): Observable<ClienteResponse> {
		return this.http.post<ClienteResponse>(`${environment.apiUrl}/clientes/`, data, {
			headers: this.authHeaders(),
		});
	}

	getEmpleados(): Observable<EmpleadoResponse[]> {
		return this.http.get<EmpleadoResponse[]>(`${environment.apiUrl}/empleados/`, {
			headers: this.authHeaders(),
		});
	}

	createEmpleado(data: EmpleadoCreate): Observable<EmpleadoResponse> {
		return this.http.post<EmpleadoResponse>(`${environment.apiUrl}/empleados/`, data, {
			headers: this.authHeaders(),
		});
	}

	getRutas(): Observable<RutaResponse[]> {
		return this.http.get<RutaResponse[]>(`${environment.apiUrl}/rutas/`, {
			headers: this.authHeaders(),
		});
	}

	getRutasPublic(): Observable<RutaPublicResponse[]> {
		return this.http.get<RutaPublicResponse[]>(`${environment.apiUrl}/rutas/public`);
	}

	createRuta(data: RutaCreate): Observable<RutaResponse> {
		return this.http.post<RutaResponse>(`${environment.apiUrl}/rutas/`, data, {
			headers: this.authHeaders(),
		});
	}

	getTarjetas(): Observable<TarjetaResponse[]> {
		return this.http.get<TarjetaResponse[]>(`${environment.apiUrl}/tarjetas/`, {
			headers: this.authHeaders(),
		});
	}

	getTarjetasCliente(): Observable<TarjetaResponse[]> {
		return this.http.get<TarjetaResponse[]>(`${environment.apiUrl}/tarjetas/cliente`, {
			headers: this.authHeaders(),
		});
	}

	createTarjetaCliente(): Observable<TarjetaResponse> {
		return this.http.post<TarjetaResponse>(`${environment.apiUrl}/tarjetas/cliente`, {}, {
			headers: this.authHeaders(),
		});
	}

	createTarjeta(data: TarjetaCreate): Observable<TarjetaResponse> {
		return this.http.post<TarjetaResponse>(`${environment.apiUrl}/tarjetas/`, data, {
			headers: this.authHeaders(),
		});
	}

	recargarSaldoCliente(numeroTarjeta: string, monto: number): Observable<{saldo: number}> {
		return this.http.put<{saldo: number}>(`${environment.apiUrl}/tarjetas/cliente/${numeroTarjeta}/recargar`, { monto }, {
			headers: this.authHeaders(),
		});
	}

	getTiposEmpleado(): Observable<TipoEmpleadoResponse[]> {
		return this.http.get<TipoEmpleadoResponse[]>(`${environment.apiUrl}/tipos-empleados/`, {
			headers: this.authHeaders(),
		});
	}

	createTipoEmpleado(data: TipoEmpleadoCreate): Observable<TipoEmpleadoResponse> {
		return this.http.post<TipoEmpleadoResponse>(`${environment.apiUrl}/tipos-empleados/`, data, {
			headers: this.authHeaders(),
		});
	}

	getVehiculos(): Observable<VehiculoResponse[]> {
		return this.http.get<VehiculoResponse[]>(`${environment.apiUrl}/vehiculos/`, {
			headers: this.authHeaders(),
		});
	}

	createVehiculo(data: VehiculoCreate): Observable<VehiculoResponse> {
		return this.http.post<VehiculoResponse>(`${environment.apiUrl}/vehiculos/`, data, {
			headers: this.authHeaders(),
		});
	}

	private authHeaders(): HttpHeaders {
		const token = localStorage.getItem('access_token');

		return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
	}
}
