import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private todoService = inject(TodoService);

  search = '';
  items: string[] = ['รายการที่ 1', 'รายการที่ 2', 'รายการที่ 3'];
  filteredItems: string[] = [...this.items];

  data: any[] = [];
  months: string[] = [];
  errorMessage: string = '';
  email = '';
  username = '';
  showpopup = false;
  profile = '';
  navigationState?: any;
  popup = '';
  showpopupnoti = false;
  isMenuOpen = false;
  isMenuOpenprofile = false;
  currentView = 'dashboard';
  stan = false;
  currentTime = new Date();
  isTimeOpen = false;
  Animation_out = false;
  Animation_outsale = false;
  play_Return = false;
  inhere = false;
  outs = false;
  out = false;
  todos: any[] = [];
  Max = false;
  loader = false
  userRole: string = '';
  blur= false;
  summary: any = {
  todays_sale: 0,
  yearly_total_sales: 0,
  net_income: 0,
  products: 0
};
  private timeSubscription!: Subscription;
  constructor(private router: Router) {}

  ngOnInit(): void {

    const state = history.state;
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || 'user';
    this.profile = state.profile || '';
    this.loadTodos()
     if (state.Move_return === true) {
    this.stan = false;
    this.play_Return = true;
    this.inhere = true;
    this.loadSummary(); 
  }

  // เข้ามาจาก Login
  else if (state.stan === true) {
    this.stan = true;
        this.inhere = true;
    this.play_Return = false;
  }
  if (state.Dont_animation === true){
     this.inhere = false;
    this.outs = true;
    
  }

    if(!this.username || !this.email){
      this.openpopupnoti("Session not found. Redirecting to login")
    return;
  }
    this.loadChartData();
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  
  }
  
  loadSummary() {
    this.todoService.getSummary().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const data = res[0];
          // แปลงค่าเป็น Number เพื่อให้ Pipe ของ Angular ทำงานได้ถูกต้อง
          this.summary = {
            todays_sale: Number(data.todays_sale) || 0,
            yearly_total_sales: Number(data.yearly_total_sales) || 0,
            net_income: Number(data.net_income) || 0,
            products: Number(data.products) || 0
          };
        }
      },
      error: (err) => console.error('Error loading summary:', err)
    });
  }
  Animationa_out(){
    this.outs = false;
        this.out = true;
    this.play_Return = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/inventory'],{
        state:{username: this.username , email: this.email ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out2(){
            this.out = true;
    this.play_Return = false;
    this.Animation_outsale = true;
    setTimeout(() =>{
      this.router.navigate(['/sale'],{
        state:{username: this.username , email: this.email, Move_return3:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out3(){
            this.out = true;
    this.play_Return = false;
    this.Animation_outsale = true;
    setTimeout(() =>{
      this.router.navigate(['/history'],{
        state:{username: this.username , email: this.email, Move_returnH:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out4(){
            this.out = true;
    this.play_Return = false;
    this.Animation_outsale = true;
    setTimeout(() =>{
      this.router.navigate(['/employee'],{
        state:{username: this.username , email: this.email, Move_return4:true ,role:this.userRole ,profile:this.profile }
      })
    } ,300)
  }
  Animation_out5(){
            this.out = false;
    this.play_Return = false;
    this.Animation_outsale = true;
    setTimeout(() =>{
      this.router.navigate(['/suppliers'],{
        state:{username: this.username , email: this.email, Move_return5:true ,Dont_animation:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animation_out6(){
            this.out = true;
    this.play_Return = false;
    this.Animation_outsale = true;
    setTimeout(() =>{
      this.router.navigate(['/audit'],{
        state:{username: this.username , email: this.email, Move_return6:true ,Dont_animation:true ,role:this.userRole ,profile:this.profile}
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
  
  this.todoService.getTodoss().subscribe({
    next: (res) => {
      console.log("Todos Data:", res);
      
      // สมมติว่าคุณมีตัวแปร currentState ที่เก็บข้อมูล state ที่ส่งมา
      const currentEmail = this.navigationState?.state?.email;

      if (currentEmail) {
        // กรองให้เหลือเฉพาะ todo ที่ email ตรงกับ state
        this.todos = res.filter(todo => todo.email === currentEmail);
      } else {
        this.todos = res;
      }
    },
    error: (err) => console.error(err)
  });
}

  loadChartData() {
    this.loader = true; // Set to true before fetching data
    this.todoService.getMonth().subscribe({
      next: (res) => {
        this.data = res;
        this.months = res.map(item => item.month);
        this.loader = false; // Set to false once data is ready
      },
      error: (err) => {
        console.error(err);
        this.loader = false; // Also set to false on error
      }
    });
  }

  toggleMenu() {
    this.outs = false;
    this.isMenuOpen = !this.isMenuOpen;
    this.Max = !this.Max;
    this.isMenuOpenprofile = !this.isMenuOpenprofile;
  }
  hambar(){
    this.isMenuOpen = !this.isMenuOpen;
    this.blur = !this.blur;
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
}