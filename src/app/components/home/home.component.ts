import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Category } from '../../models/quiz.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1>Categorías</h1>
      <div class="grid">
        <div *ngFor="let category of categories" 
             [routerLink]="['/category', category.id]" 
             class="card">
          <h2>{{ category.name }}</h2>
          <p>Explorar materias de {{ category.name }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    h1 { text-align: center; color: #333; margin-bottom: 40px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .card { 
      background: white; 
      border-radius: 12px; 
      padding: 30px; 
      text-align: center; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
      cursor: pointer; 
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-5px); box-shadow: 0 8px 12px rgba(0,0,0,0.15); }
    h2 { margin: 0; color: #007bff; }
    p { color: #666; margin-top: 10px; }
  `]
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    this.quizService.getCategories().subscribe((cats: Category[]) => this.categories = cats);
  }
}
