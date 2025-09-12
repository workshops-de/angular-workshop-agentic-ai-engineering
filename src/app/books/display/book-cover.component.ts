import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Book } from '../core/book';

@Component({
  selector: 'app-book-cover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let currentBook = book();
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="aspect-[3/4] relative">
        @if (currentBook.cover) {
          <img
            [src]="currentBook.cover"
            [alt]="currentBook.title || 'Book Cover'"
            class="w-full h-full object-contain bg-gray-100"
          />
        } @else {
          <div class="w-full h-full bg-gray-100 flex items-center justify-center">
            <div class="text-center">
              <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span class="text-gray-500 text-sm font-medium">No cover available</span>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class BookCoverComponent {
  book = input.required<Book>();
}
