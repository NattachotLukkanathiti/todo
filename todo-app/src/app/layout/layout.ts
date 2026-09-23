import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { BrandLogoComponent } from '../shared/brand-logo';
import { DEFAULT_AVATAR } from '../shared/default-avatar';
import { IconComponent } from '../shared/icon';

export interface ProfileData {
  avatar: string;
  name: string;
  role: string;
  roleShort: string;
  dob: string;
  nationalId: string;
  address: string;
  emergencyContact: string;
}

export interface NotificationItem {
  icon: 'stock' | 'alert' | 'pending';
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
}

export interface NotificationSummary {
  pendingApprovals: number;
  inventoryAlerts: number;
  stockUpdates: number;
}

interface NavItem {
  label: string;
  /** `null` until the page exists. */
  path: string | null;
}

/**
 * Header, navigation and account menu around every page (`<router-outlet>`).
 * It stays alive while the pages change, so it also holds the data more than one
 * page shows; pages read it with `inject(MainLayoutComponent)`.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandLogoComponent, IconComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private clockTimer?: ReturnType<typeof setInterval>;

  // Backend integration: set these from API responses.
  /** Header avatar, account menu, Profile and Edit Profile pages. */
  readonly profile = signal<ProfileData>({ avatar: '', name: '', role: '', roleShort: '', dob: '', nationalId: '', address: '', emergencyContact: '' });
  /** Bell badge and Notification page. */
  readonly notifications = signal<NotificationItem[]>([]);
  readonly notificationSummary = signal<NotificationSummary>({ pendingApprovals: 0, inventoryAlerts: 0, stockUpdates: 0 });
  readonly hasUnreadNotifications = computed(() => this.notifications().some((item) => item.unread));

  /** POS page order panel; hidden by the header's full-screen button. */
  readonly isRightPanelOpen = signal(true);

  readonly navItems: NavItem[] = [
    { label: 'Pos', path: '/pos' },
    { label: 'Sales Orders', path: '/sales-orders' },
    { label: 'Employee', path: null }
  ];

  readonly defaultAvatar = DEFAULT_AVATAR;

  readonly clock = signal(this.formatClock());
  readonly isNavOpen = signal(false);
  readonly isAccountOpen = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  /** The full-screen toggle belongs to the POS page; it is shown (disabled) on Sales Orders too. */
  readonly showFullScreenToggle = computed(() => this.isOn('/pos') || this.isOn('/sales-orders'));
  readonly canToggleFullScreen = computed(() => this.isOn('/pos'));

  ngOnInit(): void {
    this.clockTimer = setInterval(() => this.clock.set(this.formatClock()), 1000);
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  private formatClock(): string {
    return new Date().toLocaleTimeString('en-GB', { hour12: false });
  }

  /** Keeps the mobile menu and its backdrop from surviving into the desktop layout. */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isNavOpen() && window.innerWidth > 900) this.isNavOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenus();
  }

  toggleNav(): void {
    this.isNavOpen.update((open) => !open);
    this.isAccountOpen.set(false);
  }

  toggleAccountMenu(): void {
    this.isAccountOpen.update((open) => !open);
    this.isNavOpen.set(false);
  }

  closeMenus(): void {
    this.isNavOpen.set(false);
    this.isAccountOpen.set(false);
  }

  toggleFullScreen(): void {
    this.isRightPanelOpen.update((open) => !open);
    this.isAccountOpen.set(false);
  }

  private isOn(path: string): boolean {
    const url = this.url().split(/[?#]/)[0];
    return url === path || url.startsWith(`${path}/`);
  }
}
