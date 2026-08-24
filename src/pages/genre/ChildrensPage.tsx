import { Baby } from 'lucide-react';
import BookListPage from '../BookListPage';

export function ChildrensPage() {
  return (
    <BookListPage title="Children's Books" subtitle="Magical stories for young readers of all ages" icon={Baby} category="children" />
  );
}
