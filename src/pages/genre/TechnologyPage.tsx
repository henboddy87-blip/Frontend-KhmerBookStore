import { Cpu } from 'lucide-react';
import BookListPage from '../BookListPage';

export function TechnologyPage() {
  return (
    <BookListPage title="Technology" subtitle="Code, systems, and the digital frontier" icon={Cpu} category="technology" />
  );
}
