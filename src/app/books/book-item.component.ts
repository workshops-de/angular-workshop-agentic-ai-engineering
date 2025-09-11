import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from './book';
import { BookCoverComponent } from './book-cover.component';

@Component({
  selector: 'app-book-item',
  imports: [RouterLink, BookCoverComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let currentBook = book();
    <a
      [routerLink]="['/book', currentBook.id]"
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
    >
      <div class="relative aspect-[3/4] overflow-hidden">
        <app-book-cover [book]="currentBook" />
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h2 class="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{{ currentBook.title }}</h2>
        @if (currentBook.subtitle) {
          <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ currentBook.subtitle }}</p>
        }
        <div class="text-sm text-gray-700 mt-auto">
          <p>
            <span class="text-blue-700">{{ currentBook.author }}</span>
          </p>
          @if (currentBook.isbn) {
            <p class="text-xs text-gray-500 mt-2">ISBN: {{ currentBook.isbn }}</p>
          }
        </div>
      </div>
    </a>
  `
})
export class BookItemComponent {
  book = input.required<Book>();
}
