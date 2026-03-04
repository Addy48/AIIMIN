import { motion } from 'framer-motion';

const StatCard = ({ stat, index, expandedCard, setExpandedCard }) => {
    const isExpanded = expandedCard === stat.id;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : stat.id); }}
            style={{
                background: isExpanded ? 'var(--bg-elevated)' : 'var(--glass-bg)',
                border: `1px solid ${isExpanded ? 'var(--accent)' : 'var(--color-border)'}`,
                padding: '20px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '140px',
                backdropFilter: 'blur(10px)',
                boxShadow: isExpanded ? '0 12px 32px rgba(0,0,0,0.15)' : 'none',
                position: 'relative',
                overflow: 'hidden'
            }}
            whileHover={{ y: -4, background: 'var(--bg-elevated)', border: '1px solid var(--color-border-lit)' }}
        >
            {isExpanded && (
                <motion.div 
                    layoutId="glow" 
                    style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'radial-gradient(circle at top right, var(--accent-alpha), transparent)', 
                        opacity: 0.5 
                    }} 
                />
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                {stat.context && (
                    <span style={{ 
                        fontSize: '10px', 
                        fontWeight: 800, 
                        color: stat.contextColor || 'var(--accent)',
                        background: `${stat.contextColor || 'var(--accent)'}15`,
                        padding: '2px 8px',
                        borderRadius: '99px',
                        fontFamily: 'var(--font-mono)'
                    }}>
                        {stat.context}
                    </span>
                )}
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '2px', letterSpacing: '-0.03em' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
            </div>
        </motion.div>
    );
};

export default StatCard;
