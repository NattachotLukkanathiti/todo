import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Subscription } from 'rxjs';

export interface UserEdit{
  name?: string;
  email?: string;
  avatar?: string;
  roleShort?: string;
  dob?: string;
  nationalId?: string;
  address?: string;
  emergencyContact?: string;
}

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe, FormsModule], 
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private location = inject(Location);
  readonly defaultAvatar = 'assets/images/default-avatar.svg'; 

  // --- Navbar & User Variables ---
  username = '';
  email = '';
  userRole = '';
  profile = '';
  
  // --- Form Variables ---
  dob = '';
  nationalId = '';
  address = '';
  emergencyContact = '';

  // --- Navbar UI & Time State ---
  isMenuOpen = false; 
  isTimeOpen = false;
  currentTime = new Date();
  private timeSubscription!: Subscription;

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

  ngOnInit(): void {
    const state = history.state;
    
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || '';
    this.profile = state.profile || this.defaultAvatar; 

    this.dob = state.dob || '';
    this.nationalId = state.nationalId || '';
    this.address = state.address || '';
    this.emergencyContact = state.emergencyContact || '';
  }

  ngOnDestroy(): void {
    this.timeSubscription?.unsubscribe();
  }

  // --- Navigation Functions ---
  Animationa2_out(){ setTimeout(() =>{ this.navigateTo('/inventory', { Move_return: true }); } ,300); }
  Animation_out2(){ setTimeout(() =>{ this.navigateTo('/sale', { Move_return2: true }); } ,300); }
  Animation_out3(){ setTimeout(() =>{ this.navigateTo('/history', { Move_return4: true }); } ,300); }
  Animation_out5(){ setTimeout(() =>{ this.navigateTo('/suppliers', { Move_return5: true, Open_bar: true }); } ,300); }
  Animation_out6(){ setTimeout(() =>{ this.navigateTo('/audit', { Move_return6: true }); } ,300); }
  Animationa_out1(){ setTimeout(() =>{ this.navigateTo('/pos', { Move_return6: true }); } ,300); }
  Animation_out4(){ setTimeout(() =>{ this.navigateTo('/employee', { Move_return6: true }); } ,300); }
  Animationa_out(){ setTimeout(() =>{ this.navigateTo('/dashboard', { Move_return: true }); } ,300); }

  // --- UI Functions ---
  hambar() { this.isMenuOpen = !this.isMenuOpen; }
  openPro() { /* Logic สำหรับเปิดเมนูโปรไฟล์ */ }
  back() { this.location.back(); }
  edit(){ this.router.navigate(['/edit']); }

  // --- เพิ่มฟังก์ชัน Save ---
  saveProfile() {
    const updatedData = {
      username: this.username,
      dob: this.dob,
      nationalId: this.nationalId,
      address: this.address,
      emergencyContact: this.emergencyContact,
      profile: this.profile
    };

    console.log('Saving Profile Data:', updatedData);
    
    // คุณสามารถใส่โค้ดเชื่อมต่อ Supabase ตรงนี้ได้
    // หลังจากบันทึกเสร็จแล้ว ให้ย้อนกลับไปหน้าเดิม
    alert('Profile saved successfully!');
    this.back();
  }
   button_cancels() {
 
}
}