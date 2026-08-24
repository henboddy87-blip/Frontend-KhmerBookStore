import { Library } from 'lucide-react';
import BookListPage from '../BookListPage';

export function AllBooksPage() {
  return (
    <BookListPage
      title="All Books"
      subtitle="Browse our complete collection of over 10,000 titles"
      icon={Library}
    />
  );
}
