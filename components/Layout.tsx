import Head from 'next/head';
import BottomNav from './BottomNav';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function Layout({ children, title = "Read Quest" }: LayoutProps) {
    const { data: session } = useSession();

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

                    {session ? (
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="sketchy-box p-2 flex items-center gap-2 text-sm font-bold bg-white"
                            title="Sign Out"
                        >
                            {session.user?.image ? (
                                <img src={session.user.image} alt="" className="w-6 h-6 rounded-full border border-[var(--foreground)]" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                                    {session.user?.name?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <LogOut size={18} />
                        </button>
                    ) : (
                        <a
                            href="/profile"
                            className="sketchy-box p-2 flex items-center gap-2 text-sm font-bold bg-white"
                            title="Sign In"
                        >
                            <LogIn size={18} />
                            Sign In
                        </a>
                    )}
                </header>

                <main>
                    {children}
                </main>

                <BottomNav />
            </div>
        </>
    );
}
