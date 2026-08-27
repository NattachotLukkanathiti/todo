
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-suppliers',
  imports: [CommonModule, DatePipe, RouterLink,FormsModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent {

  private todoService = inject(TodoService);

  search = '';
  items: string[] = ['รายการที่ 1', 'รายการที่ 2', 'รายการที่ 3'];
  filteredItems: string[] = [...this.items];

  data: any[] = [];
  months: string[] = [];
  inhere = false;
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
  suppliers: any[] = []; 
  reload = false;
  isLoading = false; 
  loader = false;
 play_Return = false;
   Animation_outdash = false;
  return = false;
    stan = false;
    openn = false;
    profile = '';
  userRole: string = '';
  private timeSubscription!: Subscription;
  constructor(private router: Router) {}

  ngOnInit(): void {

    const state = history.state;
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || 'user';
    this.profile = state.profile || '';
    this.loadSuppliers();
     if (state.Move_return === true) {
    this.out = false;
    
  }
  if (state.Move_returns3 === true) {
        this.play_Return = false;
    this.out = false;
    
  }
  if (state.Open_bar === true){
    this.openn = true;
  }
  if (state.Dont_animation === true){
    this.openn = false;
    this.out = true;
  }
   if (state.Move_return4 === true) {
        this.out = false
    this.play_Return = true;
  }
  if (state.Move_return5 === true) {
       this.stan = false;
      this.play_Return = false;
      this.Animation_outdash = false
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
    this.suppliers
    this.isLoading = true; 
}   
  Animationa2_out(){
     this.out = false;
    this.Animation_outdash = true;
     this.inhere = true;
    this.play_Return = false;
    setTimeout(() =>{
      this.router.navigate(['/inventory'],{
        state:{username: this.username , email: this.email, Move_return:true,role:this.userRole}
      })
    } ,300)
  }
  Animationa3_out(){
     this.out = false;
    this.Animation_outdash = true;
     this.inhere = true;
    this.play_Return = false;
    setTimeout(() =>{
      this.router.navigate(['/sale'],{
        state:{username: this.username , email: this.email, Move_return:true,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animationa4_out(){
     this.out = false;
    this.Animation_outdash = true;
     this.inhere = true;
    this.play_Return = false;

    setTimeout(() =>{
      this.router.navigate(['/history'],{
        state:{username: this.username , email: this.email, Move_return4:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
   Animationa5_out(){
    this.out = false;
    this.Animation_outdash = true;
     this.inhere = true;
    this.play_Return = false;

    setTimeout(() =>{
      this.router.navigate(['/employee'],{
        state:{username: this.username , email: this.email, Move_returnout:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animationa6_out(){
    this.out = false;
    this.Animation_outdash = true;
     this.inhere = true;
    this.play_Return = false;

    setTimeout(() =>{
      this.router.navigate(['/audit'],{
        state:{username: this.username , email: this.email, Move_return4:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animationa_out(){
    this.Animation_outdash = true;

    setTimeout(() =>{
      this.router.navigate(['/dashboard'],{
        state:{username: this.username , email: this.email, Move_return:true ,Dont_animation: true ,role:this.userRole ,profile:this.profile}
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


  loadSuppliers() {
  this.loader = true;
  this.todoService.getSuppliers().subscribe({
    next: (res) => {
      this.suppliers = res;
      this.isLoading = false;
      this.loader = false;
    },
    error: (err) => {
      console.error('Error fetching history:', err);
      this.loader = false; // เพิ่มการปิด loader เมื่อเกิด error
    }
  });
}


  toggleMenu() {
    this.out = false;
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
