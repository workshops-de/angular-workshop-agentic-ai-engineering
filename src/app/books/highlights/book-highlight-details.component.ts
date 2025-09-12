import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BookHighlight } from './book-highlight';

@Component({
  selector: 'app-book-highlight-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let currentBook = book();
    <div class="p-4">
      <h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
        {{ currentBook.title }}
      </h3>
      <p class="text-gray-600 text-xs mb-2">{{ currentBook.author }}</p>

      <!-- Book Type and Price -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500">{{ getBookType(currentBook) }}</span>
        <span class="font-bold text-sm text-gray-800">{{ currentBook.price }}</span>
      </div>

      <!-- Rating -->
      <div class="flex items-center">
        <div class="flex items-center mr-2">
          @for (star of getStarArray(currentBook.rating); track $index) {
            <svg
              class="w-3 h-3"
              [class]="star ? 'text-yellow-400' : 'text-gray-300'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
          }
        </div>
        <span class="text-xs text-gray-600">({{ currentBook.reviewCount }})</span>
      </div>
    </div>
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `
  ]
})
export class BookHighlightDetailsComponent {
  book = input.required<BookHighlight>();

  getBookType(book: BookHighlight): string {
    // Mock book types based on some logic
    const types = ['Buch (Gebundene Ausgabe)', 'Buch (Taschenbuch)'];
    return book.numPages > 300 ? types[0] : types[1];
  }

  getStarArray(rating: number): boolean[] {
    const stars: boolean[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(true);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(true); // For simplicity, showing half stars as full
      } else {
        stars.push(false);
      }
    }

    return stars;
  }
}
