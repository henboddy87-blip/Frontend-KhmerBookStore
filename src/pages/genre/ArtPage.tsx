import { Palette } from 'lucide-react';
import BookListPage from '../BookListPage';

export function ArtPage() {
  return (
    <BookListPage title="Arts & Design" subtitle="Creativity, aesthetics, and visual culture" icon={Palette} category="art" />
  );
}
