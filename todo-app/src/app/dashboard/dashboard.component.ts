import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    search: string = '';
    items: string[] = ['รายการที่ 1', 'รายการที่ 2', 'รายการที่ 3'];
    filteredItems: string[] = [...this.items]; // เปลี่ยนชื่อจาก filter เป็น filteredItems เพื่อไม่ให้ซ้ำกับชื่อฟังก์ชัน
  // Add this to your DashboardComponent class
    data = [
      { value: 60 },
      { value: 100 },
      { value: 50  },
      { value: 150 },
      { value: 100 },
      { value: 30 },
      { value: 40 },
      { value: 50 },
      { value: 200 },
      { value: 120 },
      { value: 150 },
      { value: 100 }
    ];

    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    isMenuOpen = false;
    isMenuOpenprofile = false;
    currentView = 'dashboard';
    constructor(private router: Router) {}

    // ฟังก์ชันเปิด-ปิด เมนู
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      this.isMenuOpenprofile = !this.isMenuOpenprofile; // ปิดเมนู profile เมื่อเปิดเมนูหลัก
    }

    // ฟังก์ชันเปลี่ยนหน้า
    setView(view: string) {
      this.currentView = view;
    }

    // ฟังก์ชันค้นหา (อัปเดตให้เรียกใช้ใน HTML)
    filterS() {
      this.filteredItems = this.items.filter(item => 
        item.toLowerCase().includes(this.search.toLowerCase())
      );
    }
    logout() {
    this.router.navigate(['/login']);
}
}