import { useUser } from '@/contexts/UserContext';
import { Flame } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface UserLevelProps {
    hideDetails?: boolean;
    hideXp?: boolean;
}

export default function UserLevel({ hideDetails = false, hideXp = false }: UserLevelProps) {
    const { stats } = useUser();
    const { data: session } = useSession();

    // Level calculations
    const nextLevelXp = 100 * Math.pow(stats.level, 1.5);
    const prevLevelXp = 100 * Math.pow(stats.level - 1, 1.5);
    const levelProgress = ((stats.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

    // Fun titles based on level
    const titles = [
        "Novice Scrawler",
        "Page Turner",
        "Bookworm",
        "Library Lurker",
        "Page Warrior",
        "Chapter Champion",
        "Tome Titan",
        "Literary Legend"
    ];
    const defaultTitle = titles[Math.min(stats.level - 1, titles.length - 1)];
    const displayName = session?.user?.name || defaultTitle;
    const avatarUrl = session?.user?.image || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${stats.level}`;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-[var(--foreground)] bg-white flex items-center justify-center font-bold text-xl relative overflow-hidden shrink-0">
                        <img src={avatarUrl} alt="avatar" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    {!hideDetails && (
                        <div>
                            <h2 className="font-bold text-lg leading-none">LVL {stats.level}: {displayName}</h2>
                            {!hideXp && <div className="text-xs text-gray-600 font-bold">{Math.floor(stats.xp)} / {Math.floor(nextLevelXp)} XP</div>}
                        </div>
                    )}
                </div>

                {!hideDetails && stats.streak > 0 && (
                    <div className="flex flex-col items-center">
                        <Flame className="text-orange-500 animate-pulse" fill="currentColor" size={24} />
                        <span className="text-xs font-bold">{stats.streak} Day Streak!</span>
                    </div>
                )}
            </div>

            {/* XP Bar */}
            {!hideDetails && !hideXp && (
                <div className="w-full h-4 border-2 border-[var(--foreground)] rounded-full bg-white relative overflow-hidden">
                    <div
                        className="h-full bg-[var(--secondary)] border-r-2 border-[var(--foreground)] transition-all duration-500"
                        style={{ width: `${Math.max(5, Math.min(100, levelProgress))}%` }}
                    />
                </div>
            )}
        </div>
    );
}
