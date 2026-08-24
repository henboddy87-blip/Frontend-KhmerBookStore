import { Medal } from 'lucide-react';
import BookListPage from '../BookListPage';

export function AwardWinnersPage() {
  return (
    <BookListPage
      title="Award Winners"
      subtitle="Critically acclaimed titles that have won prestigious literary awards"
      icon={Medal}
      filterFn={b => Boolean(b.isTopRated || (b as any).is_top_rated)}
      sortFn={(a, b) => (b.rating || 0) - (a.rating || 0)}
    />
  );
}
