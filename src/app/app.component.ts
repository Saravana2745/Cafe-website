import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,RouterModule
  ]
})
export class AppComponent {
  navbarScrolled = false;
  navOpen = false;
  currentYear = new Date().getFullYear();
  isCartPage = false;

  constructor(public cartService: CartService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isCartPage = this.router?.url === '/cart';
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.navbarScrolled = window.scrollY > 30;
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }
}