import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email='';
  password='';
  showPassword=false;
  error='';

  constructor(  
    private authService: AuthService,
    private router: Router)
  {}

  login(){
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/overview']);
      },
      error: () => {
        this.error =  'Login failed. Please try again.';
      }
    });

}
}
