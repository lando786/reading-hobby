import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { UserPlus, User as UserIcon, Loader2 } from 'lucide-react';

interface User {
    id: string;
    name: string;
    image?: string | null;
}

export default function UserSelector() {
    const [users, setUsers] = useState<User[]>([]);
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsCreating(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim() }),
            });

            if (res.ok) {
                const newUser = await res.json();
                setNewName('');
                await signIn('credentials', { userId: newUser.id, callbackUrl: '/profile' });
            }
        } catch (error) {
            console.error('Failed to create user:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSelectUser = async (userId: string) => {
        await signIn('credentials', { userId, callbackUrl: '/profile' });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-md mx-auto p-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-black/10 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Select Local Profile
            </h2>

            {users.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {users.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleSelectUser(user.id)}
                            className="flex items-center gap-3 p-3 text-left hover:bg-white rounded-xl border border-transparent hover:border-black/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="font-medium">{user.name}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4 italic">No local profiles found.</p>
            )}

            <div className="pt-4 border-t-2 border-dashed border-black/5">
                <form onSubmit={handleCreateUser} className="space-y-3">
                    <label className="text-sm font-bold text-gray-600 ml-1">Create New Profile</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter username..."
                            className="flex-1 px-4 py-2 rounded-xl border-2 border-black/10 focus:border-blue-500 outline-none bg-white transition-colors"
                            disabled={isCreating}
                        />
                        <button
                            type="submit"
                            disabled={isCreating || !newName.trim()}
                            className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-sm"
                            title="Create Profile"
                        >
                            {isCreating ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <UserPlus className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
