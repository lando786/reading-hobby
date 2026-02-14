import { useSession, signOut, signIn } from 'next-auth/react';
import Layout from '@/components/Layout';
import UserLevel from '@/components/UserLevel';
import UserSelector from '@/components/UserSelector';
import { LogOut, Mail, Trash2, ShieldAlert } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function Profile() {
    const { data: session, status } = useSession();
    const { stats } = useUser();

    const handleReset = () => {
        if (confirm("Are you sure? This will wipe all your progress!")) {
            localStorage.clear();
            // If we are logged in, we should probably add an API to reset DB stats too, 
            // but for now let's just refresh.
            window.location.reload();
        }
    };

    return (
        <Layout title="Your Profile">
            <div className="max-w-2xl mx-auto space-y-8 pb-12">
                {status === 'authenticated' ? (
                    <>
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border-2 border-black/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <UserLevel hideDetails />
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                <UserLevel hideXp />
                                <div className="pt-4">
                                    <h1 className="text-3xl font-bold text-gray-800">{session.user?.name}</h1>
                                    <p className="text-gray-500">{session.user?.email || 'Local Profile'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 font-bold hover:bg-red-100 transition-all active:scale-[0.98]"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>

                            <div className="p-6 bg-red-50/50 rounded-2xl border-2 border-dashed border-red-200">
                                <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5" /> Danger Zone
                                </h3>
                                <button
                                    onClick={handleReset}
                                    className="w-full p-3 text-sm flex items-center justify-center gap-2 bg-white text-red-500 border-2 border-red-200 rounded-xl font-bold hover:bg-red-50 transition-all opacity-70 hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" /> Reset Local Browser Data
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-gray-800 italic underline decoration-blue-500 decoration-4 underline-offset-4">Sign In</h1>
                            <p className="text-gray-500">Choose a local profile or use Google to save your progress.</p>
                        </div>

                        <UserSelector />

                        <div className="flex flex-col gap-3 max-w-md mx-auto">
                            <div className="relative flex py-5 items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <button
                                onClick={() => signIn('google', { callbackUrl: '/profile' })}
                                className="flex items-center justify-center gap-4 p-4 bg-white text-gray-800 rounded-2xl border-2 border-black/10 font-bold hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm"
                            >
                                <Mail className="w-5 h-5 text-red-500" />
                                Sign In with Google
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
