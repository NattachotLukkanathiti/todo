
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
  
  private timeSubscription!: Subscription;
  constructor(private router: Router) {}

  ngOnInit(): void {

    const state = history.state;
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || 'user';

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
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole }
      })
    } ,300)
  }
  Animationa3_out(){
    this.Animation_outdash = true;

    setTimeout(() =>{
      this.router.navigate(['/sale'],{
        state:{username: this.username , email: this.email, Move_return2:true ,role:this.userRole }
      })
    } ,300)
  }
  Animationa4_out(){

    this.Animation_outdash = true
    setTimeout(() =>{
      this.router.navigate(['/history'],{
        state:{username: this.username , email: this.email, Move_return4:true ,role:this.userRole }
      })
    } ,300)
  }
  Animation_out5(){
            this.out = false;
    this.play_Return = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/suppliers'],{
        state:{username: this.username , email: this.email, Move_return5:true ,Open_bar:true ,role:this.userRole }
      })
    } ,300)
  }
  Animationa_out(){
    this.Animation_outdash = true;
    
    setTimeout(() =>{
      this.router.navigate(['/dashboard'],{
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole }
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

  loadTodos() {
    this.loader = true;
  this.todoService.getTodoss().subscribe({
    next: (res) => {
      this.todos = res;
        this.isLoading = false; 
        this.loader = false
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
    this.router.navigate(['/login']);
}
}
