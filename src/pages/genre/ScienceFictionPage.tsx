import { Rocket } from 'lucide-react';
import BookListPage from '../BookListPage';

export function ScienceFictionPage() {
  return (
    <BookListPage title="Science Fiction" subtitle="Explore galaxies, futures, and the unknown" icon={Rocket} category="science" />
  );
}
