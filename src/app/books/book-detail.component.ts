import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <div class="animate-pulse flex flex-col items-center">
          <div
            class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="flex flex-col items-center justify-center py-20 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-red-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
        <p class="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <button
          (click)="goBack()"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          Back to Books
        </button>
      </div>

      <!-- Book Detail Content -->
      <div *ngIf="book && !loading && !error" class="space-y-8">
        <!-- Back Button and Edit Button -->
        <div class="flex items-center justify-between">
          <button
            (click)="goBack()"
            class="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Books
          </button>
          <button
            (click)="editBook()"
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
          </button>
        </div>

        <!-- Main Book Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Book Cover -->
          <div class="lg:col-span-1">
            <div class="sticky top-8">
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="aspect-[3/4] relative">
                  <img
                    *ngIf="book.cover"
                    [src]="book.cover"
                    [alt]="book.title"
                    class="w-full h-full object-contain bg-gray-100"
                  />
                  <div *ngIf="!book.cover" class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div class="text-center">
                      <svg
                        class="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
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
                </div>
              </div>
            </div>
          </div>

          <!-- Book Information -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Title and Author -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ book.title }}</h1>
              <h2 *ngIf="book.subtitle" class="text-xl text-gray-600 mb-4">{{ book.subtitle }}</h2>
              <p class="text-lg text-blue-700 font-semibold">by {{ book.author }}</p>
            </div>

            <!-- Book Details -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Book Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-3">
                  <div *ngIf="book.isbn">
                    <span class="text-sm font-medium text-gray-500 uppercase tracking-wide">ISBN</span>
                    <p class="text-gray-900">{{ book.isbn }}</p>
                  </div>
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
            <div *ngIf="book.abstract" class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">About This Book</h3>
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ book.abstract }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookApiClient: BookApiClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(id);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadBook(id: string): void {
    this.loading = true;
    this.bookApiClient
      .getBookById(id)
      .pipe(
        catchError(error => {
          console.error('Error fetching book:', error);
          this.error = true;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(book => {
        if (book) {
          this.book = book;
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  editBook(): void {
    if (this.book) {
      this.router.navigate(['/book', this.book.id, 'edit']);
    }
  }
}
