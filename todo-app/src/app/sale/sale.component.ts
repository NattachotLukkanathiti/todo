
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-sale',
  imports: [CommonModule, DatePipe, RouterLink,FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {
   button_cancel = false;
  button_importt = false;
    button_edit = false;
    button_request = false;
        outimport = false;
        product2 = true;
           selectedProduct: any = {}; 


 itemsPerPage: number = 10; 
  currentPage: number = 1;
  totalPages: number = 1;
  pagesArray: number[] = [];
  saleOrders: any[] = []; 
  filteredSaleOrders: any[] = []; // <-- เพิ่มบรรทัดนี้
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
  isMenuOpen = true;
  isMenuOpenprofile = false;
  currentView = 'dashboard';
  currentTime = new Date();
  isTimeOpen = false;
  Animation_out = false;
  out = false;

  reload = false;
  isLoading = false; 
  loader = false;
  Animation_outdash = false;
  return = false;
  profile = '';
  play_Return = false;
   userRole: string = '';
  
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
   

    if(!this.username || !this.email){
      this.openpopupnoti("Session not found. Redirecting to login")
    return;
    }

      this.loadSaleOrders(); 
      
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }
  // ฟังก์ชันเปลี่ยนหน้า
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ฟังก์ชันดึงข้อมูลเฉพาะหน้าปัจจุบัน
  get paginatedSaleOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSaleOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // ฟังก์ชันอัปเดตตัวเลขหน้า
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredSaleOrders.length / this.itemsPerPage);
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }
  reloads() {
  this.loadSaleOrders();
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
    this.Animation_out = true;

    setTimeout(() =>{
      this.router.navigate(['/history'],{
        state:{username: this.username , email: this.email, Move_return44:true , role:this.userRole ,profile:this.profile}
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
  Animation_out6(){
              this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/audit'],{
        state:{username: this.username , email: this.email, Move_return6:true ,Open_bar:true ,role:this.userRole ,profile:this.profile}
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
    Animationa_out1(){

    setTimeout(() =>{
      this.router.navigate(['/pos'],{
        state:{username: this.username , email: this.email, Move_return6:true ,role:this.userRole ,profile:this.profile}
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

  loadSaleOrders() {
    this.loader = true;
    this.todoService.getSaleOrders().subscribe({
      next: (res) => {
        this.saleOrders = res;
        this.filteredSaleOrders = [...res]; // <-- เพิ่มบรรทัดนี้
        
        this.updatePagination(); // <-- เพิ่มบรรทัดนี้
        
        this.isLoading = false; 
        this.loader = false;
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
  openPro(){
    this.isMenuOpenprofile = !this.isMenuOpenprofile;
  }
    // เพิ่มตัวแปรสำหรับสำรองข้อมูล
originalProductState: any = {};

opencancel(order: any) {
  // สำรองข้อมูลเดิมไว้ก่อนการแก้ไข
  this.originalProductState = { ...order };
  
  this.selectedProduct = { 
    ...order, 
    cancel_reason: order.cancel_reason || '' 
  };
  
  this.outimport = false;
  this.product2 = false;
}

button_cancels() {
  // คืนค่าข้อมูลกลับไปเป็นเหมือนเดิม
  this.selectedProduct = { ...this.originalProductState };
  
  this.outimport = true;
  setTimeout(() => {
    this.product2 = true;
    this.button_edit = false;
  }, 400);
}
confirmCancel() {
  const orderCode = this.selectedProduct.order_code;
  const newStatus = 'Canceled';
  const reason = this.selectedProduct.cancel_reason || '';

  // 1. อัปเดตสถานะ Sale Order
  this.todoService.updateSaleOrderStatus(orderCode, newStatus, reason).subscribe({
    next: (response) => {
      
      // 2. คืนจำนวนสินค้ากลับเข้าสต็อก (สมมติว่าใน order มี items)
      if (this.selectedProduct.items && this.selectedProduct.items.length > 0) {
        this.selectedProduct.items.forEach((item: any) => {
          
          // ดึงข้อมูลสินค้าปัจจุบันจาก Inventory ก่อน
          this.todoService.getInventory().subscribe(inventory => {
            const product = inventory.find(p => p.sku === item.sku);
            if (product) {
              const newStock = product.stock + item.quantity; // บวกจำนวนกลับ
              
              // อัปเดตสต็อกใหม่
              this.todoService.updateInventoryStock(item.sku, { stock: newStock }).subscribe();
            }
          });
          
        });
      }

      // 3. อัปเดตหน้าจอ (Frontend)
      this.selectedProduct.status = newStatus;
      const index = this.saleOrders.findIndex(o => o.order_code === orderCode);
      if (index !== -1) this.saleOrders[index] = { ...this.selectedProduct };

      const filteredIndex = this.filteredSaleOrders.findIndex(o => o.order_code === orderCode);
      if (filteredIndex !== -1) this.filteredSaleOrders[filteredIndex] = { ...this.selectedProduct };

      // 4. ปิดหน้าต่าง Popup
      this.outimport = true;
      setTimeout(() => {
        this.product2 = true;
        this.button_edit = false;
      }, 400);
    },
    error: (err) => {
      console.error('Error updating order status:', err);
      this.openpopupnoti('ไม่สามารถยกเลิกรายการได้ กรุณาลองใหม่อีกครั้ง');
    }
  });
}
}
