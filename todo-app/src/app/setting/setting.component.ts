import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common'; // 1. Import Location

interface StoreSettings {
  email: string;
  phone: string;
  address: string;
  language: string;
  timeZone: string;
  currency: string;
  dateFormat: string;
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent implements OnInit { // 2. เพิ่ม implements OnInit
  private readonly router = inject(Router);
  private readonly location = inject(Location); // 3. Inject Location

  readonly languageOptions = ['English', 'ไทย'];
  readonly timeZoneOptions = ['Asia/Bangkok (UTC+7)', 'UTC'];
  readonly currencyOptions = ['THB', 'USD', 'EUR'];
  readonly dateFormatOptions = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
  
  userRole = '';
  username = '';
  email = '';
  profile = '';

  form: StoreSettings = {
    email: '',
    phone: '',
    address: '',
    language: this.languageOptions[0],
    timeZone: this.timeZoneOptions[0],
    currency: this.currencyOptions[0],
    dateFormat: this.dateFormatOptions[0]
  };

  ngOnInit(): void {
    const state = history.state;
    this.userRole = state.role || '';
    this.username = state.username || '';
    this.email = state.email || '';
    this.profile = state.profile || '';
  }

  // 4. อัปเดตให้ส่งข้อมูลผู้ใช้ไปด้วย
  navigateTo(route: string, extraState: any = {}) {
    this.router.navigate([route], {
      state: { 
        username: this.username,
        email: this.email,
        role: this.userRole,
        profile: this.profile,
        ...extraState
      }
    });
  }

  back() { this.location.back(); }

  Animationa2_out(){ setTimeout(() =>{ this.navigateTo('/inventory', { Move_return: true }); } ,300); }
  Animation_out2(){ setTimeout(() =>{ this.navigateTo('/sale', { Move_return2: true }); } ,300); }
  Animation_out3(){ setTimeout(() =>{ this.navigateTo('/history', { Move_return4: true }); } ,300); }
  Animation_out5(){ setTimeout(() =>{ this.navigateTo('/suppliers', { Move_return5: true, Open_bar: true }); } ,300); }
  Animation_out6(){ setTimeout(() =>{ this.navigateTo('/audit', { Move_return6: true }); } ,300); }
  Animationa_out1(){ setTimeout(() =>{ this.navigateTo('/pos', { Move_return6: true }); } ,300); }
  Animation_out4(){ setTimeout(() =>{ this.navigateTo('/employee', { Move_return6: true }); } ,300); }
  Animationa_out(){ setTimeout(() =>{ this.navigateTo('/dashboard', { Move_return: true }); } ,300); }

  save(): void {
    this.router.navigate(['/pos']);
  }
}