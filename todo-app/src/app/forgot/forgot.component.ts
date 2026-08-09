import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'https://todo-arz1.onrender.com';

  title: string = '';
  isLoading: boolean = false;

  showpopup = false;
  showpopupnoti = false;
  popup = '';
  isSuccess = false;

  openpopup(message: string) {
    this.popup = message;
    this.showpopup = true;
  }

  closepopup() {
    this.showpopup = false;
    this.showpopupnoti = false;

    if (this.isSuccess) {

      // บอก OTP ว่ามาจาก Forgot Password
      this.router.navigate(['/otp'], {
        state: {
          from: 'forget',
          userData: {
            title: this.title
          }
        }
      });

      this.isSuccess = false;
    }
  }

  openpopupnoti(message: string) {
    this.showpopupnoti = true;
    this.popup = message;
  }

  onSubmit() {
  if (!this.title) {
    this.openpopupnoti('กรุณากรอกอีเมล');
    return;
  }

  this.isLoading = true;

  // 1. เรียก API เพื่อตรวจสอบอีเมลก่อน
  this.http.post<any>(`${this.apiUrl}/api/check-email`, { email: this.title }).subscribe({
    next: (checkRes) => {
      if (checkRes.exists) {
        // 2. ถ้ามีอีเมลในระบบ ค่อยส่ง Request OTP
        this.sendOtp();
      } else {
        this.isLoading = false;
        this.openpopupnoti('ไม่พบอีเมลนี้ในระบบ');
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.openpopupnoti('เกิดข้อผิดพลาดในการตรวจสอบอีเมล');
    }
  });
}

// แยกฟังก์ชันส่ง OTP ออกมาเพื่อให้โค้ดอ่านง่ายขึ้น
sendOtp() {
  this.http.post<any>(
    `${this.apiUrl}/api/request-otp`,
    { title: this.title }
  ).subscribe({
    next: (res) => {
      this.isLoading = false;
      sessionStorage.setItem('tempUserData', JSON.stringify({ title: this.title }));
      sessionStorage.setItem('otpFrom', 'forget');
      
      this.router.navigate(['/otp'], {
        state: { from: 'forget', userData: { title: this.title } }
      });
    },
    error: (err) => {
      this.isLoading = false;
      const errorMsg = err.error?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      this.openpopupnoti(errorMsg);
    }
  });
}
}