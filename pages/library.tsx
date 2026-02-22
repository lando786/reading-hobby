import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLibrary, LibraryBook } from '@/hooks/useLibrary';
import BookCard from '@/components/BookCard';
import { BookOpen, CheckCircle, List, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import ReviewModal from '@/components/ReviewModal';

type FilterType = 'all' | 'reading' | 'completed' | 'wishlist';

export default function Library() {
    const { library, updateBook, removeBook } = useLibrary();
    const [filter, setFilter] = useState<FilterType>('all');
    const [bookToReview, setBookToReview] = useState<LibraryBook | null>(null);

    const filteredBooks = library.filter(book => {
        if (filter === 'all') return true;
        return book.status === filter;
    });

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'reading', label: 'Reading' },
        { id: 'wishlist', label: 'To Read' },
        { id: 'completed', label: 'Done' },
    ] as const;

    return (
        <Layout title="My Library">
            <div className="flex flex-col gap-6">
                {/* Helper Link */}
                <div className="text-right">
                    <Link href="/search" className="inline-flex items-center gap-2 text-sm font-bold bg-[var(--primary)] text-white px-3 py-1 rounded-full border-2 border-[var(--foreground)] hover:scale-105 transition-transform">
                        <span className="text-lg leading-none">+</span> Add Book
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as FilterType)}
                            className={clsx(
                                "px-4 py-1 rounded-full border-2 border-[var(--foreground)] whitespace-nowrap font-bold text-sm transition-all",
                                filter === tab.id
                                    ? "bg-[var(--foreground)] text-white"
                                    : "bg-white hover:bg-gray-100"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Book List */}
                <div className="flex flex-col gap-4">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map(book => (
                            <div key={book.key} className="relative group">
                                <BookCard
                                    book={book}
                                    onReviewClick={() => setBookToReview(book)}
                                />

                                {/* Quick Actions Overlay (visible on hover/focus or always present on mobile?) 
                             Let's make them always visible but subtle, or put them in the card content.
                             Actually, let's put simple actions below the card or integrated.
                         */}
                                <div className="flex justify-end gap-2 mt-2 px-2">
                                    {book.status !== 'reading' && book.status !== 'completed' && (
                                        <button
                                            onClick={() => updateBook(book.key, { status: 'reading', dateStarted: new Date().toISOString() })}
                                            className="text-xs font-bold text-[var(--secondary)] hover:underline"
                                        >
                                            Start Reading
                                        </button>
                                    )}
                                    {book.status === 'reading' && (
                                        <button
                                            onClick={() => {
                                                updateBook(book.key, { status: 'completed', dateFinished: new Date().toISOString() });
                                                setBookToReview(book);
                                            }}
                                            className="text-xs font-bold text-green-600 hover:underline"
                                        >
                                            Mark Done
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeBook(book.key)}
                                        className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                                    >
                                        <Trash2 size={12} /> Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <p>No books here yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {bookToReview && (
                <ReviewModal
                    book={bookToReview}
                    isOpen={true}
                    onClose={() => setBookToReview(null)}
                    onSubmit={(data) => {
                        updateBook(bookToReview.key, data);
                        setBookToReview(null);
                    }}
                />
            )}
        </Layout>
    );
}
