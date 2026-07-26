import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  addTodo(title: string, password: string, confirmPassword: string,username: string) {
    return this.http.post<Todo>(
      this.api,
      {
        title,
        confirmPassword,
        username,
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
login(username: string, password: string) {
  return this.http.post<any>('/api/login', { username, password });
}
}