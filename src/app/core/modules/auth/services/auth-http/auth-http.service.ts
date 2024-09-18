import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpBackend, HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { AuthModel } from '../../models/auth.model';
import {environment} from "../../../../../../environments/environment";
import {Utilisateur} from "../../../../../crm/models/access/utilisateur.model";

const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  private http: HttpClient;
  constructor(private httpBackend: HttpBackend) {
    this.http = new HttpClient(httpBackend);
  }

  // public methods
  login(username: string, password: string): Observable<any> {
    let params = new HttpParams();
    return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
      username,
      password,
    });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  changePassword(username: string | undefined, oldPassword: string, newPassword: string)
  {
    return this.http.patch<boolean>(`${API_USERS_URL}/change-password`, {
      username: username, oldPassword: oldPassword, newPassword: newPassword
    });
  }

  getUserByToken(token: string): Observable<Utilisateur> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Utilisateur>(`${API_USERS_URL}/me`, {
      headers: httpHeaders,
    });
  }
}
