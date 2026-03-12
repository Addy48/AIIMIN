import re

with open('src/pages/Dashboard.jsx', 'r') as f:
    content = f.read()

# The error starts after the welcome section's closing div in the main block.
# We'll split the file at the Welcome section's closing div inside the main tag.
# Actually, the file has a lot of junk from line 319 to the end.
# Let's find the `    return (` at line 285.
# And we will replace EVERYTHING from `    return (` to the end of the file with the correct code.

start_idx = content.find("    return (\n        <div style={{\n            minHeight: '100vh',")
if start_idx != -1:
    correct_return_block = """    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            paddingTop: '52px',
        }}>
            <Navbar user={user} activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="max-w-[780px] mx-auto px-6 pt-9 pb-[100px]">

                {/* Welcome section */}
                <div className="mb-8">
                    <h1 className="text-[28px] font-extrabold text-[var(--text-1)] tracking-[-0.5px] leading-[1.2]">
                        {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                    </h1>
                    <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-2)' }}>Here is your daily tracker and life operating system.</p>

                    <div className="inline-flex items-center gap-[6px] mt-4 px-3 py-[6px] bg-[#22c55e1a] border border-[#22c55e40] rounded-[var(--r-full)] text-[12px] text-[#22c55e] font-medium shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                        <div className="relative flex items-center justify-center w-2 h-2 mr-1">
                            <div className="absolute w-full h-full bg-[#22c55e] rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-2 h-2 bg-[#22c55e] rounded-full"></div>
                        </div>
                        Day tracking active
                    </div>
                </div>

                {/* Stat cards row */}
                {(activeTab === 'log' || activeTab === 'streaks') && (
                    <div className="flex flex-col gap-[10px] mb-9">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-[10px]">
                            {statsData.map((stat, i) => (
                                <StatCard
                                    key={stat.id}
                                    stat={stat}
                                    index={i}
                                    expandedCard={expandedCard}
                                    setExpandedCard={setExpandedCard}
                                />
                            ))}
                        </div>
                        {expandedCard && (
                            <ExpandedStatPanel stat={statsData.find(s => s.id === expandedCard)} />
                        )}
                    </div>
                )}

                {/* Content based on active tab */}
                {activeTab === 'log' && (
                    <>
                        {/* Mood section */}
                        <div className="mb-7 fade-up">
                            <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                Mood
                                <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                            </div>
                            <MoodTracker user={user} onMoodChange={console.log} />
                        </div>

                        {/* Section 1 — Daily Log, Pomodoro */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7 fade-up">
                            <div>
                                <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                    Daily Log
                                    <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                                </div>
                                <DailyLogForm user={user} />
                                <div className="mt-7">
                                    <ResetsTracker user={user} />
                                </div>
                            </div>
                            <div>
                                <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                    Pomodoro Timer
                                    <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                                </div>
                                <PomodoroTimer />
                                <div className="mt-6">
                                    <YouTubeIntegration user={user} />
                                </div>
                            </div>
                        </div>

                        {/* Win Tracker placeholder */}
                        <div className="mb-7 fade-up" style={{ animationDelay: '60ms' }}>
                            <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                Win Tracker
                                <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                            </div>
                            <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border)] rounded-[var(--r-xl)] p-9 flex flex-col items-center justify-center gap-[10px] transition-all duration-[var(--t-base)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]">
                                <div className="text-[28px]">🏆</div>
                                <div className="text-[14px] font-semibold text-[var(--text-2)]">Win Tracker</div>
                                <div className="text-[12px] text-[var(--text-3)] text-center">Daily wins and momentum log</div>
                                <div className="mt-1 px-2.5 py-[3px] bg-[var(--purple-dim)] rounded-[var(--r-full)] text-[11px] text-[var(--purple)] font-medium">Coming soon</div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'streaks' && (
                    <div className="fade-up">
                        <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                            Tracking Chains
                            <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                        </div>
                        <Streaks user={user} />
                    </div>
                )}

                {activeTab === 'money' && (
                    <div className="fade-up">
                        <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                            Financial Ledger
                            <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                        </div>
                        <MoneyManager user={user} />
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="fade-up">
                        <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                            Calendar Sync
                            <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                        </div>
                        <CalendarIntegration user={user} />
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="fade-up">
                        <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                            Custom Export
                            <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                        </div>
                        <Reports user={user} />
                    </div>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
"""
    new_content = content[:start_idx] + correct_return_block
    with open('src/pages/Dashboard.jsx', 'w') as f:
        f.write(new_content)
    print("Fixed Dashboard.jsx successfully!")
else:
    print("Could not find start idx")

