import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmemployee',
  imports: [],
  templateUrl: './confirmemployee.component.html',
  styleUrl: './confirmemployee.component.css'
})
export class ConfirmemployeeComponent {
  backtologin(){
    window.location.href="/login"
  }
}
