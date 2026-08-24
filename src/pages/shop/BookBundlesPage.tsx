import { Package } from 'lucide-react';
import BookListPage from '../BookListPage';

export function BookBundlesPage() {
  return (
    <BookListPage
      title="Book Bundles"
      subtitle="Curated sets of books handpicked to go perfectly together"
      icon={Package}
      filterFn={b => b.tags?.some(t => ['bundle', 'series', 'set', 'collection'].includes(t.toLowerCase()))}
    />
  );
}
