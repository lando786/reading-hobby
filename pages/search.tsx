import { useState } from 'react';
import Layout from '@/components/Layout';
import { searchBooks, Book } from '@/lib/openlibrary';
import BookCard from '@/components/BookCard';
import { useLibrary } from '@/hooks/useLibrary';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const { library, addBook } = useLibrary();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        const books = await searchBooks(query);
        setResults(books);
        setLoading(false);
    };

    const isInLibrary = (key: string) => library.some(b => b.key === key);

    return (
        <Layout title="Find Books">
            <div className="flex flex-col gap-6">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title or author..."
                        className="w-full p-4 pl-12 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[var(--foreground)] focus:outline-none focus:ring-2 ring-[var(--primary)] text-lg"
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-[var(--primary)] text-white px-4 rounded-xl font-bold hover:scale-105 transition-transform"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Go'}
                    </button>
                </form>

                {/* Results */}
                <div className="flex flex-col gap-4">
                    {results.length > 0 ? (
                        results.map((book) => (
                            <BookCard
                                key={book.key}
                                book={book}
                                onAdd={(b) => addBook(b, 'reading')}
                                isAdded={isInLibrary(book.key)}
                            />
                        ))
                    ) : (
                        !loading && hasSearched && results.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <p className="text-xl">No books found.</p>
                                <p>Try a different search?</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </Layout>
    );
}
