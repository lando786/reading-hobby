import Layout from '@/components/Layout';
import { useUser } from '@/contexts/UserContext';
import { useLibrary } from '@/hooks/useLibrary';
import UserLevel from '@/components/UserLevel';
import { Trash2, ShieldAlert } from 'lucide-react';

export default function Profile() {
    const { stats } = useUser();
    const { library } = useLibrary();

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

                <div className="mt-8 border-t-2 border-[var(--foreground)] pt-6">
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
        </Layout>
    );
}
