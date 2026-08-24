import { BookOpen } from 'lucide-react';
import BookListPage from '../BookListPage';

export function KhmerLiteraturePage() {
  return (
    <BookListPage title="Khmer Literature" subtitle="Stories, poetry, and prose from Cambodia" icon={BookOpen} category="khmer-literature" />
  );
}
