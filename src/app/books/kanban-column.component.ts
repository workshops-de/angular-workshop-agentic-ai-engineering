import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Book, BookStatus } from './book';

@Component({
  selector: 'app-kanban-column',
  imports: [NgClass, CdkDropList, CdkDrag, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-full">
      <div class="bg-gray-100 p-4 rounded-t-lg">
        <h3 class="text-lg font-bold flex items-center gap-2">
          <span [ngClass]="statusColorClass()">{{ title() }}</span>
          <span class="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
            {{ books().length }}
          </span>
        </h3>
      </div>

      <div
        class="flex-1 bg-gray-50 p-2 overflow-y-auto"
        cdkDropList
        [cdkDropListData]="books()"
        [id]="status()"
        [cdkDropListConnectedTo]="connectedLists()"
        (cdkDropListDropped)="onItemDrop($event)"
      >
        @if (books().length === 0) {
          <div class="p-4 text-center text-gray-500 italic bg-white rounded my-2">No books in this column</div>
        }

        @for (book of books(); track book.id) {
          <div
            class="mb-2 p-3 bg-white rounded shadow hover:shadow-md cursor-move transition-shadow"
            cdkDrag
            [cdkDragData]="book"
          >
            <div class="flex items-start gap-3">
              @if (book.cover) {
                <img [ngSrc]="book.cover" alt="Book cover" width="50" height="75" class="rounded shadow" priority />
              } @else {
                <div class="w-12 h-[75px] bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  No Image
                </div>
              }

              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-blue-700 truncate">{{ book.title }}</h4>
                <p class="text-sm text-gray-600 truncate">by {{ book.author }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class KanbanColumnComponent {
  title = input.required<string>();
  status = input.required<string>();
  books = input.required<Book[]>();
  connectedLists = input<string[]>(['unread', 'backlog', 'read']);

  itemDropped = output<{ item: Book; targetStatus: BookStatus }>();

  statusColorClass = input(() => {
    const status = this.status();
    switch (status) {
      case BookStatus.Unread:
        return 'text-blue-700';
      case BookStatus.Backlog:
        return 'text-amber-600';
      case BookStatus.Read:
        return 'text-green-700';
      default:
        return '';
    }
  });

  onItemDrop(event: CdkDragDrop<Book[]>): void {
    // Only handle cross-list drops
    if (event.previousContainer !== event.container) {
      const item = event.item.data as Book;

      // Emit the event to update the data model
      this.itemDropped.emit({
        item,
        targetStatus: this.status() as BookStatus
      });
    }
  }
}
