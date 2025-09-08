import { Routes } from '@angular/router';
import { BookCreateComponent } from './books/book-create.component';
import { BookDetailComponent } from './books/book-detail.component';
import { BookEditComponent } from './books/book-edit.component';
import { BookListComponent } from './books/book-list.component';
import { KanbanBoardComponent } from './books/kanban-board.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'book/create', component: BookCreateComponent },
  { path: 'book/:id', component: BookDetailComponent },
  { path: 'book/:id/edit', component: BookEditComponent },
  { path: 'kanban', component: KanbanBoardComponent },
  { path: '**', redirectTo: '' }
];
