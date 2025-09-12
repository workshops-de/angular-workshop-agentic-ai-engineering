import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Control, form, maxLength, min, minLength, pattern, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Book } from '../core/book';
import { BookApiClient } from '../core/book-api-client.service';

@Component({
  selector: 'app-book-create',
  imports: [ReactiveFormsModule, RouterLink, Control],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center">
            <a
              [routerLink]="['/']"
              class="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200 mr-4"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </a>
            <h1 class="text-3xl font-bold text-gray-900">Create New Book</h1>
          </div>
        </div>

        <!-- Form -->
        <form class="space-y-6">
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
              <label for="publisher" class="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
              <input
                type="text"
                id="publisher"
                [control]="bookForm.publisher"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Number of Pages -->
            <div class="mb-6">
              <label for="numPages" class="block text-sm font-medium text-gray-700 mb-2">Number of Pages</label>
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
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">Price</label>
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
              type="button"
              (click)="onSubmit()"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="bookForm().invalid() || saving()"
            >
              @if (!saving()) {
                <span>Create Book</span>
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
                  Creating...
                </span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class BookCreateComponent {
  private readonly router = inject(Router);
  private readonly bookApiClient = inject(BookApiClient);

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

    required(path.author, { message: 'Author is required.' });

    min(path.numPages, 1, { message: 'Number of pages must be at least 1.' });

    pattern(path.price, /^\$?\d+(\.\d{2})?$/, { message: 'Price must be a valid amount, e.g., $29.99 or 29.99.' });

    maxLength(path.abstract, 2000, { message: 'Abstract cannot exceed 2000 characters.' });
  });

  onSubmit(): void {
    if (this.bookForm().invalid()) {
      return;
    }

    this.saving.set(true);

    // Create a new book object with form values
    // We omit the ID as it will be generated by the API
    const newBook = {
      ...this.book(),
      userId: 1 // Default user ID for demo purposes
    };

    this.bookApiClient
      .createBook(newBook)
      .pipe(
        catchError(error => {
          console.error('Error creating book:', error);
          this.saving.set(false);
          return of(null);
        })
      )
      .subscribe(createdBook => {
        if (createdBook) {
          this.router.navigate(['/']); // Navigate back to book list
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
