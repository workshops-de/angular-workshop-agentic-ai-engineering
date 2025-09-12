import { Injectable } from '@angular/core';
import { Book } from '../core/book';
import { BookHighlight } from './book-highlight';

@Injectable({
  providedIn: 'root'
})
export class BookHighlightService {
  enhanceBookWithMockData(book: Book): BookHighlight {
    // Generate consistent mock data based on book ID
    const seed = this.hashCode(book.id);
    const random = this.seededRandom(seed);

    // Generate rating (3.5 to 5.0)
    const rating = Math.round((3.5 + random() * 1.5) * 2) / 2;

    // Generate review count (5 to 500)
    const reviewCount = Math.floor(5 + random() * 495);

    // Determine if new or bestseller
    const isNew = random() > 0.7;
    const isBestseller = !isNew && random() > 0.6;

    // Determine badge
    let badge: string | undefined;
    if (isNew) badge = 'Neu';
    else if (isBestseller) badge = 'Vorbesteller';
    else {
      const badges = ['Band 1', 'Band 2', 'Band 3', 'Band 10'];
      badge = random() > 0.5 ? badges[Math.floor(random() * badges.length)] : undefined;
    }

    return {
      ...book,
      rating,
      reviewCount,
      isNew,
      isBestseller,
      badge
    };
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }
}
