import { Sprout } from 'lucide-react';
import BookListPage from '../BookListPage';

export function SelfHelpPage() {
  return (
    <BookListPage title="Self-Help" subtitle="Books to help you grow, improve, and thrive" icon={Sprout} category="selfHelp" />
  );
}
