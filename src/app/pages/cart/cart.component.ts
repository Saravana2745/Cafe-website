import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class CartComponent implements OnInit {
sanitizePhone() {
throw new Error('Method not implemented.');
}
  taxRate = 0.05; // 5% tax

  // For checkout form
  showCheckoutForm = false;
  userName = '';
  address = '';
  phone = '';
  confirmBtnHovered = false;

  constructor(public cartService: CartService, private http: HttpClient) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get subtotal(): number {
    return this.cartService.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get tax(): number {
    return this.subtotal * this.taxRate;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  increaseQuantity(item: any) {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: any) {
    this.cartService.decreaseQuantity(item);
  }

  removeAll() {
    this.cartService.clearCart();
  }

  // Show the checkout form
  checkout() {
    this.showCheckoutForm = true;
  }

  // Confirm order after user enters details
  confirmCheckout() {
    if (!this.userName || !this.address || !/^\d{10}$/.test(this.phone)) {
      alert('Please fill all details and enter a valid 10-digit phone number.');
      return;
    }

    // Prepare order data
    const order: Order = {
      userName: this.userName,
      address: this.address,
      phone: this.phone,
      items: this.cartService.getItems(),
      total: this.total
    };

    // Send order to backend (MongoDB)
    this.http.post<Order>('http://localhost:3000/api/order', order)
      .subscribe({
        next: () => {
          alert(
            `Thank you, ${this.userName}!\nYour order will be delivered to:\n${this.address}\nPhone: ${this.phone}\nTotal: ₹${this.total.toFixed(2)}`
          );
          this.cartService.clearCart();
          this.showCheckoutForm = false;
          this.userName = '';
          this.address = '';
          this.phone = '';
        },
        error: () => alert('Order failed. Please try again.')
      });
  }

  cancelCheckout() {
    this.showCheckoutForm = false;
  }
}

interface Order {
  userName: string;
  address: string;
  phone: string;
  items?: any[];
  total?: number;
}