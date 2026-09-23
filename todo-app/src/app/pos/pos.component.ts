import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TodoService } from '../services/todo.service'; // นำเข้า TodoService

interface Category {
  label: string;
  count: number;
  icon: string;
}

interface Product {
  id: string;
  category: string;
  name: string;
  stock: number;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
  batchNo: string;
}

type HeaderPanel = 'account' | null;
type MainView = 'pos' | 'notifications' | 'help' | 'profile' | 'profile-edit';

@Component({
  selector: 'app-pos-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);
  private todoService = inject(TodoService); // เรียกใช้ TodoService
  private clockTimer?: ReturnType<typeof setInterval>;

  profile = '';
  username = '';
  role = '';

  navItems = [
    { label: 'Pos' },
    { label: 'Sales Orders' },
    { label: 'Employee' }
  ];

  paymentOptions = ['Choose', 'Cash', 'QR', 'Credit Card', 'Transfer'];
  insuranceOptions = ['Choose', 'Standard', 'Premium'];
  isClosing = false;
  helpSearch = '';
  helpIssueType = 'Select';
  avatarLinkInput = '';

  categories: Category[] = [];
  products: Product[] = [];
  email = '';
  userRole = '';
  searchTerm = '';
  selectedCategory = 'All Categories';
  selectedPayment = 'Choose';
  selectedInsurance = 'Choose';
  discountUnit: '%' | '$' = '%';
  discount = 0;
  orderCode = '0';
  cartItems: CartItem[] = [];
  selectedNav = 'Pos';
  isNavOpen = false;
  isRightPanelOpen = true;
  openPanel: HeaderPanel = null;
  currentView: MainView = 'pos';
  clock = new Date();
  notification: any[] = [];

  ngOnInit(): void {
     this.loadNotifications();
    const navigation = this.router.lastSuccessfulNavigation;
    const state = navigation?.extras.state || history.state;

    if (state || state.inhere) {
      this.profile = state.profile || '';
      this.username = state.username || '';
      this.userRole = state.role || '';
    }

    // เริ่มการทำงานของนาฬิกา
    this.clockTimer = setInterval(() => {
      this.clock = new Date();
      this.changeDetector.markForCheck();
    }, 1000);

    this.loadInventory();
  }

  loadInventory(): void {
    // ดึงข้อมูลจาก TodoService
    this.todoService.getInventory().subscribe({
      next: (res) => {
        this.products = res.map(item => ({
          id: item.sku,
          category: item.category,
          name: item.product_name,
          stock: item.quantity,
          price: item.price,
          image: item.picture
        })) || [];

        this.generateCategories(this.products);
        this.changeDetector.markForCheck();
      },
      error: (err) => console.error('Error loading inventory:', err)
    });
  }

  generateCategories(products: Product[]): void {
    const categoryMap = new Map<string, { count: number, firstImage: string }>();

    products.forEach(p => {
      if (!categoryMap.has(p.category)) {
        // ถ้ายังไม่มีหมวดหมู่นี้ ให้บันทึกรูปภาพของสินค้าชิ้นแรกไว้
        categoryMap.set(p.category, { count: 1, firstImage: p.image });
      } else {
        // ถ้ามีแล้ว ให้นับจำนวนเพิ่ม
        const data = categoryMap.get(p.category)!;
        data.count += 1;
      }
    });

    this.categories = [
      // หมวดหมู่ All ใช้รูป Black.svg
      { label: 'All Categories', count: products.length, icon: 'image/Black.svg' },

      // หมวดหมู่อื่นๆ ดึงรูปจากสินค้าชิ้นแรก
      ...Array.from(categoryMap.entries()).map(([label, data]) => ({
        label,
        count: data.count,
        icon: data.firstImage || 'image/Black.svg' // ถ้าไม่มีรูปให้ใช้ Black.svg แทน
      }))
    ];
  }

  get filteredProducts(): Product[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.products.filter((product) => {
      const categoryMatches = this.selectedCategory === 'All Categories' || product.category === this.selectedCategory;
      const queryMatches = !query || `${product.name} ${product.category}`.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
  }

  get filteredInventory() {
    return this.filteredProducts.map(product => ({
      sku: product.id,
      product_name: product.name,
      picture: product.image,
      quantity: product.stock,
      category: product.category,
      brand: 'N/A',
      price: product.price,
      quantity_alert: 10
    }));
  }

  get itemCount(): number { return this.cartItems.length; }
  get subtotal(): number { return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0); }

  get discountAmount(): number {
    const value = Number(this.discount) || 0;
    if (value <= 0) return 0;
    if (this.discountUnit === '%') return (this.subtotal * Math.min(value, 100)) / 100;
    return Math.min(value, this.subtotal);
  }

  get total(): number { return Math.max(0, this.subtotal - this.discountAmount); }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isNavOpen && window.innerWidth > 900) {
      this.isNavOpen = false;
      this.changeDetector.markForCheck();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.isNavOpen && !this.openPanel) return;
    this.isNavOpen = false;
    this.openPanel = null;
    this.changeDetector.markForCheck();
  }

  toggleNav(): void { this.isNavOpen = !this.isNavOpen; this.openPanel = null; }
  selectNav(label: string): void { if (label !== 'Pos') return; this.selectedNav = label; this.isNavOpen = false; this.currentView = 'pos'; }
  toggleAccountMenu(): void { this.openPanel = this.openPanel === 'account' ? null : 'account'; this.isNavOpen = false; }
  toggleFullScreen(): void { this.isRightPanelOpen = !this.isRightPanelOpen; this.openPanel = null; }
  closePanel() {
    this.isClosing = true; // สั่งให้เล่นอนิเมชั่น slideOut

    // รอ 300ms (0.3s) ให้อนิเมชั่นจบ แล้วค่อยลบ Element ออกจาก DOM
    setTimeout(() => {
      this.openPanel = null;
      this.isClosing = false;
    }, 300);
  }
  openHelp(){
    this.router.navigate(['helpp'],{
      state:{ username: this.username, email: this.email, role: this.role, profile: this.profile}
    })
  }
  openProfile() {
    this.router.navigate(['/profile'], {
      state: { username: this.username, email: this.email, Move_returns3: true, role: this.userRole, profile: this.profile }
    });

  }
  backToPos(): void { this.currentView = 'pos'; }
  startEditProfile(): void { this.avatarLinkInput = ''; this.currentView = 'profile-edit'; }
  cancelEditProfile(): void { this.currentView = 'profile'; }
  selectCategory(category: Category): void { this.selectedCategory = category.label; }

  scrollCategories(direction: 'left' | 'right'): void {
    const row = document.querySelector<HTMLElement>('.category-row');
    if (!row) return;
    const step = Math.max(180, Math.round(row.clientWidth * 0.6));
    row.scrollBy({ left: direction === 'right' ? step : -step, behavior: 'smooth' });
  }

  addToCart(product: Product): void {
    const item = this.cartItems.find((entry) => entry.id === product.id);
    if (item) item.quantity = Math.min(item.quantity + 1, product.stock);
    else this.cartItems = [...this.cartItems, { ...product, quantity: 1, batchNo: '' }];
  }

  changeQuantity(item: CartItem, change: number): void {
    const next = item.quantity + change;
    if (next <= 0) { this.removeFromCart(item); return; }
    item.quantity = Math.min(next, item.stock);
    this.changeDetector.markForCheck();
  }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter((entry) => entry.id !== item.id);
    this.changeDetector.markForCheck();
  }

  clearOrder(): void { this.cartItems = []; }

  resetOrder(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All Categories';
    this.selectedPayment = 'Choose';
    this.selectedInsurance = 'Choose';
    this.discountUnit = '%';
    this.discount = 0;
    this.cartItems = [];
  }

  startTransaction(): void { this.resetOrder(); this.orderCode = String(Date.now()).slice(-6); }

  completePayment(): void {
    if (!this.cartItems.length) return;
    this.cartItems = [];
  }

  formatStock(stock: number): string { return stock < 10 ? `0${stock}` : `${stock}`; }

  formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || amount === 0) return '$0.00';
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  openNotifications(): void {
    this.router.navigate(['/notification'],{
          state: { username: this.username, email: this.email, Move_returns3: true, role: this.userRole, profile: this.profile }
    });
  }
  showAccountMenu() {
    this.isClosing = false;
    this.openPanel = 'account';
  }
loadNotifications(): void {
    this.todoService.getNotifications().subscribe({
      next: (res: any) => {
        this.notification = Array.isArray(res) ? res : (res.data || []);
        this.changeDetector.markForCheck(); // สั่งให้ Angular อัปเดต UI
      },
      error: (err) => console.error('Error loading notifications:', err)
    });
  }
}