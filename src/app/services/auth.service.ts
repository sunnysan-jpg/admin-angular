import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAdminLoggedIn = new BehaviorSubject<boolean>(false);
  isAdmins$ = this.isAdminLoggedIn.asObservable();
  constructor(private http: HttpClient) {
    this.loadCurrentUser()
   }
  
  register(userData: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`,userData).pipe(
      tap((response:any)=>{
        if(response.token){
            localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    )
  }

  login(credentials:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,credentials).pipe(
      tap((response:any)=>{
        if(response.token){
            localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    )
  }



    adminlogin(credentials:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,credentials).pipe(
      tap((response:any)=>{
        if(response.token){
            localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    )
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role == 'admin';
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      this.http.get(`${this.apiUrl}/profile`).subscribe(
        (response: any) => {
          this.currentUserSubject.next(response.user);
        },
        () => {
          this.logout();
        }
      );
    }
  }


    setAdminLogin(value: boolean) {
    this.isAdminLoggedIn.next(value);
  }

  // Optional helper
  isAdmins(): boolean {
    const token = this.getToken();
    return !!token; // put proper logic here if needed
  }
}
