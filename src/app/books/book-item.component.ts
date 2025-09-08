import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from './book';

@Component({
  selector: 'app-book-item',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [routerLink]="['/book', book().id]"
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
    >
      <div class="relative aspect-[3/4] overflow-hidden">
        @if (book().cover) {
          <img [src]="book().cover" [alt]="book().title" class="w-full h-full object-contain bg-gray-100" />
        }
        @if (!book().cover) {
          <div class="w-full h-full bg-gray-100 flex items-center justify-center">
            <span class="text-gray-500 text-sm font-medium">No cover available</span>
          </div>
        }
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h2 class="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{{ book().title }}</h2>
        @if (book().subtitle) {
          <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ book().subtitle }}</p>
        }
        <div class="text-sm text-gray-700 mt-auto">
          <p>
            <span class="text-blue-700">{{ book().author }}</span>
          </p>
          @if (book().isbn) {
            <p class="text-xs text-gray-500 mt-2">ISBN: {{ book().isbn }}</p>
          }
        </div>
      </div>
    </a>
  `
})
export class BookItemComponent {
  book = input.required<Book>();
}
