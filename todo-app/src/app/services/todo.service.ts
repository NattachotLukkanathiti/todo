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
  private api = 'https://todo-igjj.onrender.com/api/todos';
  private apiUrl = 'https://todo-igjj.onrender.com/api'; 

  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
   logAudit(auditData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/audit`, 
      auditData,
      { headers: this.headers }
    );
  }
  getAudit() {
    return this.http.get<any[]>(
      `${this.apiUrl}/audit`,
      { headers: this.headers }
    );
  }
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
    return this.http.put<any>(
      `${this.apiUrl}/reset-password`, 
      { title, password },
      { headers: this.headers }
    );
  }
  getSaleOrders() {
  return this.http.get<any[]>(
    `${this.apiUrl}/sale_order`,
    { headers: this.headers }
  );
} 
  getInventory() {
  return this.http.get<any[]>(
    `${this.apiUrl}/inventory`,
    { headers: this.headers }
  );
}
  getHistory() {
  return this.http.get<any[]>(
    `${this.apiUrl}/history`,
    { headers: this.headers }
  );
}

getEmployee() {
  return this.http.get<any[]>(
    `${this.apiUrl}/employee`,
    { headers: this.headers }
  );
}getTodoss() {
  return this.http.get<any[]>(
    `${this.apiUrl}/todos`,
    { headers: this.headers }
  );
}
getSuppliers(){
  return this.http.get<any[]>(
    `${this.apiUrl}/suppliers`,
    { headers: this.headers}
  )
}

addInventory(productData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/inventory`, 
      productData,
      { headers: this.headers }
    );
  }
  deleteInventory(sku: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/inventory/${sku}`);
  }
  updateInventory(sku: string, productData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/inventory/${sku}`, productData,{ headers: this.headers }
  );
}
// ใน todo.service.ts
updateEmployee(username: string, employeeData: any): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}/employee/${username}`, 
    employeeData,
    { headers: this.headers }
  );
}
// ดึงข้อมูลสรุปสำหรับ Dashboard
  // ตรวจสอบให้แน่ใจว่าใช้ this.apiUrl (ซึ่งชี้ไปที่ onrender.com)
  getSummary(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/summary`, 
      { headers: this.headers }
    );
  }
  
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/inventory`, 
      { headers: this.headers }
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/categories`, 
      { headers: this.headers }
    );
  }
  // เพิ่มฟังก์ชันดึงข้อมูลแจ้งเตือน
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/notification`, 
      { headers: this.headers }
    );
  }
  // แก้ไขให้รับ 4 Arguments แทนการรับ Object ก้อนเดียว
  addNotification(title: string, description: string, type: string, timeAgo: string): Observable<any> {
    const notificationData = {
      title: title,
      description: description,
      type: type,
      time_ago: timeAgo
    };

    return this.http.post<any>(
      `${this.apiUrl}/notification`, 
      notificationData,
      { headers: this.headers }
    );
  }
  // 📌 เพิ่มฟังก์ชันสำหรับอัปเดตข้อมูล Profile
 updateProfile(id: number, profileData: any): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}/todos/${id}`, 
    profileData,
    { headers: this.headers }
  );
}
// ดึงข้อมูล SKU ล่าสุดจากฐานข้อมูล (สมมติว่า Backend มี Endpoint นี้)
  getLastSku(): Observable<{ lastSku: string }> {
    return this.http.get<{ lastSku: string }>(
      `${this.apiUrl}/inventory/last-sku`,
      { headers: this.headers }
    );
  }
   addSupplier(supplierData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/suppliers`, 
      supplierData, 
      { headers: this.headers }
    );
  }
 
}