import { Routes } from '@angular/router';
import { KanbanBoardComponent } from './books/kanban/kanban-board.component';
import { BookCreateComponent } from './books/management/book-create.component';
import { BookDetailComponent } from './books/management/book-detail.component';
import { BookEditComponent } from './books/management/book-edit.component';
import { BookListComponent } from './books/management/book-list.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'book/create', component: BookCreateComponent },
  { path: 'book/:id', component: BookDetailComponent },
  { path: 'book/:id/edit', component: BookEditComponent },
  { path: 'kanban', component: KanbanBoardComponent },
  { path: '**', redirectTo: '' }
];
