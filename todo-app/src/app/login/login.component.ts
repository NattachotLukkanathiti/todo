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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // เปลี่ยนจาก addTodo เป็น login
  login() {
    if (!this.title.trim() || !this.password.trim()) return;

    this.todoService.login(this.title, this.password).subscribe({
      next: (response) => {
        console.log('Login สำเร็จแล้วว ไม่ต้องถามหาหน้าให้ทดสอบเฉยๆจร้า', response);
        alert("Login สำเร็จแล้วว ไม่ต้องถามหาหน้าให้ทดสอบเฉยๆจร้า");
        
        // TODO: สามารถเก็บ Token ได้ที่นี่ เช่น localStorage.setItem('token', response.token);
        
        // เปลี่ยนหน้าไปที่ /todos (หรือหน้าหลักของคุณ)
        this.router.navigate(['/todos']); 
      },
      error: (error) => {
        console.error('Login Failed', error);
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    });
  }
}