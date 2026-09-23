import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { TodoService } from '../services/todo.service';

interface NotificationItem {
  id: string;
  title: string;
  description: string; // เปลี่ยนจาก subtitle
  type: string;
  time_ago: string;    // เปลี่ยนจาก time
  is_read: boolean;    // เปลี่ยนจาก unread
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  private todoService = inject(TodoService);
  private router = inject(Router);

  // --- Session & UI State ---
  username = ''; email = ''; userRole = ''; profile = '';
  isMenuOpen = false; isMenuOpenprofile = true; isTimeOpen = false;
  showpopupnoti = false; popup = '';
  currentTime = new Date();
  private timeSubscription!: Subscription;

  // --- Loading State (เพิ่มกลับมาแล้ว) ---
  isLoading = false;
  loader = false;

  // --- Animation State ---
  Animation_out = false; Animation_outsale = false; play_Return = false; 
  out = false; outs = false; stan = false; inhere = false;

  // --- Dynamic Data (Signals) ---
  readonly pendingApprovals = signal<number>(0);
  readonly inventoryAlerts = signal<number>(0);
  readonly stockUpdates = signal<number>(0);
  readonly notifications = signal<NotificationItem[]>([]);

  ngOnInit(): void {
    const state = history.state;
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || 'user';
    this.profile = state.profile || '';

    if (!this.username || !this.email) {
      this.openpopupnoti("Session not found. Redirecting to login");
      return;
    }

    if (state.Move_return === true) { this.stan = false; this.play_Return = true; this.inhere = true; }
    else if (state.stan === true) { this.stan = true; this.inhere = true; this.play_Return = false; }
    if (state.Dont_animation === true) { this.inhere = false; this.outs = true; }

    this.loadNotifications();

    this.timeSubscription = interval(1000).subscribe(() => { this.currentTime = new Date(); });
  }

  ngOnDestroy() { this.timeSubscription?.unsubscribe(); }

  // --- โหลดข้อมูลจาก Supabase ---
 loadNotifications() {
  this.isLoading = true;
  this.loader = true;
  this.todoService.getNotifications().subscribe({
    next: (res: any) => {
      // สมมติว่า Supabase ส่งข้อมูลมาใน res หรือ res.data
      this.notifications.set(res || []); 
      this.isLoading = false;
      this.loader = false;
    },
    error: (err) => {
      console.error('Error fetching notifications:', err);
      this.isLoading = false;
      this.loader = false;
    }
  })}

  // --- Navigation & Animation ---
  navigateTo(path: string, extraState: any = {}) {
    this.out = true; this.play_Return = false; this.Animation_outsale = true;
    setTimeout(() => {
      this.router.navigate([path], { state: { username: this.username, email: this.email, role: this.userRole, profile: this.profile, ...extraState } });
    }, 300);
  }
  Animationa_out1(){
    this.navigateTo('/pos');
  }
  Animationa_out() { this.navigateTo('/inventory'); }
  Animation_out2() { this.navigateTo('/sale', { Move_return3: true }); }
  Animation_out3() { this.navigateTo('/history', { Move_returnH: true }); }
  Animation_out4() { this.navigateTo('/employee', { Move_return4: true }); }
  Animation_out5() { this.navigateTo('/suppliers', { Move_return5: true, Dont_animation: true }); }
  Animation_out6() { this.navigateTo('/audit', { Move_return6: true, Dont_animation: true }); }

  // --- UI Functions ---
  hambar() { this.isMenuOpen = !this.isMenuOpen; }
  toggleMenu() { this.outs = false; this.isMenuOpen = !this.isMenuOpen; this.isMenuOpenprofile = !this.isMenuOpenprofile; }
  openpopupnoti(message: string) { this.showpopupnoti = true; this.popup = message; }
  closepopup() { this.showpopupnoti = false; this.router.navigate(['/login']); }
  
  logout() {
    const now = new Date();
    const auditData = { date: now.toISOString().split('T')[0], time: now.toTimeString().split(' ')[0], username: this.username, email: this.email, activity: 'Logout', role: this.userRole, picture: this.profile };
    this.todoService.logAudit(auditData).subscribe({ next: () => this.router.navigate(['/login']), error: () => this.router.navigate(['/login']) });
  }
   openPro(){
    this.isMenuOpenprofile = !this.isMenuOpenprofile;
  }
  
}