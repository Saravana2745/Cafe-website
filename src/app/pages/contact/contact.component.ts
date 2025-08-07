import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  encapsulation: ViewEncapsulation.None, // <-- Add this line!
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class ContactComponent implements OnInit{
  constructor(private http: HttpClient) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.http.post('http://localhost:3000/api/contact', form.value)
        .subscribe({
          next: () => {
            alert('Thank you for contacting Café Aroma!');
            form.reset();
          },
          error: () => alert('There was an error. Please try again later.')
        });
    }
  }
}