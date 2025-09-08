import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Book, BookStatus } from './book';
import { BookApiClient } from './book-api-client.service';

export interface KanbanState {
  books: Book[];
  filterTerm: string;
}

@Injectable({ providedIn: 'root' })
export class KanbanService {
  private readonly bookApiClient = inject(BookApiClient);
  private readonly storageKey = 'book-kanban-state';

  // State management with signals
  private readonly state = signal<KanbanState>({
    books: [],
    filterTerm: ''
  });

  // Getters for state properties
  readonly books = computed(() => this.state().books);
  readonly filterTerm = computed(() => this.state().filterTerm);

  // Computed signals for filtered books by status
  readonly unreadBooks = computed(() => this.filterBooks(this.books(), BookStatus.Unread));

  readonly backlogBooks = computed(() => this.filterBooks(this.books(), BookStatus.Backlog));

  readonly readBooks = computed(() => this.filterBooks(this.books(), BookStatus.Read));

  constructor() {
    this.loadFromLocalStorage();
  }

  async loadBooks(): Promise<void> {
    try {
      // Get books from API
      const apiBooks = await firstValueFrom(this.bookApiClient.getBooks(100));

      // Merge with local status data
      const mergedBooks = this.mergeWithLocalStatus(apiBooks);

      // Update state
      this.updateState({ books: mergedBooks });

      // Save to localStorage
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Failed to load books', error);
    }
  }

  setFilter(filterTerm: string): void {
    this.updateState({ filterTerm });
  }

  updateBookStatus(bookId: string, status: BookStatus): void {
    this.updateState({
      books: this.books().map(book => (book.id === bookId ? { ...book, status } : book))
    });
    this.saveToLocalStorage();
  }

  private filterBooks(books: Book[], status: BookStatus): Book[] {
    const term = this.filterTerm().toLowerCase();
    return books.filter(book => {
      const matchesStatus = book.status === status || (!book.status && status === BookStatus.Unread); // Default status is Unread
      const matchesFilter = !term || book.title.toLowerCase().includes(term);
      return matchesStatus && matchesFilter;
    });
  }

  private mergeWithLocalStatus(apiBooks: Book[]): Book[] {
    // Get stored book statuses from localStorage
    const storedState = this.loadFromLocalStorage();
    const statusMap = new Map<string, BookStatus>();

    // Create a map of book IDs to their statuses
    if (storedState?.books) {
      storedState.books.forEach(book => {
        if (book.status) {
          statusMap.set(book.id, book.status);
        }
      });
    }

    // Apply stored statuses to API books
    return apiBooks.map(book => ({
      ...book,
      status: statusMap.get(book.id) || BookStatus.Unread
    }));
  }

  private updateState(partialState: Partial<KanbanState>): void {
    this.state.update(state => ({
      ...state,
      ...partialState
    }));
  }

  private saveToLocalStorage(): void {
    try {
      // Only save minimal data needed for persistence (book IDs and their statuses)
      const minimalData = {
        books: this.books().map(book => ({
          id: book.id,
          status: book.status || BookStatus.Unread
        }))
      };
      localStorage.setItem(this.storageKey, JSON.stringify(minimalData));
    } catch (error) {
      console.error('Failed to save kanban state to localStorage', error);
    }
  }

  private loadFromLocalStorage(): Partial<KanbanState> | null {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        return JSON.parse(storedData) as Partial<KanbanState>;
      }
    } catch (error) {
      console.error('Failed to load kanban state from localStorage', error);
    }
    return null;
  }
}
