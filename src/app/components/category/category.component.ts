import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Category } from '../../models/quiz.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" *ngIf="category">
      <nav>
        <a routerLink="/home">← Volver a Categorías</a>
      </nav>
      <h1>{{ category.name }}</h1>
      <p class="subtitle">Selecciona una materia para ver los cuestionarios disponibles.</p>
      
      <div class="grid">
        <div *ngFor="let subject of category.subjects" 
             [routerLink]="['/subject', category.id, subject.id]" 
             class="card">
          <h2>{{ subject.name }}</h2>
          <p>{{ subject.quizzes.length }} cuestionarios disponibles</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    nav { margin-bottom: 20px; }
    nav a { color: #007bff; text-decoration: none; font-weight: 500; }
    h1 { text-align: center; color: #333; margin-bottom: 10px; }
    .subtitle { text-align: center; color: #666; margin-bottom: 40px; }
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
    h2 { margin: 0; color: #28a745; }
    p { color: #666; margin-top: 10px; }
  `]
})
export class CategoryComponent implements OnInit {
  category?: Category;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.quizService.getCategory(params['id']).subscribe((cat: Category | undefined) => this.category = cat);
    });
  }
}
