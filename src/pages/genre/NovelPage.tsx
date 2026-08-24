import { Library } from 'lucide-react';
import BookListPage from '../BookListPage';

export function NovelPage() {
  return (
    <BookListPage title="Novels" subtitle="Immersive long-form stories across every theme" icon={Library} category="novel" />
  );
}
