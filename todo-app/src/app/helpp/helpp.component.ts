import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { IconComponent } from '../shared/icon';

interface FaqItem {
  title: string;
  subtitle: string;
}

type HeaderPanel = 'account' | null;

/** หน้าช่วยเหลือ (Help & Support) — `/help` */
@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent, CommonModule, DatePipe],
  templateUrl: './helpp.component.html',
  styleUrl: './helpp.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  // --- Navbar Variables ---
  username = '';
  email = '';
  userRole = '';
  profile = '';
  
  // --- Navbar UI & Time State ---
  isTimeOpen = false;
  isNavOpen = false;
  isClosing = false;
  openPanel: HeaderPanel = null;
  currentTime = new Date();
  private timeSubscription!: Subscription;

  // --- Help Page Signals ---
  readonly faqItems = signal<FaqItem[]>([]);
  readonly helpSearch = signal('');
  readonly helpIssueType = signal('Select');

  ngOnInit(): void {
    const state = history.state;
    
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || '';
    this.profile = state.profile || '';
  }

  ngOnDestroy(): void {
    this.timeSubscription?.unsubscribe();
  }

  openPro() { 
    this.isClosing = false;
    this.openPanel = 'account'; 
  }

  toggleAccountMenu(): void { 
    this.openPanel = this.openPanel === 'account' ? null : 'account'; 
    this.isNavOpen = false; 
  }

  closePanel() {
    this.isClosing = true;
    setTimeout(() => {
      this.openPanel = null;
      this.isClosing = false;
      this.changeDetector.markForCheck();
    }, 300);
  }

  openProfile() {
    this.router.navigate(['/profile'], {
      state: { username: this.username, email: this.email, role: this.userRole, profile: this.profile }
    });
  }

  openHelp() {
    // ปิด Sidebar หากอยู่ที่หน้า Help อยู่แล้ว หรือจะสั่ง reload ก็ได้
    this.closePanel();
  }

  back() {
    this.router.navigate(['/pos'], {
      state: { 
        username: this.username, 
        email: this.email, 
        Move_returns3: true, 
        role: this.userRole, 
        profile: this.profile 
      }
    });
  }
}