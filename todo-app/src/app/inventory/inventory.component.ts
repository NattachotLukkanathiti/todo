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
  showpopupedit = false;
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
  button_edit = false;
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
  item: any;  
  showpopupconfirm = false
  selectedFile: File | null = null;
  isEditMode = false;
  outedit = false;
selectedProduct: any = {
  category: '',
  brand: '',
  price: null,
  quantity_alert: null
};
  originalProduct: any = null; 


  
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
        state:{username: this.username , email: this.email, Move_returns:true, role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animationa_out3(){
      this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/history'],{
        state:{username: this.username , email: this.email, Move_returns3:true ,role:this.userRole ,profile:this.profile}
      })
    } ,300)
  }
  Animationa_out4(){
      this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/employee'],{
        state:{username: this.username , email: this.email, Move_returns4:true ,role:this.userRole ,profile:this.profile}
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
  Animationa_out6(){
              this.out = false;
    this.Animation_out = true;
    setTimeout(() =>{
      this.router.navigate(['/audit'],{
        state:{username: this.username , email: this.email, Move_return6:true ,Open_bar:true ,role:this.userRole ,profile:this.profile}
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
  openpopup_confirm(message:string){
    this.popup = message;
  }
  openpopup_edit(message:string){
    this.showpopupedit = true;
    this.popup = message;
  }
  closepopup(){
    this.showpopupconfirm = false
    this.showpopup = false
         this.showpopupedit = false;
         this.outimport = true;
    this.button_edit = false;
    
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
      const currentEmail = this.navigationState?.state?.email;
      if (currentEmail) {
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
  loadInventory() {
  this.todoService.getInventory().subscribe({
    next: (res) => {
      // สมมติว่ามีฟิลด์ updated_at หรือ id ที่สามารถใช้เรียงลำดับได้
      this.Inventory = res.sort((a, b) => {
        // เรียงจากมากไปน้อย (ล่าสุดขึ้นก่อน)
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
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
    this.button_edit = false;
    this.button_cancel = false;
    this.outimport = false;
    this.imagePreview = null;
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


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
    
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


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
          this.openpopup('New product created successfully. View changes in Stock History');
          this.loadInventory();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      this.openpopup('อัปโหลดรูปภาพไม่สำเร็จ');
      this.isLoading = false;
    }
  }
  // 1. สร้างตัวแปรเก็บฟังก์ชัน resolve ของ Promise
private resolveConfirm: ((value: boolean) => void) | null = null;

// 2. ฟังก์ชันหลักของคุณ (ใส่ async เพิ่มเข้าไป)
async button_delete(sku: string, index: number) {
    this.showpopupconfirm = true;
    this.openpopup_confirm("Are you sure you want to delete this item? This action cannot be undone.");
    // สร้าง Promise เพื่อหยุดรอการกดปุ่ม
    const confirm = await new Promise<boolean>((resolve) => {
      this.resolveConfirm = resolve;
    });
  
    if (confirm) {
      this.isLoading = true;
      
      this.todoService.deleteInventory(sku).subscribe({
        next: (res) => {
          this.Inventory.splice(index, 1);
          this.openpopup('ลบสินค้าเรียบร้อยแล้ว');
          this.isLoading = false;
          const now = new Date();
          const auditData = {
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0],
            username: this.username,
            email: this.email,
            activity: `Delete Inventory SKU: ${sku}`, // ระบุว่าลบอะไร
            role: this.userRole,
            picture: this.profile
          };

          this.todoService.logAudit(auditData).subscribe({
            next: () => console.log('Delete audit saved'),
            error: (err) => console.error('Failed to save delete audit', err)
          });
        },
        error: (err) => {
          this.openpopupnoti('เกิดข้อผิดพลาดในการลบสินค้า');
          this.isLoading = false;
        }
      });
    }
}
  confirmdelete() {
    this.showpopupconfirm = false;
    if (this.resolveConfirm) this.resolveConfirm(true); 
}
button_editt(item: any) {
  this.outimport = false;
  this.button_edit = true;
  this.isEditMode = true;
  this.selectedProduct = { ...item }; 
  this.imagePreview = item.picture || null;
  this.originalProduct = { ...item };
}
async saveEdit() {
  this.isLoading = true;
  // เริ่มต้นโดยใช้ค่า picture ปัจจุบัน (ซึ่งอาจเป็น URL ที่ผู้ใช้เพิ่งพิมพ์เข้ามา)
  let pictureUrl = this.selectedProduct.picture; 

  try {
    // 1. ตรวจสอบว่ามีการเลือกไฟล์ใหม่หรือไม่ (ถ้ามี จะใช้ไฟล์นี้เป็นหลัก)
    if (this.selectedFile) {
      const fileExt = this.selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `inventory/${fileName}`;

      const { data, error } = await this.supabase.storage
        .from('Photo')
        .upload(filePath, this.selectedFile);

      if (error) throw error;

      const { data: publicUrlData } = this.supabase.storage
        .from('Photo')
        .getPublicUrl(filePath);
              
      pictureUrl = publicUrlData.publicUrl;
    }

    // 2. อัปเดตข้อมูลที่จะส่งไป Backend
    const updatedProduct = {
      ...this.selectedProduct,
      picture: pictureUrl // จะเป็น URL จากไฟล์ใหม่ หรือ URL ที่พิมพ์เข้ามา
    };
    

    this.todoService.updateInventory(updatedProduct.sku, updatedProduct).subscribe({
      next: (res) => {
        this.openpopup('แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว');
        
        const index = this.Inventory.findIndex(item => item.sku === updatedProduct.sku);
      
        if (index !== -1) {
          // อัปเดตข้อมูลในตารางทันที
          this.Inventory[index] = { ...updatedProduct };
        } else {
          this.loadInventory();
        }
        const changesObj = this.getChanges(this.originalProduct, updatedProduct);
        const changedKeys = Object.keys(changesObj).join(', ');

         const now = new Date();
          const auditData = {
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().split(' ')[0],
          username: this.username,
          email: this.email,
          activity: `Edit:(${changedKeys})`,
          product:  `${updatedProduct.product_name} `,
          role: this.userRole,
          picture: this.profile,
          changes: this.getChanges(this.originalProduct, updatedProduct) // <-- แก้ไขบรรทัดนี้
        };

        this.todoService.logAudit(auditData).subscribe({
          next: () => console.log('Audit saved'),
          error: (err) => console.error('Failed to save audit', err)
        });

        this.isEditMode = false;
        this.isLoading = false;
        this.selectedFile = null; // รีเซ็ตไฟล์
      },
      error: (err) => {
        this.openpopupnoti('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
        this.isLoading = false;
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    this.openpopup('อัปโหลดรูปภาพไม่สำเร็จ');
    this.isLoading = false;
  }
}
onUrlChange(url: string) {
  if (url && url.trim() !== '') {
    // ตรวจสอบเบื้องต้นว่าเป็น URL รูปภาพหรือไม่ (ไม่บังคับ)
    if (url.startsWith('http') || url.startsWith('https')) {
      this.imagePreview = url;
    }
  } else {
    // ถ้าช่อง input ว่าง ให้ล้างรูปตัวอย่างออก (หรือจะให้กลับไปใช้รูปเดิมก็ได้)
    this.imagePreview = this.selectedProduct.picture || null;
  }
}
editt(){
  this.outimport = true;
  setTimeout(() => {
    this.button_importt = false;
    this.button_addd = false;
    this.button_edit = false;
    this.button_cancel = false;
    this.outimport = false;
    this.imagePreview = null;
  }, 400);
  this.openpopup_edit('Are you sure you want to edit this product?');
}
getChanges(original: any, updated: any) {
    const changes: { [key: string]: { from: any; to: any } } = {};
    
    Object.keys(updated).forEach(key => {
      // ไม่ต้องเปรียบเทียบฟิลด์ที่ไม่จำเป็น เช่น updated_at
      if (key !== 'updated_at' && original[key] !== updated[key]) {
        changes[key] = {
          from: original[key],
          to: updated[key]
        };
      }
    });
    
    return changes;
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
