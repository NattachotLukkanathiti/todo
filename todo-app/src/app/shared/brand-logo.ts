import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * TRD.CO.TH wordmark. The Figma logo is set in Nico Moji, which no web-font
 * service hosts, so the letterforms are redrawn here as strokes.
 * Width drives the size (10:1); colour comes from `currentColor`.
 */
@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `
    <svg viewBox="2.5 2.5 141 14.1" fill="none" stroke="currentColor" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="TRD.CO.TH">
      <path d="M4.25 4.3h13.1M10.7 4.3v10.45" />
      <path d="M23.25 14.75V4.3H34.3q2.1 0 2.1 2.1v1q0 2.1-2.1 2.1h-6.6v2.1q0 3.15 3.1 3.15h5.55" />
      <path d="M42.65 4.3h8.95q2.1 0 2.1 2.1v6.25q0 2.1-2.1 2.1h-9.4v-5.5" />
      <circle cx="60.5" cy="14.3" r="2.3" fill="currentColor" stroke="none" />
      <path d="M78.75 4.3H69.8q-2.1 0-2.1 2.1v6.25q0 2.1 2.1 2.1h8.95" />
      <path d="M86.7 4.3h8.8q2.1 0 2.1 2.1v6.25q0 2.1-2.1 2.1h-8.8q-2.1 0-2.1-2.1V6.4q0-2.1 2.1-2.1Z" />
      <circle cx="105.1" cy="14.3" r="2.3" fill="currentColor" stroke="none" />
      <path d="M111.65 4.3h13.7M118.5 4.3v10.45" />
      <path d="M130.7 4.3v10.45M141.7 4.3v10.45M130.7 9.3h11" />
    </svg>
  `,
  styles: [':host { display: inline-block; width: 141px; line-height: 0; color: var(--logo); } svg { display: block; width: 100%; height: auto; overflow: visible; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandLogoComponent {}
