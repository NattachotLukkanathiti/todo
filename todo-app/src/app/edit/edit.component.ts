import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MainLayoutComponent, ProfileData } from '../layout/layout';
import { DEFAULT_AVATAR } from '../shared/default-avatar';
import { IconComponent } from '../shared/icon';

/** หน้าแก้ไขโปรไฟล์ (Edit Profile) — `/profile/edit` */
@Component({
  selector: 'app-profile-edit-page',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './edit.component.html',
  styleUrls: ['../profile/profile.component.css', './edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent {
  private readonly router = inject(Router);
  // Shared with the header and Profile page when inside MainLayoutComponent; otherwise this page's own.
  // Backend integration: load the profile into it, and send it to the API in save().
  private readonly profile = inject(MainLayoutComponent, { optional: true })?.profile ?? signal<ProfileData>({ avatar: '', name: '', role: '', roleShort: '', dob: '', nationalId: '', address: '', emergencyContact: '' });

  readonly defaultAvatar = DEFAULT_AVATAR;

  /** Working copy; the stored profile only changes on Save. */
  editProfile: ProfileData = { ...this.profile() };
  avatarLinkInput = '';

  save(): void {
    const avatar = this.avatarLinkInput.trim();
    this.profile.set({ ...this.editProfile, ...(avatar ? { avatar } : {}) });
    this.router.navigate(['/profile']);
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
