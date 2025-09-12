import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Book } from './book';

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class BookApiClient {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4730/books';

  getBooks(pageSize: number = 10, searchTerm?: string): Observable<Book[]> {
    let params = new HttpParams().set('_limit', pageSize.toString());

    if (searchTerm) {
      // Search in title and author fields
      params = params.set('q', searchTerm);
    }

    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  getBooksWithPagination(
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string
  ): Observable<PaginatedResponse<Book>> {
    let params = new HttpParams().set('_page', page.toString()).set('_limit', pageSize.toString());

    if (searchTerm) {
      // Search in title and author fields
      params = params.set('q', searchTerm);
    }

    return this.http
      .get<Book[]>(this.apiUrl, {
        params,
        observe: 'response'
      })
      .pipe(
        map((response: HttpResponse<Book[]>) => {
          const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
          const data = response.body || [];
          const totalPages = Math.ceil(totalCount / pageSize);

          return {
            data,
            totalCount,
            currentPage: page,
            pageSize,
            totalPages
          };
        })
      );
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  updateBook(id: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }
}
