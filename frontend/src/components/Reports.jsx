import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import supabase from '../utils/supabase';
const Reports = ({ user }) => {
    // Current local date values for defaults
    const d = new Date();
    const today = d.toLocaleDateString('en-CA');
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toLocaleDateString('en-CA');

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(today);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Fetch logs for the specified range
            const { data: logs, error } = await supabase
                .from('daily_logs')
                .select('*')
                .eq('user_id', user.id)
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: true });

            if (error) throw error;

            console.log("Fetched logs for PDF", logs);

            const doc = new jsPDF();

            // Branding & Header
            doc.setFillColor(245, 166, 35); // Accent color
            doc.rect(0, 0, 210, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text('AIIMIN Performance Report', 14, 20);

            doc.setTextColor(80, 80, 80);
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
            doc.text(`Reporting Period: ${startDate}  —  ${endDate}`, 14, 47);

            // Summary Stats
            const totalLogs = logs?.length || 0;
            const gymDays = logs?.filter(l => l.gym_done).length || 0;
            const sleepAvg = logs?.reduce((acc, curr) => acc + (Number(curr.sleep_hours) || 0), 0) / (totalLogs || 1);

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text('Summary Overview', 14, 65);

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(`• Total Tracked Days: ${totalLogs}`, 14, 75);
            doc.text(`• Gym Sessions: ${gymDays}`, 14, 82);
            doc.text(`• Avg Sleep: ${sleepAvg.toFixed(1)} hrs`, 14, 89);

            // Detailed Table
            if (logs && logs.length > 0) {
                const tableData = logs.map(log => [
                    log.date,
                    log.gym_done ? 'Yes' : 'No',
                    log.sleep_hours ? `${log.sleep_hours}h` : '-',
                    log.steps || '-',
                    log.masturbation_count || 0
                ]);

                doc.autoTable({
                    startY: 105,
                    head: [['Date', 'Gym', 'Sleep', 'Steps', 'RC']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [245, 166, 35] },
                    alternateRowStyles: { fillColor: [250, 247, 242] }
                });
            } else {
                doc.setFontStyle("italic");
                doc.text('No tracking data found for this period.', 14, 105);
            }

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.setTextColor(150);
                doc.text(`AIIMIN Dashboard • Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }

            // Save PDF
            doc.save(`aiimin-report-${startDate}-to-${endDate}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF report.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fade-up flex flex-col gap-6">

            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📉</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-1)' }}>Performance Reports</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', margin: '0 0 32px 0', maxWidth: '300px', marginInline: 'auto', lineHeight: 1.5 }}>
                    Generate a detailed breakdown of your habits, focus cycles, and financial ledger for accountability.
                </p>

                <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '14px', fontFamily: 'inherit' }}
                            />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '14px', fontFamily: 'inherit' }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="hover:scale-[1.02]"
                        style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, var(--accent) 0%, #e05c2a 100%)', color: 'white', fontWeight: 700, fontSize: '15px', cursor: isGenerating ? 'not-allowed' : 'pointer', opacity: isGenerating ? 0.7 : 1, transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(194,120,20,0.2)' }}
                    >
                        {isGenerating ? (
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        )}
                        {isGenerating ? 'Compiling Data...' : 'Download PDF Report'}
                    </button>

                </div>
            </div>

        </div>
    );
};

export default Reports;
