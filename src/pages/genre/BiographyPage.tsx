import { UserCircle } from 'lucide-react';
import BookListPage from '../BookListPage';

export function BiographyPage() {
  return (
    <BookListPage title="Biography" subtitle="Real lives, real journeys, real inspiration" icon={UserCircle} category="biography" />
  );
}
