import { Book } from '../core/book';

export interface BookHighlight extends Book {
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  badge?: string;
}
