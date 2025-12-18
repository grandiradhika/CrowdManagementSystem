import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  showAlerts = false;

  constructor(private router: Router) {}

 
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
