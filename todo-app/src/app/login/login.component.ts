import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // เพิ่ม Router

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private todoService = inject(TodoService);
  private router = inject(Router); // ใช้สำหรับเปลี่ยนหน้า

  title = ''; // เปลี่ยนจาก title เป็น username
  password = '';
  rememberMe = false;
  showPassword = false;
  showpopup = false;
  showpopupnoti = false;
  popup = '';
  registersuccess = false;


  openpopup(message:string){
    this.popup = message;
    this.showpopup = true;
  }
  closepopup(){
    this.showpopup = false;
    this.showpopupnoti = false;
    
    if(this.registersuccess === true){
      this.router.navigate(['/login']); 
            this.registersuccess = false;
    }
  }
  openpopupnoti(message:string){
    this.showpopupnoti = true;
    this.popup = message;
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // เปลี่ยนจาก addTodo เป็น login
  login() {
    if (!this.title.trim() || !this.password.trim()) return;

    this.todoService.login(this.title, this.password).subscribe({
      next: (response) => {

        this.router.navigate(['/dashboard']);
        
        // TODO: สามารถเก็บ Token ได้ที่นี่ เช่น localStorage.setItem('token', response.token);
        
        // เปลี่ยนหน้าไปที่ /todos (หรือหน้าหลักของคุณ)
      },
      error: (error) => {
        console.error('Login Failed', error);
        this.openpopupnoti("Username or password incorrect");
      }
    });
  }
}