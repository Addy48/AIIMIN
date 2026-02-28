import React from 'react';
import Navbar from '../components/Navbar';
import DailyLogForm from '../components/DailyLogForm';

const Dashboard = ({ user }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-1)] pb-16">
            <Navbar />

            <main className="max-w-[1000px] mx-auto px-6 pt-24 flex flex-col gap-10">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold mb-1">{getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}</h1>
                    <p className="text-[var(--text-2)] text-sm">Here is your daily tracker and life operating system.</p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Score', 'Sleep', 'Gym', 'Focus'].map((stat, i) => (
                        <div key={stat} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 flex flex-col">
                            <span className="text-[var(--text-2)] text-xs font-semibold uppercase tracking-wider mb-2">{stat}</span>
                            <span className="text-xl font-bold text-[var(--text-1)]">{['8/8', '7.2h', 'Yes', '2h'][i]}</span>
                        </div>
                    ))}
                </div>

                {/* Daily Log Section */}
                <section>
                    <DailyLogForm user={user} />
                </section>

                {/* Monthly Grid Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-2)] mb-2">Monthly Grid</h2>
                    </div>
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-dashed border-[var(--border)] flex items-center justify-center h-32 text-[var(--text-3)] text-sm">
                        Coming in next build
                    </div>
                </section>

                {/* Weekly Charts Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-2)] mb-2">Weekly Charts</h2>
                    </div>
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-dashed border-[var(--border)] flex items-center justify-center h-32 text-[var(--text-3)] text-sm">
                        Coming in next build
                    </div>
                </section>

                {/* Pomodoro Timer Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-2)] mb-2">Pomodoro Timer</h2>
                    </div>
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-dashed border-[var(--border)] flex items-center justify-center h-32 text-[var(--text-3)] text-sm">
                        Coming in next build
                    </div>
                </section>

                {/* Win Tracker Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-2)] mb-2">Win Tracker</h2>
                    </div>
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 border border-dashed border-[var(--border)] flex items-center justify-center h-32 text-[var(--text-3)] text-sm">
                        Coming in next build
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
