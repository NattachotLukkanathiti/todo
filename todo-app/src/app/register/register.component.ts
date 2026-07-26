import { Component, OnInit } from '@angular/core'; // Added OnInit
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoService } from '../services/todo.service';

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
export class RegisterComponent implements OnInit { // Added implements OnInit

  title = '';
  username = '';
  password = '';
  confirmPassword = '';
  rememberMe = false;
  showPassword = false;
  showConfirmPassword = false;
  todos: any[] = [];

  constructor(private todoService: TodoService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(data => {
      this.todos = data;
    });
  }      

  addTodo() {
    if (!this.title.trim() || !this.username.trim()) return;

    // Added password match validation
    if (this.password !== this.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    this.todoService.addTodo(this.username, this.title, this.password, this.confirmPassword).subscribe(() => {
      alert("ลงทะเบียนสำเร็จแล้วค้าบ")
      this.username = '';
      this.title = '';
      this.password = '';
      this.confirmPassword = '';
      this.loadTodos();
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
