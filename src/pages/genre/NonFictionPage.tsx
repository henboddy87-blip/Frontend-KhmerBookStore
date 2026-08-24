import { Microscope } from 'lucide-react';
import BookListPage from '../BookListPage';

export function NonFictionPage() {
  return (
    <BookListPage title="Non-Fiction" subtitle="Knowledge, discovery, and true stories" icon={Microscope} category="non-fiction" />
  );
}
