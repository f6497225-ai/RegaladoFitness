import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // o la URL pública de tu backend

  constructor(private http: HttpClient) {}

  // LOGIN ADMIN
  loginAdmin(data: { usernameOrEmail: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  // Obtener clientes (protegido)
  obtenerClientes(): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any[]>(`${this.apiUrl}/clientes`, { headers });
  }

  // Registrar cliente (protegido)
  registrarCliente(cliente: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.post<any>(`${this.apiUrl}/clientes`, cliente, { headers: { Authorization: `Bearer ${token}` } });
  }

  registrarClienteFormData(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.post<any>(`${this.apiUrl}/clientes`, formData, { headers: { Authorization: `Bearer ${token}` } });
  }

actualizarEstado(id: number, estado: string): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.patch(`${this.apiUrl}/clientes/${id}/estado`, { estado }, { headers });
}

eliminarCliente(id: number): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.delete(`${this.apiUrl}/clientes/${id}`, { headers });
}

}
