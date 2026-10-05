import { ChangeDetectionStrategy, Component, signal } from '@angular/core';



/** One product line displayed in a receipt. Amounts are formatted by the API layer. */
export interface ReceiptLine {
  skuOrName: string;
  quantity: string | number;
  unitPrice: string | number;
  amount: string | number;
}


export interface ReceiptData {
  companyName: string;
  companyAddress: string[];
  taxId: string;
  receiptNumber: string;
  orderCode: string;
  cashier: string;
  items: ReceiptLine[];
  subtotal: string | number;
  productInsurancePremium: string | number;
  discount: string | number;
  grandTotal: string | number;
}

const RECEIPT_PLACEHOLDER: ReceiptData = {
  companyName: 'Tam rai dee Company Limited (Head Office)',
  companyAddress: ['123/45 Gayson Tower, 15th Floor,', 'Ratchadamri Road,', 'Lumpini, Pathum Wan, Bangkok 10330'],
  taxId: '',
  receiptNumber: '',
  orderCode: '',
  cashier: '',
  items: [
    { skuOrName: '', quantity: '', unitPrice: '', amount: '' },
    { skuOrName: '', quantity: '', unitPrice: '', amount: '' },
    { skuOrName: '', quantity: '', unitPrice: '', amount: '' }
  ],
  subtotal: '',
  productInsurancePremium: '',
  discount: '',
  grandTotal: ''
};


@Component({
  selector: 'app-receipt-page',
  standalone: true,

  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiptComponent {
  /** Captured once when this receipt page is created; it deliberately does not tick afterwards. */
  readonly openedAt = new Date();

  /** Backend integration: `receipt.set(apiResponse)` after fetching an order. */
  readonly receipt = signal<ReceiptData>(RECEIPT_PLACEHOLDER);

  /** Example: `29 / 09 / 2569 13:38` — Thai Buddhist Era and a 24-hour clock. */
  formatOpenedAt(value: Date): string {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear() + 543;
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    return `${day} / ${month} / ${year} ${hours}:${minutes}`;
  }
}
