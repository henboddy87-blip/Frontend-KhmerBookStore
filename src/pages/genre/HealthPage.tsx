import { Heart } from 'lucide-react';
import BookListPage from '../BookListPage';

export function HealthPage() {
  return (
    <BookListPage title="Health & Wellness" subtitle="Mind, body, and spirit — live your best life" icon={Heart} category="health" />
  );
}
