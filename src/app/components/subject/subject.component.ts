import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Subject, Category } from '../../models/quiz.model';
import { ReplacePipe } from '../../services/replace.pipe';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, RouterModule, ReplacePipe],
  template: `
    <div class="container" *ngIf="subject">
      <nav>
        <a [routerLink]="['/category', catId]">← Volver a Materias</a>
      </nav>
      <h1>{{ subject.name }}</h1>
      <p class="subtitle">Elige un cuestionario para comenzar.</p>
      
      <div class="grid">
        <div *ngFor="let quizId of subject.quizzes" 
             [routerLink]="['/quiz', catId, subject.id, quizId]" 
             class="card">
          <h2>{{ quizId | titlecase | replace:'_':' ' }}</h2>
          <button class="btn">Empezar</button>
        </div>
        <div *ngIf="subject.quizzes.length === 0" class="no-data">
          <p>No hay cuestionarios disponibles para esta materia aún.</p>
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
      transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-5px); }
    h2 { margin: 0 0 20px 0; color: #17a2b8; text-transform: capitalize; }
    .btn { 
      background: #007bff; color: white; border: none; padding: 10px 20px; 
      border-radius: 6px; cursor: pointer; font-weight: bold;
    }
    .no-data { grid-column: 1 / -1; text-align: center; padding: 40px; color: #999; }
  `]
})
export class SubjectComponent implements OnInit {
  catId: string = '';
  subject?: Subject;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.catId = params['catId'];
      const subId = params['id'];
      this.quizService.getCategory(this.catId).subscribe((cat: Category | undefined) => {
        this.subject = cat?.subjects.find(s => s.id === subId);
      });
    });
  }
}
