import { Book, getCoverUrl } from '@/lib/openlibrary';
import { LibraryBook } from '@/hooks/useLibrary';
import { Plus, Check, Star } from 'lucide-react';
import { useState } from 'react';

interface BookCardProps {
    book: Book | LibraryBook;
    onAdd?: (book: Book) => void;
    isAdded?: boolean;
    onReviewClick?: () => void;
}

export default function BookCard({ book, onAdd, isAdded = false, onReviewClick }: BookCardProps) {
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

                <div className="flex flex-col gap-2">
                    {book.number_of_pages_median && (
                        <div>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-300 inline-block">
                                {book.number_of_pages_median} pages
                            </span>
                        </div>
                    )}

                    {/* Review Section */}
                    {'status' in book && book.status === 'completed' && (
                        <div className="mt-1">
                            {book.rating ? (
                                <div className="flex flex-col gap-1">
                                    <div className="flex text-[#FFD700]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                fill={i < (book.rating || 0) ? "currentColor" : "transparent"}
                                                color={i < (book.rating || 0) ? "#FF8C00" : "var(--foreground)"}
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </div>
                                    {book.review && (
                                        <p className="text-xs text-gray-600 italic line-clamp-2 border-l-2 border-gray-300 pl-2">
                                            "{book.review}"
                                        </p>
                                    )}
                                </div>
                            ) : (
                                onReviewClick && (
                                    <button
                                        onClick={onReviewClick}
                                        className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mt-1"
                                    >
                                        <Star size={12} strokeWidth={2} /> Leave a Review
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
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
