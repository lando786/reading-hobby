import Layout from '@/components/Layout';
import DailyQuests from '@/components/DailyQuests';
import { useUser } from '@/contexts/UserContext';
import { useLibrary } from '@/hooks/useLibrary';
import { Award, Lock } from 'lucide-react';
import clsx from 'clsx';

export default function Quests() {
    const { stats } = useUser();
    const { library } = useLibrary();

    const booksRead = library.filter(b => b.status === 'completed').length;
    const totalPages = library.reduce((acc, b) => acc + b.currentPage, 0);

    const achievements = [
        { id: 'first_step', title: 'First Steps', desc: 'Reach Level 2', unlocked: stats.level >= 2, icon: '🌱' },
        { id: 'book_worm', title: 'Book Worm', desc: 'Finish 1 Book', unlocked: booksRead >= 1, icon: '🐛' },
        { id: 'page_turner', title: 'Page Turner', desc: 'Read 100 Pages', unlocked: totalPages >= 100, icon: '📖' },
        { id: 'dedicated', title: 'Dedicated', desc: 'Reach a 3-day streak', unlocked: stats.streak >= 3, icon: '🔥' },
        { id: 'scholar', title: 'Scholar', desc: 'Reach Level 5', unlocked: stats.level >= 5, icon: '🎓' },
    ];

    return (
        <Layout title="Quests">
            <div className="flex flex-col gap-8">
                <DailyQuests />

                <section>
                    <h3 className="font-bold text-xl mb-4 transform -rotate-1 border-b-2 border-[var(--primary)] inline-block">Achievements</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {achievements.map(ach => (
                            <div
                                key={ach.id}
                                className={clsx(
                                    "sketchy-box p-4 flex items-center gap-4 transition-all",
                                    ach.unlocked ? "bg-white" : "bg-gray-100 opacity-70 grayscale"
                                )}
                            >
                                <div className="text-3xl w-12 h-12 flex items-center justify-center border-2 border-[var(--foreground)] rounded-full bg-white">
                                    {ach.unlocked ? ach.icon : <Lock size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold">{ach.title}</h4>
                                    <p className="text-xs text-gray-600">{ach.desc}</p>
                                </div>
                                {ach.unlocked && (
                                    <div className="ml-auto text-yellow-500">
                                        <Award size={24} fill="currentColor" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
}
