import { Tag } from 'lucide-react';
import BookListPage from '../BookListPage';

export function OnSalePage() {
  return (
    <BookListPage
      title="On Sale"
      subtitle="Great books at even greater prices — limited time only"
      icon={Tag}
      filterFn={b => Boolean(b.isSale || (b as any).is_sale || (b.originalPrice && b.originalPrice > b.price))}
      sortFn={(a, b) => (b.id || 0) - (a.id || 0)}
    />
  );
}
