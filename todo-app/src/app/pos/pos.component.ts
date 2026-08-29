import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  imageWidth: number;
  imageHeight: number;
}

interface CartItem extends Product {
  quantity: number;
}

type HeaderPanel = 'orders' | 'cash' | 'printer' | 'progress' | 'chart' | 'settings' | null;

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosComponent implements OnInit, OnDestroy {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private clockTimer?: ReturnType<typeof setInterval>;

  readonly navItems = [
    { label: 'Pos', icon: 'assets/figma-pos/icon.svg' },
    { label: 'Inventory', icon: 'assets/figma-pos/icon-wrapper.svg' },
    { label: 'Sales Orders', icon: 'assets/figma-pos/icon-wrapper1.svg' },
    { label: 'Stock History', icon: 'assets/figma-pos/icon-wrapper2.svg' },
    { label: 'Employee', icon: 'assets/figma-pos/icon-wrapper3.svg' }
  ];

  readonly categories: Category[] = [
    { label: 'All Categories', count: 54, icon: 'assets/figma-pos/black.svg' },
    { label: 'Headphones', count: 12, icon: 'assets/figma-pos/image385.png' },
    { label: 'Notebook', count: 15, icon: 'assets/figma-pos/product-image.png' },
    { label: 'Charger', count: 14, icon: 'assets/figma-pos/image444.png' },
    { label: 'Mobiles', count: 8, icon: 'assets/figma-pos/image383.png' },
    { label: 'Watches', count: 16, icon: 'assets/figma-pos/image445.png' },
    { label: 'Tablet', count: 18, icon: 'assets/figma-pos/image446.png' },
    { label: 'Mouse', count: 12, icon: 'assets/figma-pos/image.png' }
  ];

  readonly products: Product[] = [
    { id: 'P-001', category: 'Mobiles', name: 'IPhone 14 64GB', stock: 30, price: 15800, image: 'assets/figma-pos/product-image1.png', imageWidth: 50, imageHeight: 96 },
    { id: 'P-002', category: 'Computer', name: 'MacBook Pro', stock: 140, price: 1000, image: 'assets/figma-pos/image1.png', imageWidth: 111, imageHeight: 59 },
    { id: 'P-003', category: 'Watches', name: 'Rolex Tribute V3', stock: 220, price: 6800, image: 'assets/figma-pos/image448.png', imageWidth: 78, imageHeight: 81 },
    { id: 'P-004', category: 'Charger', name: 'Red Nike Angelo', stock: 220, price: 78, image: 'assets/figma-pos/image450.png', imageWidth: 78, imageHeight: 80 },
    { id: 'P-005', category: 'Headphones', name: 'Airpod 2', stock: 47, price: 5478, image: 'assets/figma-pos/image385.png', imageWidth: 74, imageHeight: 90 },
    { id: 'P-006', category: 'Charger', name: 'Blue White OGR', stock: 30, price: 987, image: 'assets/figma-pos/image385.png', imageWidth: 74, imageHeight: 90 },
    { id: 'P-007', category: 'Computer', name: 'Idea Slim 5 Gen 7', stock: 74, price: 1454, image: 'assets/figma-pos/product-image2.png', imageWidth: 94, imageHeight: 77 },
    { id: 'P-008', category: 'Headphones', name: 'SWAGME', stock: 14, price: 6587, image: 'assets/figma-pos/image448.png', imageWidth: 78, imageHeight: 81 },
    { id: 'P-009', category: 'Watches', name: 'Red Nike Angelo', stock: 220, price: 1457, image: 'assets/figma-pos/image450.png', imageWidth: 74, imageHeight: 90 },
    { id: 'P-010', category: 'Computer', name: 'Tablet 1.02 inch', stock: 47, price: 4744, image: 'assets/figma-pos/image383.png', imageWidth: 78, imageHeight: 81 },
    { id: 'P-011', category: 'Watches', name: 'Fossil Pair Of 3 in 1', stock: 40, price: 789, image: 'assets/figma-pos/image445.png', imageWidth: 74, imageHeight: 90 },
    { id: 'P-012', category: 'Computer', name: 'Idea Slim 5 Gen 7', stock: 74, price: 1454, image: 'assets/figma-pos/image453.png', imageWidth: 111, imageHeight: 79 },
    { id: 'P-013', category: 'Shoes', name: 'Green Nike Fe', stock: 78, price: 1454, image: 'assets/figma-pos/image454.png', imageWidth: 93, imageHeight: 78 },
    { id: 'P-014', category: 'Laptop', name: 'Yoga Book 9i', stock: 65, price: 4784, image: 'assets/figma-pos/image455.png', imageWidth: 111, imageHeight: 79 },
    { id: 'P-015', category: 'Watches', name: 'Rolex Tribute V3', stock: 220, price: 6800, image: 'assets/figma-pos/image448.png', imageWidth: 78, imageHeight: 81 }
  ];

  searchTerm = '';
  selectedCategory = 'All Categories';
  selectedPayment = 'Choose';
  selectedInsurance = '0';
  discount = 0;
  customerName = 'Walk In Customer';
  cartItems: CartItem[] = [];
  selectedNav = 'Pos';
  isSidebarOpen = false;
  isRightPanelOpen = true;
  openPanel: HeaderPanel = null;
  clock = '09:25:32';
  notice = '';

  get filteredProducts(): Product[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.products.filter((product) => {
      const categoryMatches = this.selectedCategory === 'All Categories' || product.category === this.selectedCategory;
      const queryMatches = !query || `${product.name} ${product.category}`.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
  }

  get itemCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get total(): number {
    return Math.max(0, this.subtotal - this.discount);
  }

  ngOnInit(): void {
    this.clockTimer = setInterval(() => {
      this.clock = new Date().toLocaleTimeString('en-GB', { hour12: false });
      this.changeDetector.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.openPanel = null;
  }

  selectNav(label: string): void {
    this.selectedNav = label;
    this.isSidebarOpen = false;
    if (label !== 'Pos') this.showNotice(`${label} is ready for page integration`);
  }

  selectSupport(label: 'Help' | 'Settings', message: string): void {
    this.selectedNav = label;
    this.isSidebarOpen = false;
    this.showNotice(message);
  }

  togglePanel(panel: Exclude<HeaderPanel, null>): void {
    this.openPanel = this.openPanel === panel ? null : panel;
  }

  openRightSide(): void {
    this.isRightPanelOpen = true;
    this.openPanel = null;
    this.showNotice('Order panel opened');
  }

  openCatalogScreen(): void {
    this.isRightPanelOpen = false;
    this.openPanel = null;
    this.showNotice('Full screen catalog opened');
  }

  closePanel(): void {
    this.openPanel = null;
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category.label;
  }

  scrollCategories(direction: 'left' | 'right'): void {
    const row = document.querySelector<HTMLElement>('.category-row');
    row?.scrollBy({ left: direction === 'right' ? 180 : -180, behavior: 'smooth' });
  }

  addToCart(product: Product): void {
    const item = this.cartItems.find((entry) => entry.id === product.id);
    if (item) item.quantity = Math.min(item.quantity + 1, product.stock);
    else this.cartItems = [...this.cartItems, { ...product, quantity: 1 }];
    this.showNotice(`${product.name} added to order`);
  }

  changeQuantity(item: CartItem, change: number): void {
    const next = item.quantity + change;
    if (next <= 0) {
      this.removeFromCart(item);
      return;
    }
    item.quantity = Math.min(next, item.stock);
    this.changeDetector.markForCheck();
  }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter((entry) => entry.id !== item.id);
    this.changeDetector.markForCheck();
  }

  clearOrder(): void {
    this.cartItems = [];
    this.showNotice('Order cleared');
  }

  resetOrder(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All Categories';
    this.selectedPayment = 'Choose';
    this.selectedInsurance = '0';
    this.discount = 0;
    this.customerName = 'Walk In Customer';
    this.cartItems = [];
    this.showNotice('POS reset');
  }

  startTransaction(): void {
    this.resetOrder();
    this.showNotice('New transaction started');
  }

  addCustomer(): void {
    this.customerName = 'New Customer';
    this.showNotice('Customer form is ready for integration');
  }

  completePayment(): void {
    if (!this.cartItems.length) {
      this.showNotice('No products selected');
      return;
    }
    this.showNotice(`Payment completed: ${this.formatCurrency(this.total)}`);
    this.cartItems = [];
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return '$0.00';
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  showNotice(message: string): void {
    this.notice = message;
    this.changeDetector.markForCheck();
    window.setTimeout(() => {
      this.notice = '';
      this.changeDetector.markForCheck();
    }, 2200);
  }
}