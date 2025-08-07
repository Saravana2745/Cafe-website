import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Injectable } from '@angular/core';
import { trigger,transition,style,animate } from '@angular/animations';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('flyDown', [
      transition(':leave', [
        animate('500ms cubic-bezier(.23,1.02,.47,.98)', style({ opacity: 0, transform: 'translateY(80px)' }))
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-80px)' }),
        animate('500ms cubic-bezier(.23,1.02,.47,.98)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('flyUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(80px)' }),
        animate('500ms cubic-bezier(.23,1.02,.47,.98)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms cubic-bezier(.23,1.02,.47,.98)', style({ opacity: 0, transform: 'translateY(-80px)' }))
      ])
    ])
  ]
})
export class OrderComponent implements OnInit, AfterViewInit,OrderComponent {
cat: any;
  selectedCategory: string | null = null;

  categories = [
    { name: 'Aroma Signature Drinks', icon: '☕' },
    { name: 'Breakfast', icon: '🍳' },
    { name: 'Beverages', icon: '🥤' },
    { name: 'Healthy Menu', icon: '🥗' },
    { name: 'Desserts', icon: '🍰' }
  ];
  

  foods = [
    { name: 'Classic Cappuccino', category: 'Aroma Signature Drinks', price: 120, image: 'p1.avif' },
    { name: 'Rose chocolate', category: 'Aroma Signature Drinks', price: 150, image: 'p4.jpg' },
    { name: 'Aroma Tea', category: 'Aroma Signature Drinks', price: 70, image: 't.webp' },
    { name: 'Masala Chai', category: 'Aroma Signature Drinks', price: 100, image: 'm.jpg' },
    { name: 'Choclate Milkshake', category: 'Aroma Signature Drinks', price: 125, image: 'ch.jpg' },
    { name: 'Boost Tea', category: 'Aroma Signature Drinks', price: 80, image: 'bt.avif' },
    { name: 'Veg Sandwich', category: 'Breakfast', price: 120, image: 'sw.webp' },
    { name: 'Pancakes', category: 'Breakfast', price: 100, image: 'pn.jpg' },
    { name: 'Dosa', category: 'Breakfast', price: 70, image: 'p8.avif' },
    { name: 'Idly', category: 'Breakfast', price: 50, image: 'p9.jpg' },
    { name: 'bread omelette', category: 'Breakfast', price: 80, image: 'bo.jpg' },
    { name: 'Sambar Vada', category: 'Breakfast', price: 60, image: 'sm.jpg' },
    { name: 'Cold Coffee', category: 'Beverages', price: 100, image: 'cf.webp' },
    { name: 'Fresh Lime Soda', category: 'Beverages', price: 70, image: 'l.avif' },
    { name: 'Mango Milkshake', category: 'Beverages', price: 60, image: 'mg.jpg' },
    { name: 'Lassi', category: 'Beverages', price: 50, image: 'ls.jpg' },
    { name: 'Strawberry Milkshake', category: 'Beverages', price: 100, image: 'str.jpg' },
    { name: 'mocktails', category: 'Beverages', price: 150, image: 'mt.jpg' },
    { name: 'Quinoa Salad', category: 'Healthy Menu', price: 130, image: 'q.avif' },
    { name: 'Fruit Bowl', category: 'Healthy Menu', price: 100, image: 'fs.jpg' },
    { name: 'Citrus and Avocado Salad', category: 'Healthy Menu', price: 120, image: 'av.jpg' },
    { name: 'Caprese Fattoush Salad', category: 'Healthy Menu', price: 150, image: 'lf.jpg' },
    { name: 'Granny Smith Protien Shake', category: 'Healthy Menu', price: 110, image: 'ps.jpg' },
    { name: 'Monkey Business', category: 'Healthy Menu', price: 125, image: 'mb.webp' },
    { name: 'Chocolate Cake', category: 'Desserts', price: 150, image: 'ck.jpg' },
    { name: 'Cheesecake', category: 'Desserts', price: 170, image: 'cs.jpg' },
    { name: 'Tiramisu', category: 'Desserts', price: 180, image: 'tr.jpg' },
    { name: 'Fruit Tart', category: 'Desserts', price: 160, image: 'ft.jpeg' },
    { name: 'Brownie Sundae', category: 'Desserts', price: 140, image: 'p6.jpg' },
    { name: 'Apple Pie', category: 'Desserts', price: 130, image: 'ap.jpg' }
  ];

  filteredFoods: { image: any; name: string; category: string; price: number; }[] = [];

  healthVisible = false;
  signatureVisible = false;

  orderingFood: any = null;
  orderQuantity: number = 1;

  @ViewChild('healthSection') healthSection!: ElementRef;
  @ViewChild('signatureSection') signatureSection!: ElementRef;
  trolleyAnimating: boolean | undefined;
  slideInterval: any;
   cartItems: any[] = [];
   
  constructor(private router: Router, private cartService: CartService) {}
  // Removed duplicate ngOnDestroy that threw an error

  ngOnInit() {
    this.updateFilteredFoods();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 getCategoryClass(name: string): string {
  // Converts category name to a valid CSS class (e.g., "Aroma Signature Drinks" -> "aroma-signature-drinks")
  return name.replace(/\s+/g, '-').toLowerCase();
}
  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === this.healthSection?.nativeElement) {
          this.healthVisible = entry.isIntersecting;
        }
        if (entry.target === this.signatureSection?.nativeElement) {
          this.signatureVisible = entry.isIntersecting;
        }
      });
    }, { threshold: 0.2 });

    if (this.healthSection) {
      observer.observe(this.healthSection.nativeElement);
    }
    if (this.signatureSection) {
      observer.observe(this.signatureSection.nativeElement);
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.updateFilteredFoods();
  }

  updateFilteredFoods() {
    if (this.selectedCategory) {
      this.filteredFoods = this.foods.filter(f => f.category === this.selectedCategory);
    } else {
      this.filteredFoods = [];
    }
  }
  orderFood(food: any) {
    this.orderingFood = food;
    this.orderQuantity = 1;
  }
  goToCart() {
  this.orderingFood = null;
  this.router.navigate(['/cart']);
}
  confirmOrder() {
   this.trolleyAnimating = true;

  setTimeout(() => {
    this.cartService.addToCart(this.orderingFood, this.orderQuantity);
    this.orderingFood = null;
    this.trolleyAnimating = false;
  }, 700);
  }

  cancelOrder() {
    this.orderingFood = null;
  }
}