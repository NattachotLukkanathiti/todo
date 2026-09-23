import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';

export interface UserProfile {
  name?: string;
  email?: string;
  avatar?: string;
  roleShort?: string;
  dob?: string;
  nationalId?: string;
  address?: string;
  emergencyContact?: string;
}

/** หน้าโปรไฟล์ (Profile) — `/profile` */
@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  readonly defaultAvatar = 'assets/images/default-avatar.svg'; 

  // --- Navbar Variables ---
  username = '';
  email = '';
  userRole = '';
  profile = '';
  // --- Navbar UI & Time State ---
  isMenuOpen = false; 
  isTimeOpen = false;
  currentTime = new Date();
  private timeSubscription!: Subscription;

ngOnInit(): void {
    const state = history.state;
    
    // --- แก้ไขการรับค่า State ตรงนี้ ---
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || '';
    
    // แก้คำผิดจาก profle เป็น profile และใส่รูปเริ่มต้น
    this.profile = state.profile || this.defaultAvatar; 
  }

  ngOnDestroy(): void {
    this.timeSubscription?.unsubscribe();
  }




  // --- UI Functions ---
  hambar() { this.isMenuOpen = !this.isMenuOpen; }
  openPro() { /* Logic สำหรับเปิดเมนูโปรไฟล์ */ }
  back(){
   this.router.navigate(['/pos'], {
      state: { username: this.username, email: this.email, Move_returns3: true, role: this.userRole, profile: this.profile }
    });

  }
  edit(){
    this.router.navigate(['/edit'])
  }
}