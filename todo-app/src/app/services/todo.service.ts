import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { title } from 'process';
import { Observable } from 'rxjs'; // 1. เพิ่มก

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

  // 1. กำหนด Header พิเศษเพื่อข้ามหน้าเตือนของ Ngrok
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
      {
        username,
        title,
        confirmPassword,
        password,
        completed: false
      },
      { headers: this.headers } // ส่ง headers แนบไปด้วย
    );
  }

  updateTodo(todo: Todo) {
    return this.http.put<Todo>(
      `${this.api}/${todo.id}`,
      {
        completed: todo.completed
      },
      { headers: this.headers } // ส่ง headers แนบไปด้วย
    );
  }

  deleteTodo(id: number) {
    return this.http.delete(
      `${this.api}/${id}`,
      { headers: this.headers } // ส่ง headers แนบไปด้วย
    );
  }

// ใน todo.service.ts
  login(title: string, password: string) {
    return this.http.post<any>(
      'https://todo-arz1.onrender.com/api/login', // 1. เปลี่ยน URL ให้ชี้ไปที่ Render
      { title, password },
      { headers: this.headers } // 2. แนบ headers เพื่อป้องกันปัญหาการเชื่อมต่อ
    );
  }
  // ในไฟล์ todo.service.ts
// ตัวอย่างการแก้ไข apiUrl ใน verifyOtp
verifyOtp(email: string, otp: string): Observable<any> {
  return this.http.post<any>(`${this.api}/verify-otp`, { email, otp }, { headers: this.headers });
}
// เพิ่มใน todo.service.ts
sendOtp(email: string) {
  return this.http.post(`${this.api}/send-otp`, { email }, { headers: this.headers });
}
}