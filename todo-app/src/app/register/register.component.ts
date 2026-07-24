import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  title = '';
  username = '';
  password = '';
  confirmPassword = '';
  rememberMe = false;

  addTodo() {
    this.title = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
  }
}