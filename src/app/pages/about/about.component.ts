import { Component, HostListener, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [CommonModule],
})
export class AboutComponent implements AfterViewInit, OnInit {
  serviceCardsInView: boolean[] = Array(6).fill(false);
  servicesInView = false;
  aboutDescInView = false;
  galleryInView = false;
  customerFeedbackInView = false;
  logoAnimated = false;

  galleryImages = [
    'p8.avif', 'p2.jpg', 'p3.jpg',
    'p4.jpg', 'p5.jpg', 'p6.jpg',
    'p7.jpg', 'p1.avif', 'p9.jpg'
  ];
  feedbacks = [
    {
      name: 'Priyansh Arya',
      text: 'The aroma and taste of the coffee here is unmatched. The ambience is perfect for a relaxing evening!',
      avatar: 'c1.webp'
    },
    {
      name: 'Rahul Verma',
      text: 'Loved the sandwiches and the friendly staff. Will definitely visit again with friends!',
      avatar: 'c2.jpg'
    },
    {
      name: 'Sneha Patel',
      text: 'A wonderful place for business meetings. The pasta is a must-try!',
      avatar: 'c3.jpg'
    }
  ];

  slideshowImages = [
    's1.webp',
    's2.jpg',
    's3.webp'
  ];
  currentSlide = 0;
  prevSlideIndex = 0;
  nextSlideIndex = 0;
  slideInterval: any;

  constructor(private el: ElementRef, private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const hero = this.el.nativeElement.querySelector('.about-hero');
    if (hero) {
      const scrolled = window.scrollY;
      hero.style.backgroundPosition = `bottom ${scrolled * 0.5}px`;
    }
    const feedback = this.el.nativeElement.querySelector('.customer-feedback-section');
    if (feedback && !this.customerFeedbackInView) {
      const rect = feedback.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        this.customerFeedbackInView = true;
      }
    }
    const logo = this.el.nativeElement.querySelector('.about-logo');
    if (logo && !this.logoAnimated) {
      const rect = logo.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        this.logoAnimated = true;
      }
    }

    // Gallery animation on scroll
    const gallery = this.el.nativeElement.querySelector('.cafe-gallery');
    if (gallery && !this.galleryInView) {
      const rect = gallery.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        this.galleryInView = true;
      }
    }

    // About description animation on scroll
    const desc = this.el.nativeElement.querySelector('.about-description');
    if (desc && !this.aboutDescInView) {
      const rect = desc.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        this.aboutDescInView = true;
      }
    }
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
   this.updateSlideIndexes();
   setTimeout(() => this.logoAnimated = true, 300);
  }

ngAfterViewInit() {
  const items = this.el.nativeElement.querySelectorAll('.gallery-item');
  items.forEach((item: HTMLElement) => {
    item.addEventListener('touchstart', () => item.classList.add('touch-active'), { passive: true });
    item.addEventListener('touchend', () => item.classList.remove('touch-active'));
    item.addEventListener('touchcancel', () => item.classList.remove('touch-active'));
  });

  // Add feedback card touch event listeners
  const cards = this.el.nativeElement.querySelectorAll('.feedback-card');
  cards.forEach((card: HTMLElement) => {
    card.addEventListener('touchstart', () => card.classList.add('tilted'), { passive: true });
    card.addEventListener('touchend', () => card.classList.remove('tilted'));
    card.addEventListener('touchcancel', () => card.classList.remove('tilted'));
  });

  this.onWindowScroll();
  this.startSlideshow();
}

  startSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  updateSlideIndexes() {
    if (this.slideshowImages?.length) {
      this.prevSlideIndex = (this.currentSlide - 1 + this.slideshowImages.length) % this.slideshowImages.length;
      this.nextSlideIndex = (this.currentSlide + 1) % this.slideshowImages.length;
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slideshowImages.length;
    this.updateSlideIndexes();
    this.startSlideshow();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slideshowImages.length) % this.slideshowImages.length;
    this.updateSlideIndexes();
    this.startSlideshow();
  }

  goToOrder() {
    this.router.navigate(['/order']);
  }
}