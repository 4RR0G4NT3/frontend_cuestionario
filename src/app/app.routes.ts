import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { SubjectComponent } from './components/subject/subject.component';
import { QuizComponent } from './components/quiz/quiz.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'subject/:catId/:id', component: SubjectComponent },
  { path: 'quiz/:catId/:subId/:id', component: QuizComponent },
  { path: '**', redirectTo: '' }
];
