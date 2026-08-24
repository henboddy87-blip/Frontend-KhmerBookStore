import { Trophy } from 'lucide-react';
import BookListPage from '../BookListPage';

export function BestsellersPage() {
  return (
    <BookListPage
      title="Bestsellers"
      subtitle="Our most popular books loved by thousands of readers"
      icon={Trophy}
      filterFn={b => Boolean(b.isBestseller || (b as any).is_bestseller)}
      sortFn={(a, b) => (b.reviews || 0) - (a.reviews || 0)}
    />
  );
}
