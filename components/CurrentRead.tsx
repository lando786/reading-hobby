import { useState } from 'react';
import { useLibrary } from '@/hooks/useLibrary';
import { useUser } from '@/contexts/UserContext';
import ProgressBar from './ProgressBar';
import Link from 'next/link';
import { getCoverUrl } from '@/lib/openlibrary';
import { CheckCircle2, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CurrentRead() {
    const { library, updateBook } = useLibrary();
    const { logPages } = useUser();
    const currentBook = library.find(b => b.status === 'reading');
    const [pagesToAdd, setPagesToAdd] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    if (!currentBook) {
        return (
            <div className="sketchy-box p-8 text-center flex flex-col items-center gap-4">
                <h2 className="text-xl font-bold">No Active Quest!</h2>
                <p className="text-gray-600">Start reading a book to begin your journey.</p>
                <Link
                    href="/search"
                    className="bg-[var(--primary)] text-white px-6 py-2 rounded-full font-bold border-2 border-[var(--foreground)] shadow-[2px_2px_0_rgba(0,0,0,0.2)] hover:scale-105 transition-transform"
                >
                    Find a Book
                </Link>
            </div>
        );
    }

    const handleLog = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(pagesToAdd);
        if (!amount || amount <= 0) return;

        const newPage = Math.min(currentBook.totalPages, currentBook.currentPage + amount);
        const isFinished = newPage >= currentBook.totalPages;

        // Animate
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);

        updateBook(currentBook.key, {
            currentPage: newPage,
            status: isFinished ? 'completed' : 'reading',
            dateFinished: isFinished ? new Date().toISOString() : undefined
        });

        // Gamification via Context
        logPages(amount);

        if (isFinished) {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FF6B6B', '#4ECDC4', '#FFE66D']
            });
        }

        setPagesToAdd('');
    };

    const coverUrl = getCoverUrl(currentBook.cover_i, 'M');

    return (
        <div className="sketchy-box p-5 bg-white relative overflow-hidden">
            <div className="flex gap-4 mb-4">
                <div className="w-20 h-28 flex-shrink-0 border-2 border-[var(--foreground)] rounded overflow-hidden">
                    <img src={coverUrl} alt={currentBook.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h2 className="font-bold text-lg leading-tight line-clamp-2">{currentBook.title}</h2>
                        <div className="flex items-center text-orange-500 font-bold text-xs gap-1">
                            <Flame size={14} fill="currentColor" />
                            <span>streak</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{currentBook.author_name?.[0]}</p>
                    <ProgressBar current={currentBook.currentPage} total={currentBook.totalPages} />
                </div>
            </div>

            <form onSubmit={handleLog} className="flex gap-2 items-center">
                <label className="text-sm font-bold">Read</label>
                <input
                    type="number"
                    value={pagesToAdd}
                    onChange={(e) => setPagesToAdd(e.target.value)}
                    className="w-16 p-1 border-2 border-[var(--foreground)] rounded text-center"
                    placeholder="0"
                />
                <span className="text-sm font-bold">pages today?</span>
                <button
                    type="submit"
                    className={`
                ml-auto px-4 py-1 bg-[var(--secondary)] text-white font-bold rounded-lg border-2 border-[var(--foreground)]
                ${isAnimating ? 'animate-bounce' : 'hover:scale-105'} transition-all
            `}
                >
                    Log
                </button>
            </form>
        </div>
    );
}
