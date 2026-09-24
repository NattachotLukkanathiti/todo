import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';

// ลบอันเก่าออก (ถ้ามี) แล้วใช้อันนี้แทน
import { Location } from '@angular/common';
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
private location = inject(Location);
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
// 1. ตรวจสอบว่าได้ inject Router หรือยัง (ถ้ามีแล้วข้ามได้ครับ)


  // 2. เพิ่มฟังก์ชัน navigateTo
  // แก้ไขให้รับ extraState เพิ่มเข้ามาเป็นตัวที่ 2 (ใส่ ? เพื่อให้เป็น optional)
  navigateTo(route: string, extraState: any = {}) {
    this.router.navigate([route], {
      state: { 
        username: this.username, 
        email: this.email, 
        role: this.userRole, 
        profile: this.profile,
        ...extraState // รวมข้อมูล state เสริมเข้าไปด้วย
      }
    });
  }
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

Animationa2_out(){


    setTimeout(() =>{
      this.router.navigate(['/inventory'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out2(){


    setTimeout(() =>{
      this.router.navigate(['/sale'],{
        state:{username: this.username , email: this.email, Move_return2:true ,role:this.userRole ,profile:this.profile }
      })
    } ,300)
  }
  Animation_out3(){


    setTimeout(() =>{
      this.router.navigate(['/history'],{
        state:{username: this.username , email: this.email, Move_return4:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out5(){

    setTimeout(() =>{
      this.router.navigate(['/suppliers'],{
        state:{username: this.username , email: this.email, Move_return5:true ,Open_bar:true ,role:this.userRole ,profile:this.profile }
      })
    } ,300)
  }
  Animation_out6(){

    setTimeout(() =>{
      this.router.navigate(['/audit'],{
        state:{username: this.username , email: this.email, Move_return6:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animationa_out1(){

    setTimeout(() =>{
      this.router.navigate(['/pos'],{
        state:{username: this.username , email: this.email, Move_return6:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out4(){

    setTimeout(() =>{
      this.router.navigate(['/employee'],{
        state:{username: this.username , email: this.email, Move_return6:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  
  
  Animationa_out(){

    
    setTimeout(() =>{
      this.router.navigate(['/dashboard'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole ,profile:this.profile }
      })
    } ,300)
  }
  // --- UI Functions ---
  hambar() { this.isMenuOpen = !this.isMenuOpen; }
  openPro() { /* Logic สำหรับเปิดเมนูโปรไฟล์ */ }
  back() {
    // สั่งให้ย้อนกลับไปหน้าก่อนหน้า
    this.location.back();
  }
  edit(){
    this.router.navigate(['/edit'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole ,profile:this.profile }
      })
  }
}