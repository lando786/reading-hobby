export interface Book {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    number_of_pages_median?: number;
    first_publish_year?: number;
}

export interface SearchResult {
    numFound: number;
    docs: Book[];
}

const BASE_URL = 'https://openlibrary.org/search.json';

export async function searchBooks(query: string, limit = 20): Promise<Book[]> {
    if (!query) return [];

    try {
        const fields = 'key,title,author_name,cover_i,number_of_pages_median,first_publish_year';
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&fields=${fields}&limit=${limit}`);

        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }

        const data: SearchResult = await response.json();
        return data.docs;
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
}

export function getCoverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string {
    if (!coverId) return '/placeholder-book.png'; // We'll need a placeholder
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}
