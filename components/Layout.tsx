import Head from 'next/head';
import BottomNav from './BottomNav';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function Layout({ children, title = "Read Quest" }: LayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>

            <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto relative">
                <header className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-wide text-[var(--foreground)] drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                        {title}
                    </h1>
                </header>

                <main>
                    {children}
                </main>

                <BottomNav />
            </div>
        </>
    );
}
