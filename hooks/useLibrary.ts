import { useState, useEffect } from 'react';
import { Book } from '@/lib/openlibrary';

export interface LibraryBook extends Book {
    status: 'reading' | 'completed' | 'wishlist';
    currentPage: number;
    totalPages: number;
    dateStarted?: string;
    dateFinished?: string;
    addedAt: string;
    rating?: number;
    review?: string;
}

const STORAGE_KEY = 'reading-hobby-library';

export function useLibrary() {
    const [library, setLibrary] = useState<LibraryBook[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setLibrary(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse library', e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
        }
    }, [library, isLoaded]);

    const addBook = (book: Book, status: LibraryBook['status'] = 'wishlist') => {
        if (library.some(b => b.key === book.key)) return; // Prevent duplicates

        const newBook: LibraryBook = {
            ...book,
            status,
            currentPage: 0,
            totalPages: book.number_of_pages_median || 300, // Default if not found
            addedAt: new Date().toISOString(),
        };

        setLibrary(prev => [newBook, ...prev]);
    };

    const removeBook = (key: string) => {
        setLibrary(prev => prev.filter(b => b.key !== key));
    };

    const updateBook = (key: string, updates: Partial<LibraryBook>) => {
        setLibrary(prev => prev.map(b => b.key === key ? { ...b, ...updates } : b));
    };

    const getBook = (key: string) => library.find(b => b.key === key);

    return { library, addBook, removeBook, updateBook, getBook, isLoaded };
}
