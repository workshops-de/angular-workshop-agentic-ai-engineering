import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-indication',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-center items-center py-20">
      <div class="animate-pulse flex flex-col items-center">
        <div
          class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
        ></div>
        <p class="mt-4 text-gray-600">Loading book details...</p>
      </div>
    </div>
  `
})
export class LoadingIndicationComponent {}
