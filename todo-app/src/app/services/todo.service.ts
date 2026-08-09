import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  password: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private api = 'https://todo-arz1.onrender.com/todos';
  private apiUrl = 'https://todo-arz1.onrender.com/api'; 

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  getTodos() {
    return this.http.get<Todo[]>(this.api, { 
      headers: this.headers 
    });
  }

  addTodo(username: string, title: string, password: string, confirmPassword: string) {
    return this.http.post<Todo>(
      this.api,
      { username, title, confirmPassword, password, completed: false },
      { headers: this.headers }
    );
  }

  updateTodo(todo: Todo) {
    return this.http.put<Todo>(
      `${this.api}/${todo.id}`,
      { completed: todo.completed },
      { headers: this.headers }
    );
  }

  deleteTodo(id: number) {
    return this.http.delete(
      `${this.api}/${id}`,
      { headers: this.headers }
    );
  }

  login(title: string, password: string) {
    return this.http.post<any>(
      `${this.apiUrl}/login`, 
      { title, password },
      { headers: this.headers }
    );
  }

  verifyOtp(title: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, { title, otp }, { headers: this.headers });
  }

  sendOtp(title: string) {
    return this.http.post(`${this.apiUrl}/request-otp`, { title }, { headers: this.headers });
  }

  getMonth() {
    return this.http.get<any[]>(
      `${this.apiUrl}/months`,
      { headers: this.headers }
    );
  }

  // 📌 เพิ่มฟังก์ชัน resetPassword ตรงนี้
  resetPassword(title: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/reset-password`, 
      { title, password },
      { headers: this.headers }
    );
  }
}