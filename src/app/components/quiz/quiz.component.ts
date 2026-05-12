import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Quiz, Question } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" *ngIf="quiz; else loading">
      <nav *ngIf="!quizFinished">
        <a [routerLink]="['/subject', catId, subId]">← Salir del Cuestionario</a>
      </nav>

      <div *ngIf="!quizFinished">
        <div class="header">
          <h1>{{ quiz.title }}</h1>
          <div class="progress-container">
            <div class="progress-bar" [style.width.%]="progress"></div>
          </div>
          <p class="counter">Pregunta {{ currentQuestionIndex + 1 }} de {{ quiz.questions.length }}</p>
        </div>

        <div class="question-card" *ngIf="currentQuestion">
          <p class="question-text">{{ currentQuestion.question }}</p>
          
          <div class="options">
            <button 
              *ngFor="let option of currentQuestion.options" 
              (click)="selectOption(option)"
              [disabled]="answered"
              [class.selected]="selectedOption === option"
              [class.correct]="answered && option === currentQuestion.answer"
              [class.incorrect]="answered && selectedOption === option && option !== currentQuestion.answer"
              class="option-btn">
              {{ option }}
            </button>
          </div>

          <div class="feedback" *ngIf="answered">
            <p *ngIf="isCorrect" class="correct-text">¡Correcto!</p>
            <p *ngIf="!isCorrect" class="incorrect-text">Incorrecto. La respuesta correcta era: {{ currentQuestion.answer }}</p>
            <button class="next-btn" (click)="nextQuestion()">
              {{ isLastQuestion ? 'Finalizar' : 'Siguiente Pregunta' }}
            </button>
          </div>
        </div>
      </div>

      <div class="results-card" *ngIf="quizFinished">
        <h1>¡Cuestionario Finalizado!</h1>
        <p class="score-label">Tu puntuación:</p>
        <div class="score-circle">
          <span class="score-value">{{ score }}</span>
          <span class="score-total">/ {{ quiz.questions.length }}</span>
        </div>
        <div class="actions">
          <button class="btn-primary" (click)="restart()">Reintentar</button>
          <button class="btn-secondary" [routerLink]="['/subject', catId, subId]">Volver a la Materia</button>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Cargando cuestionario...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .container { padding: 20px; max-width: 800px; margin: 0 auto; }
    nav { margin-bottom: 20px; }
    nav a { color: #666; text-decoration: none; font-size: 0.9rem; }
    
    .header { margin-bottom: 30px; text-align: center; }
    h1 { color: #333; margin-bottom: 20px; font-size: 1.5rem; }
    
    .progress-container { background: #eee; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
    .progress-bar { background: #007bff; height: 100%; transition: width 0.3s; }
    .counter { color: #666; font-size: 0.9rem; }

    .question-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .question-text { font-size: 1.2rem; font-weight: 500; margin-bottom: 25px; color: #333; }

    .options { display: flex; flex-direction: column; gap: 12px; }
    .option-btn { 
      padding: 15px 20px; border: 2px solid #eee; border-radius: 8px; 
      background: white; cursor: pointer; text-align: left; font-size: 1rem;
      transition: all 0.2s;
    }
    .option-btn:hover:not(:disabled) { border-color: #007bff; background: #f8fbff; }
    .option-btn.selected { border-color: #007bff; background: #f0f7ff; }
    .option-btn.correct { background: #d4edda; border-color: #c3e6cb; color: #155724; }
    .option-btn.incorrect { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
    .option-btn:disabled { cursor: default; }

    .feedback { margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
    .correct-text { color: #28a745; font-weight: bold; margin-bottom: 15px; }
    .incorrect-text { color: #dc3545; font-weight: bold; margin-bottom: 15px; }
    .next-btn { background: #333; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; }

    .results-card { background: white; padding: 50px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    .score-circle { 
      width: 150px; height: 150px; border-radius: 50%; border: 8px solid #007bff; 
      margin: 30px auto; display: flex; align-items: center; justify-content: center;
      flex-direction: column;
    }
    .score-value { font-size: 3rem; font-weight: bold; color: #007bff; }
    .score-total { color: #666; }
    .actions { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }
    .btn-primary { background: #007bff; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; }
    .btn-secondary { background: #f8f9fa; color: #333; border: 1px solid #ddd; padding: 12px 25px; border-radius: 6px; cursor: pointer; }

    .loading-container { text-align: center; padding: 100px 0; }
    .spinner { 
      width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; 
      border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class QuizComponent implements OnInit {
  catId: string = '';
  subId: string = '';
  quizId: string = '';
  quiz?: Quiz;
  
  currentQuestionIndex: number = 0;
  score: number = 0;
  selectedOption: string | null = null;
  answered: boolean = false;
  quizFinished: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.catId = params['catId'];
      this.subId = params['subId'];
      this.quizId = params['id'];
      this.loadQuiz();
    });
  }

  loadQuiz() {
    this.quizService.getQuiz(this.catId, this.subId, this.quizId).subscribe(
      (quiz: Quiz) => {
        this.quiz = quiz;
        this.shuffleAllOptions();
      }
    );
  }

  private shuffleAllOptions() {
    if (this.quiz) {
      this.quiz.questions.forEach(q => {
        this.shuffleArray(q.options);
      });
    }
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  get currentQuestion(): Question | undefined {
    return this.quiz?.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    if (!this.quiz) return 0;
    return ((this.currentQuestionIndex) / this.quiz.questions.length) * 100;
  }

  get isCorrect(): boolean {
    return this.selectedOption === this.currentQuestion?.answer;
  }

  get isLastQuestion(): boolean {
    if (!this.quiz) return false;
    return this.currentQuestionIndex === this.quiz.questions.length - 1;
  }

  selectOption(option: string) {
    if (this.answered) return;
    this.selectedOption = option;
    this.answered = true;
    if (this.isCorrect) {
      this.score++;
    }
  }

  nextQuestion() {
    if (this.isLastQuestion) {
      this.quizFinished = true;
    } else {
      this.currentQuestionIndex++;
      this.selectedOption = null;
      this.answered = false;
    }
  }

  restart() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedOption = null;
    this.answered = false;
    this.quizFinished = false;
    this.shuffleAllOptions();
  }
}
