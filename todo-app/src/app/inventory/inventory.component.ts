import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { interval, Subscription } from 'rxjs';
import { createClient } from '@supabase/supabase-js';
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
  profile = '';
  email = '';
  username = '';
  showpopup = false;
  popup = '';
  navigationState?: any;
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
  todos: any[] = [];
  button_addd = false;
    outimport = false;
    loader = true;
    userRole: string = '';
      newProduct = {
    sku: '',
    product_name: '',
    category: '',
    brand: '',
    price: null,
    quantity_alert: null,
    supplier: '',
    invoice_no: '',
    import_quantity: null
  };

  selectedFile: File | null = null;
  
  //  เพิ่มบรรทัดนี้เข้าไปค่ะ
  imagePreview: string | null = null;
 private supabaseUrl = 'https://ehyhllaxvozjdndddfku.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoeWhsbGF4dm96amRuZGRkZmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjUyMzAsImV4cCI6MjEwMDQ0MTIzMH0.FQ98R2OopmNkIBQLTeieKGETr0asT2KAaMf-G6uSLq4';
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);
  private timeSubscription!: Subscription;
  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;
    this.username = state.username || '';
    this.email = state.email || '';
    this.userRole = state.role || 'user'; // เพิ่มเติม: รับค่า role (ค่าเริ่มต้นเป็น user)
    this.profile = state.profile || '';

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
        state:{username: this.username , email: this.email, Move_return:true ,role:this.userRole,profile:this.profile }
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


  // 3. ฟังก์ชันสำหรับล้างค่าฟอร์ม
  resetForm() {
    this.newProduct = {
      sku: '', product_name: '', category: '', brand: '', price: null,
      quantity_alert: null, supplier: '', invoice_no: '', import_quantity: null
    };
  }

  // 1. รับไฟล์เมื่อผู้ใช้เลือกรูป
  // 1. รับไฟล์เมื่อผู้ใช้เลือกรูป และสร้างตัวอย่างรูปภาพ
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // เพิ่มโค้ดส่วนนี้ เพื่อให้แสดงรูปตัวอย่าง
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // 2. อัปโหลดรูปและบันทึกข้อมูล
  async saveToStock() {
    this.isLoading = true;
    let pictureUrl = '';

    try {
      // ถ้ามีไฟล์ ให้ทำการอัปโหลดไปที่ Supabase ก่อน
      if (this.selectedFile) {
        const fileExt = this.selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `inventory/${fileName}`;

        const { data, error } = await this.supabase.storage
          .from('Photo') // ใส่ชื่อ Bucket ของคุณ
          .upload(filePath, this.selectedFile);

        if (error) throw error;

        // ดึง Public URL
        const { data: publicUrlData } = this.supabase.storage
          .from('Photo')
          .getPublicUrl(filePath);
          
        pictureUrl = publicUrlData.publicUrl;
      }

      // เพิ่ม pictureUrl เข้าไปใน object ข้อมูล
      const productData = {
        ...this.newProduct,
        picture: pictureUrl
      };

      // ส่งข้อมูลไปที่ Backend
      this.todoService.addInventory(productData).subscribe({
        next: (res) => {
          this.openpopupnoti('บันทึกข้อมูลสำเร็จ');
          this.loadInventory();
          this.button_cancels();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      this.openpopupnoti('อัปโหลดรูปภาพไม่สำเร็จ');
      this.isLoading = false;
    }
  }
}
