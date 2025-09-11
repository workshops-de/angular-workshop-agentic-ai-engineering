import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ToastService } from '../shared/toast.service';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-create',
  imports: [ReactiveFormsModule, RouterLink],
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
        <form [formGroup]="bookForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <!-- Title -->
            <div class="mb-6">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                formControlName="title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                [class.border-red-500]="bookForm.get('title')?.invalid && bookForm.get('title')?.touched"
              />
              @if (bookForm.get('title')?.invalid && bookForm.get('title')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (bookForm.get('title')?.errors?.['required']) {
                    <div>Title is required.</div>
                  }
                  @if (bookForm.get('title')?.errors?.['minlength']) {
                    <div>Title must be at least 2 characters long.</div>
                  }
                </div>
              }
            </div>

            <!-- Author -->
            <div class="mb-6">
              <label for="author" class="block text-sm font-medium text-gray-700 mb-2">
                Author <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                formControlName="author"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                [class.border-red-500]="bookForm.get('author')?.invalid && bookForm.get('author')?.touched"
              />
              @if (bookForm.get('author')?.invalid && bookForm.get('author')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (bookForm.get('author')?.errors?.['required']) {
                    <div>Author is required.</div>
                  }
                </div>
              }
            </div>

            <!-- ISBN -->
            <div class="mb-6">
              <label for="isbn" class="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
              <input
                type="text"
                id="isbn"
                formControlName="isbn"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                [class.border-red-500]="bookForm.get('isbn')?.invalid && bookForm.get('isbn')?.touched"
              />
              @if (bookForm.get('isbn')?.invalid && bookForm.get('isbn')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (bookForm.get('isbn')?.errors?.['pattern']) {
                    <div>Please enter a valid ISBN format.</div>
                  }
                </div>
              }
            </div>

            <!-- Publisher -->
            <div class="mb-6">
              <label for="publisher" class="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
              <input
                type="text"
                id="publisher"
                formControlName="publisher"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Number of Pages -->
            <div class="mb-6">
              <label for="numPages" class="block text-sm font-medium text-gray-700 mb-2">Number of Pages</label>
              <input
                type="number"
                id="numPages"
                formControlName="numPages"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                [class.border-red-500]="bookForm.get('numPages')?.invalid && bookForm.get('numPages')?.touched"
              />
              @if (bookForm.get('numPages')?.invalid && bookForm.get('numPages')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (bookForm.get('numPages')?.errors?.['min']) {
                    <div>Number of pages must be at least 1.</div>
                  }
                </div>
              }
            </div>

            <!-- Price -->
            <div class="mb-6">
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="text"
                id="price"
                formControlName="price"
                placeholder="e.g., $29.99"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                [class.border-red-500]="bookForm.get('price')?.invalid && bookForm.get('price')?.touched"
              />
              @if (bookForm.get('price')?.invalid && bookForm.get('price')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (bookForm.get('price')?.errors?.['pattern']) {
                    <div>Please enter a valid price format (e.g., $29.99).</div>
                  }
                </div>
              }
            </div>

            <!-- Cover URL -->
            <div class="mb-6">
              <label for="cover" class="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
              <input
                type="url"
                id="cover"
                formControlName="cover"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Abstract -->
            <div class="mb-6">
              <label for="abstract" class="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
              <textarea
                id="abstract"
                formControlName="abstract"
                rows="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                [class.border-red-500]="bookForm.get('abstract')?.invalid && bookForm.get('abstract')?.touched"
              ></textarea>
              @if (bookForm.get('abstract')?.invalid && bookForm.get('abstract')?.touched) {
                <div class="mt-1 text-sm text-red-600">
                  @if (bookForm.get('abstract')?.errors?.['maxlength']) {
                    <div>Abstract cannot exceed 2000 characters.</div>
                  }
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
              [disabled]="bookForm.invalid || saving()"
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
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  saving = signal(false);

  bookForm: FormGroup;

  constructor() {
    // Initialize form with validation
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required]],
      isbn: [''],
      publisher: [''],
      numPages: [0, [Validators.min(1)]],
      price: ['', [Validators.pattern(/^\$?\d+(\.\d{2})?$/)]],
      cover: [''],
      abstract: ['', [Validators.maxLength(2000)]]
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.saving.set(true);

      // Create a new book object with form values
      // We omit the ID as it will be generated by the API
      const newBook = {
        ...this.bookForm.value,
        userId: 1 // Default user ID for demo purposes
      };

      this.bookApiClient
        .createBook(newBook)
        .pipe(
          catchError(error => {
            console.error('Error creating book:', error);
            this.toastService.show('Failed to create book. Please try again.', 5000);
            this.saving.set(false);
            return of(null);
          })
        )
        .subscribe(createdBook => {
          if (createdBook) {
            this.toastService.show('Book created successfully!', 3000);
            this.router.navigate(['/']); // Navigate back to book list
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
