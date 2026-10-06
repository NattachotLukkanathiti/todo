
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-history',
  imports: [CommonModule, DatePipe, RouterLink,FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
    button_cancel = false;
  button_importt = false;
    button_edit = false;
    button_request = false;
        outimport = false;
        product2 = true;
           selectedProduct: any = {}; 
  private todoService = inject(TodoService);

  search = '';
  items: string[] = ['รายการที่ 1', 'รายการที่ 2', 'รายการที่ 3'];
  filteredItems: string[] = [...this.items];

  data: any[] = [];
  months: string[] = [];
  
  email = '';
  username = '';
  showpopup = false;
  popup = '';
  showpopupnoti = false;
  isMenuOpen = true;
  isMenuOpenprofile = false;
  currentView = 'dashboard';
  currentTime = new Date();
  isTimeOpen = false;
  Animation_out = false;
  out = true;
  history: any[] = []; 
  reload = false;
  isLoading = false; 
  loader = false;
  profile = '';
 play_Return = false;
   Animation_outdash = false;
  return = false;
    stan = false;
   userRole: string = '';
  private timeSubscription!: Subscription;
  constructor(private router: Router) {}

  ngOnInit(): void {

    const state = history.state;
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || 'user';
    this.profile = state.profile || '';
    this.loadHistory();
     if (state.Move_return === true) {
       this.stan = false;
      this.play_Return = true;
    this.out = false;
  }
  if (state.Move_returnH === true) {
    this.out = false;
  }
  if (state.Move_returns3 === true) {
        this.play_Return = false;
    this.out = false;
    
  }
   if (state.Move_return4 === true) {
        this.out = false
    this.play_Return = true;
  }
  if (state.Move_return44 === true) {
        this.out = false
    this.play_Return = false;
  }

    if(!this.username || !this.email){
      this.openpopupnoti("Session not found. Redirecting to login")
    return;
    }
      

      
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }
  reloads() {
    this.history
    this.isLoading = true; 
}   
  Animationa2_out(){
    this.Animation_outdash = true;

    setTimeout(() =>{
      this.router.navigate(['/inventory'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole ,profile:this.profile }
      })
    } ,300)
  }
  Animationa3_out(){
    this.Animation_outdash = true;

    setTimeout(() =>{
      this.router.navigate(['/sale'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animationa4_out(){
    this.Animation_out = true;
    

    setTimeout(() =>{
      this.router.navigate(['/employee'],{
        state:{username: this.username , email: this.email, Move_return4:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out5(){
              this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/suppliers'],{
        state:{username: this.username , email: this.email, Move_return5:true ,Open_bar:true ,role:this.userRole ,profile:this.profile}
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
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole  ,profile:this.profile}
      })
    } ,300)
  }
  openpopupnoti(message:string){
    this.showpopupnoti = true;
    this.popup = message;
  }
  openpopup(message:string){
    this.showpopup = true;
    this.popup = message;
  }
  closepopup(){
    this.showpopup = false;
    this.showpopupnoti = false;
    
  
      this.router.navigate(['/login']); 
    
  }
  ngOnDestroy() {
    this.timeSubscription?.unsubscribe();
  }


 loadHistory() {
    this.loader = true;
    
    // 1. ดึงข้อมูลผู้ใช้จากตาราง todos ก่อน
    this.todoService.getTodoss().subscribe({
      next: (users) => {
        
        // 2. เมื่อได้ข้อมูลผู้ใช้แล้ว ค่อยดึงข้อมูล History
        this.todoService.getHistory().subscribe({
          next: (res) => {
            this.history = res.map((item: any) => {
              // ค้นหาผู้ใช้ที่ตรงกับ created_by
              const user = users.find((u: any) => u.username === item.created_by);
              
              return {
                ...item,
                created_by: item.created_by || 'Unknown User',
                // ใช้รูปจากฟิลด์ profile ในตาราง todos
                picture: user && user.profile ? user.profile : 'assets/default-avatar.png'
              };
            });
            
          
            this.isLoading = false;
            this.loader = false;
          }
        });
        
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loader = false;
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

  filterS() {
    this.filteredItems = this.items.filter(item =>
      item.toLowerCase().includes(this.search.toLowerCase())
    );
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
  requestFromHistory(order: any) {
  this.loader = true;
  
  // ดึงข้อมูล request_history ทั้งหมดมา
  this.todoService.getRequestHistory().subscribe({
    next: (list) => {
      // ค้นหาคำขอที่ตรงกับ SKU นี้ และมีสถานะเป็น Pending
      const found = list.find((item: any) => item.sku === order.sku && item.status === 'Pending');
      
      if (found) {
        this.selectedProduct = found; // นำข้อมูลที่เจอมาแสดง
      } else {
        // ถ้าไม่เจอ ให้เอาข้อมูลจากตาราง history มาแสดงแทน
        this.selectedProduct = { ...order, id: null }; 
      }
      
      this.button_edit = true;
      this.outimport = false;
      this.loader = false;
    },
    error: (err) => {
      console.error('Error fetching request detail:', err);
      this.openpopupnoti("ไม่สามารถดึงข้อมูลได้");
      this.loader = false;
    }
  });
}
  request2(order: any) {
    this.selectedProduct = { ...order }; // นำข้อมูลที่รับมาใส่ใน selectedProduct
    this.outimport = false;
    this.product2 = false;
  }
  button_cancels(){
    this.outimport = true;
    setTimeout(() =>{
    this.product2 = true;
        this.button_edit = false;
    },400)
  }
  confirmAdjustment() {
  if (!this.selectedProduct.requested_quantity) {
    this.openpopupnoti("กรุณาระบุ Requested Quantity");
    return;
  }

  this.loader = true;
  const now = new Date();

  const requestData = {
    sku: this.selectedProduct.sku,
    requested_quantity: this.selectedProduct.requested_quantity,
    staff_reason: this.selectedProduct.staff_reason || '',
    status: 'Pending',
    created_by: this.username,
    created_at: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0]
  };

  // 1. บันทึกข้อมูลลง request_history
  this.todoService.addRequestHistory(requestData).subscribe({
    next: (response) => {
      
      // 2. อัปเดตสถานะในตาราง history ให้เป็น Pending
      this.todoService.updateHistoryStatusBySku(this.selectedProduct.sku, 'Pending').subscribe({
        next: () => {
          this.loader = false;
          this.openpopup("บันทึกข้อมูลสำเร็จ: Pending");
          this.button_cancels(); 
          this.loadHistory(); // โหลดข้อมูลใหม่เพื่อให้ UI อัปเดตสี
        },
        error: (err) => {
          this.loader = false;
          console.error("Error updating history status:", err);
        }
      });

    },
    error: (error) => {
      this.loader = false;
      console.error("Error saving request:", error);
      this.openpopupnoti("การบันทึกล้มเหลว: Canceled");
      this.button_cancels();
    }
  });
}
  requestHistoryList: any[] = [];

  // ดึงข้อมูล Request History
  loadRequestHistory() {
    this.loader = true;
    this.todoService.getRequestHistory().subscribe({
      next: (res) => {
        this.requestHistoryList = res;
        this.loader = false;
      },
      error: (err) => {
        console.error('Error loading request history:', err);
        this.loader = false;
      }
    });
  }

  // เมื่อกดดูรายละเอียด
  viewRequestDetail(item: any) {
    this.selectedProduct = { ...item };
    this.button_edit = true;
    this.outimport = false;
  }
  confirmAdjustment2() {
  // 1. สร้างตัวแปรแยก (Local Variables) เพื่อดึงค่ามาจาก UI ป้องกันการกระทบกับตัวแปรหลัก
  const currentId = this.selectedProduct.id;
  const currentSku = this.selectedProduct.sku;
  const selectedStatus = this.selectedProduct.status;
  const inputPassword = this.selectedProduct.confirm_password;
  const adminNote = this.selectedProduct.admin_note;

  if (!selectedStatus) {
    this.openpopupnoti("กรุณาเลือก Adjustment Status");
    return;
  }
  if (!inputPassword) {
    this.openpopupnoti("กรุณากรอก Confirm Password");
    return;
  }

  this.loader = true;

  // 2. ดึงข้อมูลผู้ใช้เพื่อตรวจสอบรหัสผ่าน
  this.todoService.getTodoss().subscribe({
    next: (users) => {
      const currentUser = users.find((u: any) => u.username === this.username);

      if (!currentUser || currentUser.password !== inputPassword) {
        this.loader = false;
        this.openpopupnoti("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่");
        return;
      }

      // 3. อัปเดตสถานะโดยใช้ตัวแปรที่แยกออกมา
      this.todoService.updateRequestStatus(currentId, selectedStatus).subscribe({
        next: () => {
          this.todoService.updateHistoryStatusBySku(currentSku, selectedStatus).subscribe(() => {
            
            // TODO: เพิ่มการบันทึก adminNote ลงในฐานข้อมูลที่นี่
            
            this.loader = false;
            this.openpopupnoti(`ทำรายการสำเร็จ: ${selectedStatus}`);
            this.button_cancels();
            this.loadHistory();
          });
        },
        error: (err) => {
          this.loader = false;
          console.error("Error updating status:", err);
          this.openpopupnoti("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
      });
    },
    error: (err) => {
      this.loader = false;
      console.error("Error fetching users:", err);
      this.openpopupnoti("ไม่สามารถตรวจสอบข้อมูลผู้ใช้ได้");
    }
  });
}
}
