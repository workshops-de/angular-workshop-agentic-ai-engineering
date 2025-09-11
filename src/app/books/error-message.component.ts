import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-message',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
      <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ title() }}</h2>
      <p class="text-gray-600 mb-6">{{ message() }}</p>
      <a
        [routerLink]="backLink()"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
      >
        {{ backLabel() }}
      </a>
    </div>
  `
})
export class ErrorMessageComponent {
  title = input('Book Not Found');
  message = input("The book you're looking for doesn't exist or has been removed.");
  backLink = input('/');
  backLabel = input('Back to Books');
}
