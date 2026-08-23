import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, DatePipe, RouterLink,FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {

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
  isMenuOpen = false;
  isMenuOpenprofile = false;
  currentView = 'dashboard';
  currentTime = new Date();
  isTimeOpen = false;
  Animation_out = false;
  Animation_outdash = false;
  return = false;
  play_Return = false;
  out = false;
  stan = false;
  Inventory: any[] = [];
  isLoading = false; 
  button_cancel = false;
  button_importt = false;
  product = true;
  product2 = true;
  button_addd = false;
    outimport = false;
    loader = true;
    userRole: string = '';
  private timeSubscription!: Subscription;
  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || 'user'; // เพิ่มเติม: รับค่า role (ค่าเริ่มต้นเป็น user)

    if (state.Move_return === true) {
      this.stan = false;
      this.play_Return = true;
      this.out = false;
    }

    if(!this.username || !this.email){
      this.openpopupnoti("Session not found. Redirecting to login")
      return;
    }
    this.loadInventory();
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }

  Animationa_out(){
    this.Animation_out = true;
    this.Animation_outdash = true;
    setTimeout(() =>{
      this.router.navigate(['/dashboard'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole }
      })
    } ,300)
  }
  Animationa_out2(){
      this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/sale'],{
        state:{username: this.username , email: this.email, Move_returns:true, role:this.userRole }
      })
    } ,300)
  }
  Animationa_out3(){
      this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/history'],{
        state:{username: this.username , email: this.email, Move_returns3:true ,role:this.userRole }
      })
    } ,300)
  }
  Animationa_out4(){
      this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/employee'],{
        state:{username: this.username , email: this.email, Move_returns4:true ,role:this.userRole }
      })
    } ,300)
  }
  Animation_out5(){
              this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/suppliers'],{
        state:{username: this.username , email: this.email, Move_return5:true ,Open_bar:true ,role:this.userRole }
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
    this.router.navigate(['/login']);
}
  loadInventory() {
  this.todoService.getInventory().subscribe({
    next: (res) => {
      this.Inventory = res;
        this.isLoading = false; 
        this.loader = false;
    },
    error: (err) => {
      console.error('Error fetching sale order:', err);
    }
  });
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
    this.button_importt = false;
    this.button_addd = false;
    this.button_cancel = false;
    this.outimport = false;
  }, 400);
}
  button_imports(){
       this.outimport = false;
    this.button_importt = true;
    
  }
  button_adds(){
    this.button_addd = true;
  }
}
