import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BookHighlight } from './book-highlight';

@Component({
  selector: 'app-book-highlight-cover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let currentBook = book();
    <div class="relative">
      <img [src]="currentBook.cover" [alt]="currentBook.title" class="w-full h-64 object-cover rounded-t-lg" />

      <!-- Badges -->
      @if (currentBook.badge) {
        <div class="absolute top-2 left-2">
          <span class="px-2 py-1 text-xs font-semibold rounded text-white" [class]="getBadgeClass(currentBook.badge)">
            {{ currentBook.badge }}
          </span>
        </div>
      }

      <!-- Heart Icon -->
      <div class="absolute top-2 right-2">
        <button
          class="w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200"
        >
          <svg class="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Status badges -->
      @if (currentBook.isNew) {
        <div class="absolute bottom-2 left-2">
          <span class="px-2 py-1 text-xs font-semibold bg-gray-800 text-white rounded"> Neu </span>
        </div>
      }
      @if (currentBook.isBestseller) {
        <div class="absolute bottom-2 left-2">
          <span class="px-2 py-1 text-xs font-semibold bg-orange-500 text-white rounded"> Vorbesteller </span>
        </div>
      }
    </div>
  `
})
export class BookHighlightCoverComponent {
  book = input.required<BookHighlight>();

  getBadgeClass(badge: string): string {
    switch (badge) {
      case 'Neu':
        return 'bg-gray-800';
      case 'Vorbesteller':
        return 'bg-orange-500';
      default:
        return 'bg-gray-600';
    }
  }
}
