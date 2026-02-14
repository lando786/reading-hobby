import Layout from '@/components/Layout';
import { useUser } from '@/contexts/UserContext';
import { useLibrary } from '@/hooks/useLibrary';
import UserLevel from '@/components/UserLevel';
import { Trash2, ShieldAlert, LogOut } from 'lucide-react';
import { useSession, signOut, signIn } from 'next-auth/react';

export default function Profile() {
    const { stats } = useUser();
    const { library } = useLibrary();
    const { data: session } = useSession();

    const booksRead = library.filter(b => b.status === 'completed').length;
    const totalPagesRead = library.reduce((acc, book) => acc + book.currentPage, 0);

    const handleReset = () => {
        if (confirm("Are you sure? This will wipe all your progress!")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <Layout title="Profile">
            <div className="flex flex-col gap-8">
                <UserLevel />

                <div className="grid grid-cols-2 gap-4">
                    <div className="sketchy-box p-4 text-center">
                        <div className="text-2xl font-bold">{booksRead}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Books Read</div>
                    </div>
                    <div className="sketchy-box p-4 text-center">
                        <div className="text-2xl font-bold">{totalPagesRead}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Pages Read</div>
                    </div>
                    <div className="sketchy-box p-4 text-center">
                        <div className="text-2xl font-bold">{stats.streak}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Day Streak</div>
                    </div>
                    <div className="sketchy-box p-4 text-center">
                        <div className="text-2xl font-bold">{Math.floor(stats.xp)}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Total XP</div>
                    </div>
                </div>

                <div className="mt-8 border-t-2 border-[var(--foreground)] pt-6 flex flex-col gap-4">
                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="w-full p-4 border-2 border-[var(--foreground)] font-bold rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            <LogOut /> Sign Out
                        </button>
                    ) : (
                        <button
                            onClick={() => signIn('google')}
                            className="w-full p-4 border-2 border-[var(--foreground)] font-bold rounded-lg bg-[var(--accent)] text-white flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <LogOut className="rotate-180" /> Sign In with Google
                        </button>
                    )}

                    <div className="pt-4">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <ShieldAlert className="text-red-500" /> Danger Zone
                        </h3>
                        <button
                            onClick={handleReset}
                            className="w-full p-4 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
                        >
                            <Trash2 /> Reset All Data
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
