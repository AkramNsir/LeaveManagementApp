import { Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environment';
import moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private baseUrl = 'http://vs228562.vs.hosteurope.de/BaSYS' 
  private url = environment.url

  constructor(private router: Router, private http: HttpClient) {
    this.loadUsersFromLocalStorage()
  }


  login(email: string, password: string) {
    const body = `username=${email}&password=${password}&grant_type=password`;
    return this.http.post<any>(`${this.url}/Token`, body)
        .pipe(
            tap(res => this.setSession(res)),
            shareReplay()
        );
  }

  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expires_in, 'seconds');

    localStorage.setItem('currentUser', JSON.stringify(authResult));
    localStorage.setItem('id_token', authResult.access_token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("id_token")
    localStorage.removeItem("expires_at")
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration())
  }

  isLoggedOut() {
      return !this.isLoggedIn()
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
  
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      return moment('1970-01-01'); 
    }
  }

  getUsername(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.userName || null;
    }
    return null;
  }


  registerr(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { username, password };

    return this.http.post(`${this.baseUrl}/Users/Register`, body, { headers })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  private loadUsersFromLocalStorage(): void {
    const users = localStorage.getItem('users');
    this.users = users ? JSON.parse(users) : [{name: 'akram', email: 'an@g.com', password: '1234'}];

    if(! localStorage.getItem('users')){
      this.saveUsersToLocalStorage()
    }
  }

  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }






  

  // Simulated user data storage (replace with actual API integration)
  private users: { name: string, email: string, password: string }[] = [];


  register(name: string, email: string, password: string): boolean {
    // Simulate registration process, replace with actual API integration
    if (!this.users.find(u => u.email === email)) {
      this.users.push({ name, email, password });
      this.saveUsersToLocalStorage();
      return true;
    }
    return false;
  }

  update(email: string, newPassword: string): boolean {
    const userToUpdate = this.users.find(u => u.email === email);
    if (userToUpdate) {
      userToUpdate.password = newPassword;
      this.saveUsersToLocalStorage();
      return true;
    }
    return false;
  }

  existingEmail(email: string): boolean {
    const user = this.users.find(u => u.email === email);
    if (user) {
      return true;
    }
    return false;
  }
 
}
