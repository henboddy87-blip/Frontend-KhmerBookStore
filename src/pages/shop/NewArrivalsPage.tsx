import { Sparkles } from 'lucide-react';
import BookListPage from '../BookListPage';

export function NewArrivalsPage() {
  return (
    <BookListPage
      title="New Arrivals"
      subtitle="The latest titles freshly added to our shelves"
      icon={Sparkles}
      filterFn={b => Boolean(b.isNew || (b as any).is_new)}
    />
  );
}
