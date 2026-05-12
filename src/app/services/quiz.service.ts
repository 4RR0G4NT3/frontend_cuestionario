import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category, Quiz } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'https://backend-cuestionario-dsc5.onrender.com/home';

  // Hardcoded structure for navigation as discussed
  private data: Category[] = [
    {
      id: 'derecho',
      name: 'Derecho',
      subjects: [
        {
          id: 'introduccion_al_derecho',
          name: 'Introducción al Derecho',
          quizzes: ['cuestionario_1']
        },
        {
          id: 'personas',
          name: 'Derecho Civil Personas',
          quizzes: []
        }
      ]
    },
    {
      id: 'programacion',
      name: 'Programación',
      subjects: [
        {
          id: 'java',
          name: 'Java',
          quizzes: ['cuestionario_1']
        }
      ]
    }
  ];

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return of(this.data);
  }

  getCategory(id: string): Observable<Category | undefined> {
    return of(this.data.find(c => c.id === id));
  }

  getQuiz(category: string, subject: string, quizId: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${category}/${subject}/${quizId}`);
  }
}
