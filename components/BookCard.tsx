import { Book, getCoverUrl } from '@/lib/openlibrary';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';

interface BookCardProps {
    book: Book;
    onAdd?: (book: Book) => void;
    isAdded?: boolean;
}

export default function BookCard({ book, onAdd, isAdded = false }: BookCardProps) {
    const [imgError, setImgError] = useState(false);
    const coverUrl = book.cover_i ? getCoverUrl(book.cover_i, 'M') : null;

    return (
        <div className="sketchy-box p-4 flex gap-4 items-start transition-transform hover:scale-[1.02]">
            {/* Cover */}
            <div className="w-16 h-24 flex-shrink-0 bg-gray-200 rounded border-2 border-[var(--foreground)] overflow-hidden">
                {coverUrl && !imgError ? (
                    <img
                        src={coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--accent)] text-xs text-center p-1 font-bold">
                        {book.title.slice(0, 20)}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author_name?.join(', ') || 'Unknown Author'}</p>

                {book.number_of_pages_median && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-300">
                        {book.number_of_pages_median} pages
                    </span>
                )}
            </div>

            {/* Action */}
            {onAdd && (
                <button
                    onClick={() => !isAdded && onAdd(book)}
                    disabled={isAdded}
                    className={`
            w-10 h-10 flex items-center justify-center rounded-full border-2 border-[var(--foreground)]
            ${isAdded ? 'bg-[var(--secondary)] text-white' : 'bg-white hover:bg-[var(--primary)] hover:text-white'}
            transition-colors
          `}
                >
                    {isAdded ? <Check size={20} /> : <Plus size={20} />}
                </button>
            )}
        </div>
    );
}
