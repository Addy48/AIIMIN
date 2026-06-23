import React from 'react';
import { motion } from 'framer-motion';
import { Target, HelpCircle, Activity, Zap, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const nodes = [
  { id: 'goals', label: '1. Set Goal', icon: Target, desc: 'Define your North Star', color: '#8B5CF6', route: '/goals' },
  { id: 'decision', label: '2. Strategize', icon: HelpCircle, desc: 'Mental Models (Lab)', color: '#3B82F6', route: '?module=decision' },
  { id: 'habits', label: '3. Build Habit', icon: Activity, desc: 'Daily execution', color: '#10B981', route: '/habits' },
  { id: 'focus', label: '4. Deep Work', icon: Zap, desc: 'Enter Flow State', color: '#F59E0B', route: '/focus' },
  { id: 'discipline', label: '5. Maintain', icon: Shield, desc: 'Addiction Tracker', color: '#EF4444', route: '?module=addiction' }
];

export default function GrowthLoop() {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    if (route.startsWith('?')) {
      const newUrl = new URL(window.location);
      const params = new URLSearchParams(route);
      newUrl.searchParams.set('module', params.get('module'));
      window.history.pushState({}, '', newUrl);
      window.dispatchEvent(new Event('popstate')); // force update
    } else {
      navigate(route);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(30px)',
      borderRadius: '32px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '48px',
      marginBottom: '48px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)'
    }}>
      <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%)', pointerEvents: 'none' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
         <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8B5CF6', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <Activity size={24} />
         </div>
         <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>The Growth Engine</h2>
      </div>
      <p style={{ color: 'var(--color-text-2)', fontSize: '15px', lineHeight: 1.6, marginBottom: '64px', maxWidth: '700px' }}>
        Success is not an event, it's a compounding loop. Follow this interconnected system to turn raw ambition into unstoppable momentum. Click on any node to jump directly into the flow.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '0 20px' }}>
         {/* Animated Connecting Line */}
         <div style={{ position: 'absolute', top: '38px', left: '60px', right: '60px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', zIndex: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #8B5CF6, #3B82F6, #10B981, #F59E0B, #EF4444)', opacity: 0.3 }} />
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '30%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                filter: 'blur(2px)'
              }}
            />
         </div>

         {nodes.map((node, i) => (
           <motion.div 
             key={node.id}
             whileHover={{ y: -8, scale: 1.05 }}
             onClick={() => handleNavigate(node.route)}
             style={{
               position: 'relative', zIndex: 1,
               display: 'flex', flexDirection: 'column', alignItems: 'center',
               cursor: 'pointer', width: '130px'
             }}
           >
             <motion.div
               whileHover={{ boxShadow: `0 0 40px ${node.color}50`, borderColor: node.color }}
               style={{
                 width: '76px', height: '76px', borderRadius: '24px',
                 background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.1)`,
                 backdropFilter: 'blur(20px)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 color: node.color, marginBottom: '24px',
                 boxShadow: `0 10px 30px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)`,
                 transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
               }}
             >
                <node.icon size={32} />
             </motion.div>
             <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '8px', textAlign: 'center', letterSpacing: '-0.01em' }}>
                {node.label}
             </div>
             <div style={{ fontSize: '12px', color: 'var(--color-text-3)', textAlign: 'center', lineHeight: 1.4, fontWeight: 500 }}>
                {node.desc}
             </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
