import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Book, BookStatus } from './book';
import { KanbanColumnComponent } from './kanban-column.component';
import { KanbanService } from './kanban.service';

@Component({
  selector: 'app-kanban-board',
  imports: [DragDropModule, FormsModule, RouterLink, KanbanColumnComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <div class="flex items-center justify-between mb-10 border-b pb-4 border-gray-200">
        <h1 class="text-3xl font-bold text-blue-700">Book Kanban Board</h1>
        <a
          routerLink="/"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center font-medium transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </a>
      </div>

      <!-- Search filter -->
      <div class="mb-6">
        <div class="flex items-center border-b-2 border-gray-300 py-2 max-w-md mx-auto">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Filter books by title..."
            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          @if (kanbanService.filterTerm()) {
            <button (click)="clearSearch()" class="flex-shrink-0 text-gray-500 hover:text-gray-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          }
        </div>
      </div>

      <!-- Kanban board -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-320px)]">
        <!-- Unread column -->
        <div class="bg-gray-200 rounded-lg shadow h-full">
          <app-kanban-column
            title="Unread"
            [status]="BookStatus.Unread"
            [books]="kanbanService.unreadBooks()"
            (itemDropped)="onItemDropped($event)"
          ></app-kanban-column>
        </div>

        <!-- Backlog column -->
        <div class="bg-gray-200 rounded-lg shadow h-full">
          <app-kanban-column
            title="Backlog"
            [status]="BookStatus.Backlog"
            [books]="kanbanService.backlogBooks()"
            (itemDropped)="onItemDropped($event)"
          ></app-kanban-column>
        </div>

        <!-- Read column -->
        <div class="bg-gray-200 rounded-lg shadow h-full">
          <app-kanban-column
            title="Read"
            [status]="BookStatus.Read"
            [books]="kanbanService.readBooks()"
            (itemDropped)="onItemDropped($event)"
          ></app-kanban-column>
        </div>
      </div>
    </div>
  `
})
export class KanbanBoardComponent implements OnInit {
  protected readonly kanbanService = inject(KanbanService);
  protected readonly BookStatus = BookStatus;

  // For ngModel binding
  searchTerm = '';

  ngOnInit(): void {
    this.kanbanService.loadBooks();
  }

  onSearchChange(term: string): void {
    this.kanbanService.setFilter(term);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.kanbanService.setFilter('');
  }

  onItemDropped(event: { item: Book; targetStatus: BookStatus }): void {
    this.kanbanService.updateBookStatus(event.item.id, event.targetStatus);
  }
}
