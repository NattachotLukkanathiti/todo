import { Component, OnInit } from '@angular/core'; // Added OnInit
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoService } from '../services/todo.service';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatCheckboxModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit { // Added implements OnInit

  title = '';
  username = '';
  password = '';
  confirmPassword = '';
  rememberMe = false;
  showPassword = false;
  showConfirmPassword = false;
  todos: any[] = [];
  loading = false;
  showpopup = false;
  showpopupnoti = false;
  popup = '';
  registersuccess = false;
  otp = '';
  otpoutput: boolean = false;
  
  ngOnDestroy(): void {
    if (this.update) {
      this.update.unsubscribe();
    }
  }
   verifyOtp() {
    this.todoService.verifyOtp(this.title, this.otp).subscribe({
      next: () => {
        // เมื่อ OTP ถูกต้อง ให้ทำการบันทึกข้อมูลลงระบบ
        this.todoService.addTodo(this.username, this.title, this.password, this.confirmPassword).subscribe(() => {
          this.openpopup("Success");
          this.username = '';
          this.title = '';
          this.password = '';
          this.confirmPassword = '';
          this.otp = '';
          this.otpoutput = false; // กลับไปหน้าแรก
          this.loadTodos();
          this.loading = false;
          this.registersuccess = true;
        });
      },
      error: () => {
        this.openpopupnoti("รหัส OTP ไม่ถูกต้องหรือหมดอายุ");
      }
    });
  }

  openpopup(message:string){
    this.popup = message;
    this.showpopup = true;
  }
  closepopup(){
    this.showpopup = false;
    this.showpopupnoti = false;
    
    if(this.registersuccess === true){
      window.location.href="#";
            this.registersuccess = false;
    }
  }
  openpopupnoti(message:string){
    this.showpopupnoti = true;
    this.popup = message;
  }
  private update!: Subscription;
  constructor(
    private todoService: TodoService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit(): void {
    this.loadTodos();
    this.update = interval(2000).subscribe(() => {
      this.loadTodos();
    })
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(data => {
      this.todos = data;
    });
  }      

  addTodo() {
  // 1. ตรวจสอบว่ากรอกข้อมูลครบหรือไม่ ก่อนที่จะ return ออกไป
  if (!this.title.trim() || !this.username.trim()) {
    this.openpopupnoti("กรุณากรอกอีเมลและชื่อผู้ใช้ให้ครบถ้วน");
    return;
  }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.title)) {
      this.openpopupnoti("Please enter a valid email address");
      return;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordPattern.test(this.password)) {
      this.openpopupnoti("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ เช่น @$!%*?&#");
      return;
    }
    const checkEmail = this.todos.some(todo => todo.title === this.title);
    if (checkEmail) {
      this.openpopupnoti("This is account a already in use")
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.openpopupnoti("Passwords do not match");
      return;
    }
    // Added password match validation
    if (this.password !== this.confirmPassword) {
      this.openpopupnoti("Password do not match");
      return;
    }
    this.loading = true;

    this.todoService.sendOtp(this.title).subscribe({
    next: () => {
      const userData = {
          username: this.username,
          title: this.title,
          password: this.password
        };
        sessionStorage.setItem('tempUserData', JSON.stringify(userData));
      this.router.navigate(['/otp'], { state: { userData } });
      this.otpoutput = true; // 2. สั่งเปิดหน้า OTP
      this.loading = false;
    },
    error: () => {
      this.openpopupnoti("ไม่สามารถส่ง OTP ได้ กรุณาลองใหม่อีกครั้ง");
      this.loading = false;
    }
  });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos();
    });
  }

  toggleTodo(todo: any) {
    this.todoService.updateTodo(todo).subscribe(() => {
      this.loadTodos();
    });
  }
  
}

