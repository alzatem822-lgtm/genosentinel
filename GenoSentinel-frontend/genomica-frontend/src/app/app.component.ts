import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GenoSentinel';
  isLoggedIn = false; // Simulación de estado de login

  constructor(private router: Router) {
    // Simulación de verificación de login
    this.isLoggedIn = localStorage.getItem('token') === 'simulated_token';
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}