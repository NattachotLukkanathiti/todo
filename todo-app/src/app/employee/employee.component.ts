
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-employee',
   imports: [CommonModule, DatePipe, RouterLink,FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

  private todoService = inject(TodoService);

  search = '';
  items: string[] = ['รายการที่ 1', 'รายการที่ 2', 'รายการที่ 3'];
  filteredItems: string[] = [...this.items];

  data: any[] = [];
  months: string[] = [];
    stan = false;
  email = '';
  username = '';
  showpopup = false;
  popup = '';
  showpopupnoti = false;
  isMenuOpen = false;
  isMenuOpenprofile = false;
  currentView = 'dashboard';
  currentTime = new Date();
  isTimeOpen = false;
  Animation_out = false;
  out = false;
  saleOrders: any[] = []; 
  reload = false;
  isLoading = false; 
  loader = false;
  Animation_outdash = false;
  return = false;
  play_Return = false;
  employee :any[] = []; 
  todos :any[] = []; 
  userRole: string = '';
  profile = '';
  employeeList: any[] = []; 
filteredEmployeeList: any[] = [];
outimport = false;
product = true;
button_cancel = false;
button_edit_account = false;
selectedaccount: any = { role: '' };
  private timeSubscription!: Subscription;
  constructor(private router: Router) {}

  ngOnInit(): void {

    const state = history.state;
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || 'user';
    this.profile = state.profile || '';

     if (state.Move_return === true) {
    this.stan = false;
      this.play_Return = true;
      this.out = false;
  }
    if (state.Move_return2 === true){
      this.stan = false;
      this.play_Return = true;
      this.out = false;
    }
    if (state.Move_return3 === true){
    
    }
    if (state.Move_return4 === true){
      this.stan = false;
      this.play_Return = false;
      this.Animation_outdash = false
      this.Animation_out = false;
      this.out = false;
    }
    if (state.Move_returnout === true){
        this.play_Return = true;
    }

    if(!this.username || !this.email){
      this.openpopupnoti("Session not found. Redirecting to login")
    return;
    }

      this.loadTodos(); 
      
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }
  reloads() {
  this.loadTodos();
    this.isLoading = true; 
}   
  Animationa2_out(){
    this.Animation_outdash = true;

    setTimeout(() =>{
      this.router.navigate(['/inventory'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animationa3_out(){
    this.Animation_outdash = true;

    setTimeout(() =>{
      this.router.navigate(['/sale'],{
        state:{username: this.username , email: this.email, Move_return2:true ,role:this.userRole ,profile:this.profile }
      })
    } ,300)
  }
  Animationa4_out(){

    this.Animation_outdash = true
    setTimeout(() =>{
      this.router.navigate(['/history'],{
        state:{username: this.username , email: this.email, Move_return4:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out5(){
            this.out = false;
    this.play_Return = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/suppliers'],{
        state:{username: this.username , email: this.email, Move_return5:true ,Open_bar:true ,role:this.userRole ,profile:this.profile }
      })
    } ,300)
  }
  Animationa6_out(){
 this.out = false;
    this.play_Return = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/audit'],{
        state:{username: this.username , email: this.email, Move_return6:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  
  Animationa_out(){
    this.Animation_outdash = true;
    
    setTimeout(() =>{
      this.router.navigate(['/dashboard'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole ,profile:this.profile }
      })
    } ,300)
  }
  openpopupnoti(message:string){
    this.showpopupnoti = true;
    this.popup = message;
  }
  closepopup(){
    this.showpopup = false;
    this.showpopupnoti = false;
    this.button_edit_account = false;
    
  
      this.router.navigate(['/login']); 
    
  }
  ngOnDestroy() {
    this.timeSubscription?.unsubscribe();
  }
  // ปรับชื่อและค่า scale ให้เหมาะกับความสูงของกราฟ
  calculateHeight(valueInBaht: number): number {
    const maxHeight = 300; // ความสูงสูงสุดที่ยอมรับได้ (px)
    const scale = 0.004;    // อัตราส่วนย่อขยาย (ปรับตามความเหมาะสมของข้อมูล)
    
    return Math.min(valueInBaht * scale, maxHeight);
  }

  loadTodos() {
    this.loader = true;
  this.todoService.getTodoss().subscribe({
    next: (res) => {
      this.todos = res;
        this.isLoading = false; 
        this.loader = false
        this.employeeList = res;
        this.filteredEmployeeList = [...this.employeeList]; // คัดลอกข้อมูลมาแสดงผลเริ่มต้น
    },
    error: (err) => {
      console.error('Error fetching sale order:', err);
    }
  });
}


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isMenuOpenprofile = !this.isMenuOpenprofile;
  }
  hambar(){
    this.isMenuOpen = !this.isMenuOpen;
  }

  setView(view: string) {
    this.currentView = view;
  }

isGuest(role: string): boolean {
  return role === '' || role === null || role === undefined;
}
  filterS() {
    if (!this.search) {
      this.filteredEmployeeList = [...this.employeeList];
    } else {
      const searchTerm = this.search.toLowerCase();
      this.filteredEmployeeList = this.employeeList.filter(emp => 
        (emp.username && emp.username.toLowerCase().includes(searchTerm)) ||
        (emp.code && emp.code.toLowerCase().includes(searchTerm)) ||
        (emp.title && emp.title.toLowerCase().includes(searchTerm))
      );
    }
  }


// ตัวแปรเก็บข้อมูล
filterEmployee(selected: string) {
  if (selected === 'all') {
    this.filteredEmployeeList = [...this.employeeList];
  } else {
    let mappedRole = selected;
    if (selected === 'Guest') mappedRole = '';
    if (selected === 'Front') mappedRole = 'pos';
    if (selected === 'Back') mappedRole = 'backend';
    if (selected === 'Admin') mappedRole = 'admin';

    this.filteredEmployeeList = this.employeeList.filter(emp => {
      if (mappedRole === '') {
        // เช็คว่าเป็น null, undefined, หรือค่าว่าง
        return emp.role === null || emp.role === undefined || emp.role === '';
      }
      return emp.role === mappedRole;
    });
  }
}
  button_cancels() {
   this.outimport = true;
  const element = document.querySelector('.con_import_product') as HTMLElement;
  const element2 = document.querySelector('.con_import_product2') as HTMLElement;
  if (element) {
    element.scrollTop = 0;
    element.classList.add('out');
  }
  if (element2) {
    element2.scrollTop = 0;
    element2.classList.add('out');
  }

  setTimeout(() => {
    this.button_cancel = false;
    this.outimport = false;
    this.button_edit_account = false

  }, 400);
}
button_edit_account2(item?: any) {
  this.button_edit_account = true;
  if (item) {
    this.selectedaccount = { ...item }; 
    
    // แปลงค่าจากฐานข้อมูลให้ตรงกับ value ใน HTML
    if (this.selectedaccount.role === 'pos') this.selectedaccount.role = 'Frontend';
    if (this.selectedaccount.role === 'backend') this.selectedaccount.role = 'Backend';
    if (this.selectedaccount.role === 'admin') this.selectedaccount.role = 'Admin';
  }
}
logout() {
    const now = new Date();
    const auditData = {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      username: this.username, 
      email: this.email,       
      activity: 'Logout', 
      role: this.userRole,     
      picture: this.profile
    };


    this.todoService.logAudit(auditData).subscribe({
      next: () => {
        console.log('Logout audit saved');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Failed to save logout audit', err);
        this.router.navigate(['/login']); 
      }
    });
  }
  // เพิ่มฟังก์ชันนี้เข้าไปใน class EmployeeComponent
  // ฟังก์ชันสำหรับบันทึกข้อมูลและส่งไปยัง Backend
  saveAccountChanges() {
    // 1. แปลงค่า Role กลับให้ตรงกับที่ฐานข้อมูลต้องการ
    let mappedRole = this.selectedaccount.role;
    if (mappedRole === 'Frontend') mappedRole = 'pos';
    if (mappedRole === 'Backend') mappedRole = 'backend';
    if (mappedRole === 'Admin') mappedRole = 'admin';

    const updatedAccount = {
      ...this.selectedaccount,
      role: mappedRole
    };

    // 2. ส่งข้อมูลไปอัปเดตที่ Backend
    this.todoService.updateEmployee(updatedAccount.username, updatedAccount).subscribe({
      next: (res) => {
        this.openpopupnoti("Account updated successfully");
        this.loadTodos(); // โหลดข้อมูลใหม่
        this.button_cancels(); // ปิดหน้าต่าง
      },
      error: (err) => {
        console.error('Error updating account:', err);
        this.openpopupnoti("Failed to update account");
      }
    });
  }
}
