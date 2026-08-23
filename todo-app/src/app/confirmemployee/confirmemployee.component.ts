import { Component } from '@angular/core';
import { Router } from '@angular/router'; // 1. นำเข้า Router

@Component({
  selector: 'app-confirmemployee',
  imports: [],
  templateUrl: './confirmemployee.component.html',
  styleUrl: './confirmemployee.component.css'
})
export class ConfirmemployeeComponent {

  constructor(private router: Router) {} // 2. Inject Router

  backtologin() {
    this.router.navigate(['/login']); // 3. แก้ไขการเรียกใช้ navigate
  }
}