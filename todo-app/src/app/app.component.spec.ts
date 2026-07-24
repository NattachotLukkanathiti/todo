import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink } from '@angular/router';
interface Todo {
  id: number;
  title: string;
  password: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  RouterOutlet,
  RouterLink
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
toggleTodo(_t3: Todo) {
throw new Error('Method not implemented.');
}

  title = '';
  password = '';
  todos: Todo[] = [
    {
      id: 1,
      title: 'Learn Angular',
      password: 'password1',
      completed: false
    }
  ];

  addTodo() {

    if (!this.title.trim()) return;

    this.todos.push({
      id: Date.now(),
      title: this.title,
      password: this.password,
      completed: false
    });

    this.title = '';

  }

  deleteTodo(id:number){

    this.todos=this.todos.filter(x=>x.id!==id);

  }

}