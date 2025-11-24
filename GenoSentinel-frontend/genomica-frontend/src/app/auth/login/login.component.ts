import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Simulación de llamada a servicio de autenticación
      const { email, password } = this.loginForm.value;

      if (email === 'test@example.com' && password === 'password') {
        // Simulación de login exitoso
        localStorage.setItem('token', 'simulated_token');
        this.snackBar.open('Login exitoso. Redirigiendo...', 'Cerrar', { duration: 3000 });
        // Recargar la página para actualizar el estado de login en el AppComponent
        window.location.href = '/home';
      } else {
        this.snackBar.open('Credenciales inválidas. Intente de nuevo.', 'Cerrar', { duration: 3000 });
      }
    } else {
      this.snackBar.open('Por favor, complete el formulario correctamente.', 'Cerrar', { duration: 3000 });
    }
  }
}