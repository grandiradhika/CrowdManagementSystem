import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  login(email: string, password: string) {
    return this.http.post<any>(
       'https://hiring-dev.internal.kloudspot.com/api/auth/login',
       { 
        email : email,
        password : password}
    ).pipe(
      tap(res => {
        localStorage.setItem('authToken', res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('authToken');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

}
