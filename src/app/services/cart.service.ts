import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'cafeCart';
  private items: any[] = [];

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    this.items = saved ? JSON.parse(saved) : [];
  }

  private saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  addToCart(item: any, quantity: number) {
    const existing = this.items.find(i => i.name === item.name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...item, quantity });
    }
    this.saveCart();
  }

  getItems() {
    return this.items;
  }

  getCount() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  increaseQuantity(item: any) {
    const found = this.items.find(i => i.name === item.name);
    if (found) {
      found.quantity++;
      this.saveCart();
    }
  }

  decreaseQuantity(item: any) {
    const found = this.items.find(i => i.name === item.name);
    if (found && found.quantity > 1) {
      found.quantity--;
    } else if (found && found.quantity === 1) {
      this.items = this.items.filter(i => i.name !== item.name);
    }
    this.saveCart();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }
}