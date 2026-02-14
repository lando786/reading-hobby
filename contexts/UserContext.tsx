import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { useSession } from 'next-auth/react';

export interface UserStats {
    xp: number;
    level: number;
    streak: number;
    lastReadDate: string | null;
    dailyQuests: {
        read20Pages: boolean;
        read20Mins: boolean;
        finishChapter: boolean;
    };
    pagesReadToday: number;
    lastQuestReset: string | null;
}

interface UserContextType {
    stats: UserStats;
    addXP: (amount: number) => void;
    logPages: (amount: number) => void;
    updateStreak: () => void; // Keep for manual triggers if needed, but logPages handles it too
    completeQuest: (quest: keyof UserStats['dailyQuests']) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'reading-hobby-user';

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<UserStats>({
        xp: 0,
        level: 1,
        streak: 0,
        lastReadDate: null,
        dailyQuests: {
            read20Pages: false,
            read20Mins: false,
            finishChapter: false,
        },
        pagesReadToday: 0,
        lastQuestReset: null,
    });

    const [isLoaded, setIsLoaded] = useState(false);

    // Load
    useEffect(() => {
        const loadStats = async () => {
            if (status === 'authenticated') {
                try {
                    const res = await fetch('/api/stats');
                    const data = await res.json();
                    if (data && data.userId) {
                        setStats({
                            xp: data.xp,
                            level: data.level,
                            streak: data.streak,
                            lastReadDate: data.lastReadDate,
                            dailyQuests: {
                                read20Pages: data.read20Pages,
                                read20Mins: data.read20Mins,
                                finishChapter: data.finishChapter,
                            },
                            pagesReadToday: data.pagesReadToday,
                            lastQuestReset: data.lastQuestReset,
                        });
                    }
                } catch (error) {
                    console.error("Failed to load stats from DB", error);
                }
            } else if (status === 'unauthenticated') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setStats(JSON.parse(stored));
                }
            }
            setIsLoaded(true);
        };

        if (status !== 'loading') {
            loadStats();
        }
    }, [status]);

    // Save
    useEffect(() => {
        if (!isLoaded) return;

        if (status === 'authenticated') {
            fetch('/api/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stats),
            }).catch(err => console.error("Failed to save stats to DB", err));
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
        }
    }, [stats, isLoaded, status]);

    // Daily Reset
    useEffect(() => {
        if (!isLoaded) return;
        const today = new Date().toDateString();
        if (stats.lastQuestReset !== today) {
            setStats(prev => ({
                ...prev,
                dailyQuests: { read20Pages: false, read20Mins: false, finishChapter: false },
                pagesReadToday: 0,
                lastQuestReset: today
            }));
        }
    }, [isLoaded, stats.lastQuestReset]);

    const addXP = (amount: number) => {
        setStats(prev => {
            const newXP = prev.xp + amount;

            // Level Formula: Level N requires 100 * N^1.5
            // Check if we leveled up
            let level = 1;
            while (newXP >= 100 * Math.pow(level, 1.5)) {
                level++;
            }

            if (level > prev.level) {
                // Level Up!
                confetti({
                    particleCount: 150,
                    spread: 60,
                    colors: ['#FFD700', '#FFA500']
                });
            }

            return { ...prev, xp: newXP, level };
        });
    };

    const completeQuest = (quest: keyof UserStats['dailyQuests']) => {
        if (stats.dailyQuests[quest]) return;

        setStats(prev => ({
            ...prev,
            dailyQuests: { ...prev.dailyQuests, [quest]: true }
        }));
        addXP(50);

        // Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const updateStreak = () => {
        const today = new Date().toDateString();
        if (stats.lastReadDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        setStats(prev => {
            let newStreak = prev.streak;
            if (prev.lastReadDate === yesterday.toDateString()) {
                newStreak += 1;
            } else if (prev.lastReadDate !== today) {
                newStreak = 1;
            }
            return { ...prev, streak: newStreak, lastReadDate: today };
        });
    };

    const logPages = (amount: number) => {
        addXP(amount * 2);
        updateStreak();

        setStats(prev => {
            const newTotal = prev.pagesReadToday + amount;
            if (newTotal >= 20 && !prev.dailyQuests.read20Pages) {
                // We can't call completeQuest here because setStats is synchronous-ish inside the reducer? 
                // Better to just update the state directly here to avoid race conditions or double renders.
                // Actually, let's just trigger the completion effect separate or duplicate logic?
                // Duplicating logic is safest for a single state update.

                // Side effect for confetti? We can do it after.
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }, 100);

                return {
                    ...prev,
                    pagesReadToday: newTotal,
                    xp: prev.xp + 50, // Bonus XP
                    dailyQuests: { ...prev.dailyQuests, read20Pages: true }
                };
            }
            return { ...prev, pagesReadToday: newTotal };
        });
    };

    return (
        <UserContext.Provider value={{ stats, addXP, logPages, updateStreak, completeQuest }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
