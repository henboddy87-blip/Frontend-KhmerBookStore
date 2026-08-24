import { Book } from 'lucide-react';
import BookListPage from '../BookListPage';

export function FictionPage() {
  return (
    <BookListPage title="Fiction" subtitle="Novels, short stories, and imaginative worlds" icon={Book} category="fiction" />
  );
}
