import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Book } from '../core/book';
import { BookApiClient } from '../core/book-api-client.service';
import { LoadingIndicationComponent } from '../shared/loading-indication.component';
import { BookHighlight } from './book-highlight';
import { BookHighlightCoverComponent } from './book-highlight-cover.component';
import { BookHighlightDetailsComponent } from './book-highlight-details.component';
import { BookHighlightService } from './book-highlight.service';

@Component({
  selector: 'app-book-highlights',
  imports: [LoadingIndicationComponent, BookHighlightCoverComponent, BookHighlightDetailsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gray-100 py-12">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Thalia Highlights</h2>
          @if (!loading()) {
            <div class="flex items-center space-x-2">
              <button
                (click)="previousSlide()"
                [disabled]="currentIndex() === 0"
                class="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                (click)="nextSlide()"
                [disabled]="currentIndex() >= maxIndex()"
                class="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          }
        </div>

        @if (loading()) {
          <app-loading-indication></app-loading-indication>
        } @else {
          @let books = highlightedBooks();
          <div class="relative overflow-hidden">
            <div
              class="flex transition-transform duration-300 ease-in-out"
              [style.transform]="'translateX(-' + currentIndex() * slideWidth() + '%)'"
            >
              @for (book of books; track book.id) {
                @let currentBook = book;
                <div class="flex-shrink-0 w-1/5 px-2">
                  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
                    <app-book-highlight-cover [book]="currentBook"></app-book-highlight-cover>
                    <app-book-highlight-details [book]="currentBook"></app-book-highlight-details>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class BookHighlightsComponent implements OnInit {
  private readonly bookApiClient = inject(BookApiClient);
  private readonly bookHighlightService = inject(BookHighlightService);

  highlightedBooks = signal<BookHighlight[]>([]);
  currentIndex = signal(0);
  loading = signal(true);

  // Carousel configuration
  readonly maxVisibleItems = 5;
  readonly slideWidth = computed(() => 100 / this.maxVisibleItems);
  readonly maxIndex = computed(() => Math.max(0, this.highlightedBooks().length - this.maxVisibleItems));

  ngOnInit(): void {
    this.loadHighlightedBooks();
  }

  private loadHighlightedBooks(): void {
    this.loading.set(true);
    this.bookApiClient
      .getBooks(10) // Get more books to have variety for highlights
      .pipe(
        tap((books: Book[]) => {
          // Transform books into highlighted books with mock data
          const highlighted = books
            .slice(0, 8) // Take first 8 books for variety
            .map(book => this.bookHighlightService.enhanceBookWithMockData(book));

          this.highlightedBooks.set(highlighted);
          this.loading.set(false);
        }),
        catchError(error => {
          console.error('Error fetching highlighted books:', error);
          this.loading.set(false);
          return of([]);
        })
      )
      .subscribe();
  }

  // Carousel navigation
  nextSlide(): void {
    if (this.currentIndex() < this.maxIndex()) {
      this.currentIndex.update(index => index + 1);
    }
  }

  previousSlide(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(index => index - 1);
    }
  }
}
