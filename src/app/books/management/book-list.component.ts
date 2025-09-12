import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Book } from '../core/book';
import { BookApiClient, PaginatedResponse } from '../core/book-api-client.service';
import { BookItemComponent } from '../display/book-item.component';
import { BookHighlightsComponent } from '../highlights/book-highlights.component';

@Component({
  selector: 'app-book-list',
  imports: [FormsModule, BookItemComponent, RouterLink, BookHighlightsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Book Highlights Carousel -->
    <app-book-highlights></app-book-highlights>

    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <div class="flex items-center justify-between mb-10 border-b pb-4 border-gray-200">
        <h1 data-testid="book-collection-title" class="text-3xl font-bold text-blue-700">Book Collection</h1>
        <a
          routerLink="/book/create"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center font-medium transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Book
        </a>
      </div>

      <div class="mb-6">
        <div class="flex items-center border-b-2 border-gray-300 py-2">
          <input
            data-testid="book-search-input"
            type="text"
            [(ngModel)]="searchTermModel"
            (ngModelChange)="onSearchChange()"
            placeholder="Search for books..."
            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          @if (searchTerm()) {
            <button (click)="clearSearch()" class="flex-shrink-0 text-gray-500 hover:text-gray-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div
              class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
            ></div>
            <p data-testid="loading-indicator" class="mt-4 text-gray-600">Loading books...</p>
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          @if (books().length > 0) {
            @for (book of books(); track book.id) {
              <app-book-item data-testid="book-item" [book]="book"></app-book-item>
            }
          } @else {
            <div
              class="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p class="text-xl font-medium text-gray-600 mb-2">
                {{ searchTerm() ? 'No books match your search' : 'No books available' }}
              </p>
              <p class="text-gray-500">
                {{ searchTerm() ? 'Try different search terms or clear the search' : 'Check back later' }}
              </p>
              @if (searchTerm()) {
                <button
                  (click)="clearSearch()"
                  class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Clear Search
                </button>
              }
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (books().length > 0 && totalPages() > 1) {
          <div class="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
            <!-- Results info -->
            <div class="text-sm text-gray-600">
              Showing {{ (currentPage() - 1) * pageSize() + 1 }} to
              {{ Math.min(currentPage() * pageSize(), totalCount()) }} of {{ totalCount() }} results
            </div>

            <!-- Pagination controls -->
            <nav class="flex items-center space-x-1">
              <!-- Previous button -->
              <button
                (click)="goToPreviousPage()"
                [disabled]="!canGoPrevious()"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition duration-200"
              >
                Previous
              </button>

              <!-- Page numbers -->
              @for (page of pageNumbers(); track page) {
                <button
                  (click)="goToPage(page)"
                  [class]="
                    page === currentPage()
                      ? 'px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition duration-200'
                      : 'px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200'
                  "
                >
                  {{ page }}
                </button>
              }

              <!-- Next button -->
              <button
                (click)="goToNextPage()"
                [disabled]="!canGoNext()"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition duration-200"
              >
                Next
              </button>
            </nav>
          </div>
        }
      }
    </div>
  `
})
export class BookListComponent implements OnInit {
  private readonly bookApiClient = inject(BookApiClient);
  private readonly router = inject(Router);

  // Make Math available in template
  protected readonly Math = Math;

  pageSize = input<number>(10);
  books = signal<Book[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  searchTimeout: any;

  // Pagination state
  currentPage = signal(1);
  totalCount = signal(0);
  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));

  // Pagination computed properties
  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  // Generate page numbers for pagination UI
  pageNumbers = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    // Show up to 5 page numbers
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    // Adjust start if we're near the end
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  // Model for ngModel binding
  get searchTermModel() {
    return this.searchTerm();
  }
  set searchTermModel(value: string) {
    this.searchTerm.set(value);
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(search?: string, page: number = 1): void {
    this.loading.set(true);
    this.bookApiClient
      .getBooksWithPagination(page, this.pageSize(), search)
      .pipe(
        tap((response: PaginatedResponse<Book>) => {
          this.books.set(response.data);
          this.totalCount.set(response.totalCount);
          this.currentPage.set(response.currentPage);
          this.loading.set(false);
        }),
        catchError(error => {
          console.error('Error fetching books:', error);
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  onSearchChange(): void {
    // Debounce search to avoid too many API calls while typing
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      // Reset to first page when searching
      this.currentPage.set(1);
      this.loadBooks(this.searchTerm(), 1);
    }, 300);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.loadBooks();
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.loadBooks(this.searchTerm() || undefined, page);
    }
  }

  goToPreviousPage(): void {
    if (this.canGoPrevious()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  goToNextPage(): void {
    if (this.canGoNext()) {
      this.goToPage(this.currentPage() + 1);
    }
  }
}
