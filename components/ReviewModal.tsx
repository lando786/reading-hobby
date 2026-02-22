import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { LibraryBook } from '@/hooks/useLibrary';

export interface ReviewData {
    rating: number;
    review: string;
}

interface ReviewModalProps {
    book: LibraryBook;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ReviewData) => void;
}

export default function ReviewModal({ book, isOpen, onClose, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');

    // Reset when opened with a new book
    useEffect(() => {
        if (isOpen) {
            setRating(book.rating || 0);
            setReview(book.review || '');
        }
    }, [isOpen, book]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ rating, review });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="sketchy-box bg-white w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-2">Quest Completed!</h2>
                <p className="text-gray-600 mb-6 font-medium">
                    You finished <span className="text-black font-bold">"{book.title}"</span>. What did you think?
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-2">
                        <label className="font-bold text-sm">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    <Star
                                        size={32}
                                        fill={(hover || rating) >= star ? '#FFD700' : 'transparent'}
                                        color={(hover || rating) >= star ? '#FF8C00' : 'var(--foreground)'}
                                        strokeWidth={2}
                                        className="drop-shadow-sm"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="review" className="font-bold text-sm">Short Review (Optional)</label>
                        <textarea
                            id="review"
                            rows={4}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full p-3 border-2 border-[var(--foreground)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 font-bold text-gray-500 hover:text-black transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            className="bg-[var(--primary)] text-white px-6 py-2 rounded-full font-bold border-2 border-[var(--foreground)] shadow-[2px_2px_0_rgba(0,0,0,0.2)] hover:scale-105 transition-transform"
                        >
                            Save Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
