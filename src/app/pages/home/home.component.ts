import { Component, ElementRef, AfterViewInit, OnDestroy, OnInit, ViewEncapsulation, viewChild } from '@angular/core';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None, // Ensures global CSS for coffee powder
  imports: [CommonModule],
  animations: [
    trigger('bounceInOnScroll', [
      transition(':enter, * => inView', [
        animate('1s cubic-bezier(.68,-0.55,.27,1.55)', keyframes([
          style({ opacity: 0, transform: 'translateY(100px) scale(0.8)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(-20px) scale(1.05)', offset: 0.7 }),
          style({ opacity: 1, transform: 'translateY(0) scale(1)', offset: 1.0 }),
        ]))
      ])
    ])
  ]
})
export class HomeComponent implements AfterViewInit, OnInit {
  readonly bgVideo = viewChild.required<ElementRef<HTMLVideoElement>>('bgVideo');

  storyInView = false;
  serviceCardsInView: boolean[] = Array(6).fill(false);
  servicesInView = false;

  constructor(public el: ElementRef, private router: Router) {}

  gotoAbout() {
    this.router.navigate(['/about']);
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 
  ngAfterViewInit() {
    // Force play the background video on reload with retry logic
    const video: HTMLVideoElement | null = this.bgVideo()?.nativeElement;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setTimeout(() => video.play(), 500);
        });
      }
    }

    // Story section animation
    const storySection = this.el.nativeElement.querySelector('.story-section');
    if (storySection) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.storyInView = true;
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(storySection);
    }

    // Service cards animation + 3D effect
    const cards = this.el.nativeElement.querySelectorAll('.service-card');
    cards.forEach((card: HTMLElement, idx: number) => {
      // Bounce-in animation on scroll
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.serviceCardsInView[idx] = true;
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(card);

      // 3D tilt effect on mouse move
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(600px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04,1.04,1.04)`;
        card.style.transition = 'transform 0.1s';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.transition = 'transform 0.4s';
      });
    });

    // Services section entrance animation (from left to right)
    const servicesSection = this.el.nativeElement.querySelector('.services-section');
    if (servicesSection) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.servicesInView = true;
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(servicesSection);
    }
  }
}