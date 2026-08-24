import { Coins } from 'lucide-react';
import BookListPage from '../BookListPage';

export function FinancePage() {
  return (
    <BookListPage title="Finance" subtitle="Build wealth, invest wisely, and secure your future" icon={Coins} category="finance" />
  );
}
