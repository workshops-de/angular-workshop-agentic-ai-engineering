import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ToastService } from '../shared/toast.service';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-edit',
  imports: [ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Loading State -->
      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div
              class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
            ></div>
            <p class="mt-4 text-gray-600">Loading book details...</p>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error() && !loading()) {
        <div class="flex flex-col items-center justify-center py-20 text-center">
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
          <p class="text-gray-600 mb-6">The book you're trying to edit doesn't exist or has been removed.</p>
          <button
            (click)="goBack()"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Back to Books
          </button>
        </div>
      }

      <!-- Edit Form -->
      @if (book() && !loading() && !error()) {
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <button
                (click)="goBack()"
                class="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200 mr-4"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back
              </button>
              <h1 class="text-3xl font-bold text-gray-900">Edit Book</h1>
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

              <!-- Subtitle -->
              <div class="mb-6">
                <label for="subtitle" class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  id="subtitle"
                  formControlName="subtitle"
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
                <label for="publisher" class="block text-sm font-medium text-gray-700 mb-2">
                  Publisher <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="publisher"
                  formControlName="publisher"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.get('publisher')?.invalid && bookForm.get('publisher')?.touched"
                />
                @if (bookForm.get('publisher')?.invalid && bookForm.get('publisher')?.touched) {
                  <div class="mt-1 text-sm text-red-600">
                    @if (bookForm.get('publisher')?.errors?.['required']) {
                      <div>Publisher is required.</div>
                    }
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
                  formControlName="numPages"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.get('numPages')?.invalid && bookForm.get('numPages')?.touched"
                />
                @if (bookForm.get('numPages')?.invalid && bookForm.get('numPages')?.touched) {
                  <div class="mt-1 text-sm text-red-600">
                    @if (bookForm.get('numPages')?.errors?.['required']) {
                      <div>Number of pages is required.</div>
                    }
                    @if (bookForm.get('numPages')?.errors?.['min']) {
                      <div>Number of pages must be at least 1.</div>
                    }
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
                  formControlName="price"
                  placeholder="e.g., $29.99"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="bookForm.get('price')?.invalid && bookForm.get('price')?.touched"
                />
                @if (bookForm.get('price')?.invalid && bookForm.get('price')?.touched) {
                  <div class="mt-1 text-sm text-red-600">
                    @if (bookForm.get('price')?.errors?.['required']) {
                      <div>Price is required.</div>
                    }
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
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  book = signal<Book | null>(null);
  loading = signal(true);
  error = signal(false);
  saving = signal(false);

  bookForm: FormGroup;

  constructor() {
    // Initialize form with validation
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      subtitle: [''],
      author: ['', [Validators.required]],
      isbn: [
        '',
        [
          Validators.pattern(
            /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
          )
        ]
      ],
      publisher: ['', [Validators.required]],
      numPages: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.pattern(/^\$?\d+(\.\d{2})?$/)]],
      cover: [''],
      abstract: ['', [Validators.maxLength(2000)]]
    });
  }

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
      .subscribe(book => {
        if (book) {
          this.book.set(book);
          this.populateForm(book);
          this.loading.set(false);
        }
      });
  }

  private populateForm(book: Book): void {
    this.bookForm.patchValue({
      title: book.title,
      subtitle: book.subtitle || '',
      author: book.author,
      isbn: book.isbn || '',
      publisher: book.publisher,
      numPages: book.numPages,
      price: book.price,
      cover: book.cover || '',
      abstract: book.abstract || ''
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid && this.book()) {
      this.saving.set(true);

      const updatedBook: Book = {
        ...this.book()!,
        ...this.bookForm.value
      };

      this.bookApiClient
        .updateBook(this.book()!.id, updatedBook)
        .pipe(
          catchError(error => {
            console.error('Error updating book:', error);
            this.toastService.show('Failed to update book. Please try again.', 5000);
            this.saving.set(false);
            return of(null);
          })
        )
        .subscribe(updatedBook => {
          if (updatedBook) {
            this.toastService.show('Book updated successfully!', 3000);
            this.router.navigate(['/book', this.book()!.id]);
          }
        });
    }
  }

  goBack(): void {
    if (this.book()) {
      this.router.navigate(['/book', this.book()!.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
