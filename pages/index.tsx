import Layout from "@/components/Layout";
import CurrentRead from "@/components/CurrentRead";
import DailyQuests from "@/components/DailyQuests";
import UserLevel from "@/components/UserLevel";
import Link from 'next/link';

export default function Home() {
  return (
    <Layout title="Read Quest">
      <div className="flex flex-col gap-8">
        <UserLevel />

        <section>
          <div className="flex justify-between items-end mb-2 px-1">
            <h3 className="font-bold text-xl transform -rotate-1">Current Quest</h3>
            <Link href="/library" className="text-xs font-bold underline decoration-2 decoration-[var(--primary)]">View Library</Link>
          </div>
          <CurrentRead />
        </section>

        <section>
          <DailyQuests />
        </section>
      </div>
    </Layout>
  );
}
