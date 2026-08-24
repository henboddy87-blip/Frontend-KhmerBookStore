import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Cart } from './Cart';
import { Wishlist } from './Wishlist';
import { Checkout } from './Checkout';
import { AuthModal } from './AuthModal';
import { BookDetail } from './BookDetail';
import { Book } from '../types';
import { useStore } from '../context/StoreContext';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { isCheckoutOpen, openCheckout, closeCheckout } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleCheckout = () => {
    setIsCartOpen(false);
    openCheckout();
  };

  const handleSearch = (q: string) => {
    if (q) window.location.href = `/books?search=${encodeURIComponent(q)}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onSearch={handleSearch}
      />

      <main className="flex-1 animate-fade-in">
        {children}
      </main>

      <Footer />

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} onBookClick={setSelectedBook} />
      <Checkout isOpen={isCheckoutOpen} onClose={closeCheckout} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}