import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Control, form, maxLength, min, minLength, pattern, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Book } from '../core/book';
import { BookApiClient } from '../core/book-api-client.service';
import { ErrorMessageComponent } from '../shared/error-message.component';
import { LoadingIndicationComponent } from '../shared/loading-indication.component';

@Component({
  selector: 'app-book-edit',
  imports: [ReactiveFormsModule, RouterLink, Control, LoadingIndicationComponent, ErrorMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      @if (loading()) {
        <app-loading-indication />
      } @else if (error()) {
        <app-error-message
          [title]="'Book Not Found'"
          [message]="'The book you\\'re trying to edit doesn\\'t exist or has been removed.'"
          [backLink]="'/books'"
          [backLabel]="'Back to Books'"
        />
      } @else {
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <a
                [routerLink]="['/book', book() ? book().id : '']"
                class="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200 mr-4"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back
              </a>
              <h1 class="text-3xl font-bold text-gray-900">Edit Book</h1>
            </div>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <!-- Title -->
              <div class="mb-6">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  [control]="bookForm.title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.title().invalid()"
                />
                @for (error of bookForm.title().errors(); track error.kind) {
                  <div class="mt-1 text-sm text-red-600">
                    <p>{{ error.message }}</p>
                  </div>
                }
              </div>

              <!-- Subtitle -->
              <div class="mb-6">
                <label for="subtitle" class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  id="subtitle"
                  [control]="bookForm.subtitle"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Author -->
              <div class="mb-6">
                <label for="author" class="block text-sm font-medium text-gray-700 mb-2">
                  Author <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  [control]="bookForm.author"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.author().invalid()"
                />
                @for (error of bookForm.author().errors(); track error.kind) {
                  <div class="mt-1 text-sm text-red-600">
                    <p>{{ error.message }}</p>
                  </div>
                }
              </div>

              <!-- ISBN -->
              <div class="mb-6">
                <label for="isbn" class="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  [control]="bookForm.isbn"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.isbn().invalid()"
                />
                @for (error of bookForm.isbn().errors(); track error.kind) {
                  <div class="mt-1 text-sm text-red-600">
                    <p>{{ error.message }}</p>
                  </div>
                }
              </div>

              <!-- Publisher -->
              <div class="mb-6">
                <label for="publisher" class="block text-sm font-medium text-gray-700 mb-2">
                  Publisher <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="publisher"
                  [control]="bookForm.publisher"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.publisher().invalid()"
                />
                @for (error of bookForm.publisher().errors(); track error.kind) {
                  <div class="mt-1 text-sm text-red-600">
                    <p>{{ error.message }}</p>
                  </div>
                }
              </div>

              <!-- Number of Pages -->
              <div class="mb-6">
                <label for="numPages" class="block text-sm font-medium text-gray-700 mb-2">
                  Number of Pages <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="numPages"
                  [control]="bookForm.numPages"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.numPages().invalid()"
                />
                @for (error of bookForm.numPages().errors(); track error.kind) {
                  <div class="mt-1 text-sm text-red-600">
                    <p>{{ error.message }}</p>
                  </div>
                }
              </div>

              <!-- Price -->
              <div class="mb-6">
                <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                  Price <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  [control]="bookForm.price"
                  placeholder="e.g., $29.99"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.price().invalid()"
                />
                @for (error of bookForm.price().errors(); track error.kind) {
                  <div class="mt-1 text-sm text-red-600">
                    <p>{{ error.message }}</p>
                  </div>
                }
              </div>

              <!-- Cover URL -->
              <div class="mb-6">
                <label for="cover" class="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                <input
                  type="url"
                  id="cover"
                  [control]="bookForm.cover"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Abstract -->
              <div class="mb-6">
                <label for="abstract" class="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
                <textarea
                  id="abstract"
                  [control]="bookForm.abstract"
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.abstract().invalid()"
                ></textarea>
                @for (error of bookForm.abstract().errors(); track error.kind) {
                  <div class="mt-1 text-sm text-red-600">
                    <p>{{ error.message }}</p>
                  </div>
                }
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                (click)="goBack()"
                class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition duration-200"
                [disabled]="saving()"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="bookForm().invalid() || saving()"
              >
                @if (!saving()) {
                  <span>Save Changes</span>
                }
                @if (saving()) {
                  <span class="flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                }
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
})
export class BookEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookApiClient = inject(BookApiClient);

  loading = signal(true);
  error = signal(false);
  saving = signal(false);

  protected book = signal<Book>({
    id: '',
    userId: 0,
    title: '',
    subtitle: '',
    author: '',
    isbn: '',
    publisher: '',
    numPages: 0,
    price: '',
    cover: '',
    abstract: ''
  });

  bookForm = form(this.book, path => {
    required(path.title, { message: 'Title is required.' });
    minLength(path.title, 2, { message: 'Title must be at least 2 characters long.' });

    required(path.isbn, { message: 'ISBN is required.' });

    required(path.author, { message: 'Author is required.' });

    required(path.publisher, { message: 'Publisher is required.' });

    required(path.numPages, { message: 'Number of pages is required.' });
    min(path.numPages, 1, { message: 'Number of pages must be at least 1.' });

    required(path.price, { message: 'Price is required.' });
    pattern(path.price, /^\$?\d+(\.\d{2})?$/, { message: 'Price must be a valid amount, e.g., $29.99 or 29.99.' });

    maxLength(path.abstract, 2000, { message: 'Abstract cannot exceed 2000 characters.' });
  });

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
        catchError(error => {
          console.error('Error fetching book:', error);
          this.error.set(true);
          this.loading.set(false);
          return of(null);
        })
      )
      .pipe(
        tap(book => {
          if (book) {
            this.book.set(book);
            this.loading.set(false);
          }
        })
      )
      .subscribe();
  }

  onSubmit(): void {
    if (this.bookForm().invalid()) {
      return;
    }

    this.saving.set(true);

    this.bookApiClient
      .updateBook(this.book()!.id, this.book())
      .pipe(
        tap(updatedBook => {
          if (updatedBook) {
            this.router.navigate(['/book', this.book().id]);
          }
        }),
        catchError(error => {
          console.error('Error updating book:', error);
          this.saving.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  goBack(): void {
    if (this.book()) {
      this.router.navigate(['/book', this.book()!.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
