import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Book } from '../core/book';
import { BookApiClient } from '../core/book-api-client.service';
import { BookCoverComponent } from '../display/book-cover.component';
import { ErrorMessageComponent } from '../shared/error-message.component';
import { LoadingIndicationComponent } from '../shared/loading-indication.component';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink, LoadingIndicationComponent, ErrorMessageComponent, BookCoverComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      @if (loading()) {
        <app-loading-indication />
      } @else if (error()) {
        <app-error-message />
      } @else if (book(); as book) {
        <div class="space-y-8">
          <!-- Back Button and Edit Button -->
          <div class="flex items-center justify-between">
            <a
              [routerLink]="['/']"
              class="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Books
            </a>
            <a
              [routerLink]="['/book', book.id, 'edit']"
              class="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              Edit Book
            </a>
          </div>

          <!-- Main Book Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Book Cover -->
            <div class="lg:col-span-1">
              <div class="sticky top-8">
                <app-book-cover [book]="book" />
              </div>
            </div>

            <!-- Book Information -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Title and Author -->
              <div class="bg-white rounded-lg shadow-lg p-6">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ book.title }}</h1>
                @if (book.subtitle) {
                  <h2 class="text-xl text-gray-600 mb-4">{{ book.subtitle }}</h2>
                }
                <p class="text-lg text-blue-700 font-semibold">by {{ book.author }}</p>
              </div>

              <!-- Book Details -->
              <div class="bg-white rounded-lg shadow-lg p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-4">Book Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-3">
                    @if (book.isbn) {
                      <div>
                        <span class="text-sm font-medium text-gray-500 uppercase tracking-wide">ISBN</span>
                        <p class="text-gray-900">{{ book.isbn }}</p>
                      </div>
                    }
                    <div>
                      <span class="text-sm font-medium text-gray-500 uppercase tracking-wide">Publisher</span>
                      <p class="text-gray-900">{{ book.publisher }}</p>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div>
                      <span class="text-sm font-medium text-gray-500 uppercase tracking-wide">Pages</span>
                      <p class="text-gray-900">{{ book.numPages }}</p>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-500 uppercase tracking-wide">Price</span>
                      <p class="font-semibold text-green-600">{{ book.price }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Abstract -->
              @if (book.abstract) {
                <div class="bg-white rounded-lg shadow-lg p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-4">About This Book</h3>
                  <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ book.abstract }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BookDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookApiClient = inject(BookApiClient);

  book = signal<Book | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(id);
    } else {
      this.error.set(true);
      this.loading.set(false);
    }
  }

  private loadBook(id: string): void {
    this.loading.set(true);
    this.bookApiClient
      .getBookById(id)
      .pipe(
        catchError(() => {
          this.error.set(true);
          this.loading.set(false);
          return of(null);
        }),
        tap(book => {
          this.book.set(book);
          this.loading.set(false);
        })
      )
      .subscribe();
  }
}
