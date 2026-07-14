import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, X, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const FinanceWealth = ({ 
  assets = [], formatCurrency, totalInvested = 0, totalReturns = 0, returnPct = 0,
  assetBreakdown = [], ASSET_COLORS = [], 
  setAssetModalOpen, setNewAsset, handleDeleteAsset 
}) => {
  const breakdown = Array.isArray(assetBreakdown) ? assetBreakdown : [];
  const safeAssets = Array.isArray(assets) ? assets : [];

  return (
    <motion.div key="wealth" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="finance-wealth-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* Total Wealth Summary Card */}
        <div className="nordic-card" style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: '8px' }}>Total Capital Deployed</div>
          <div style={{ fontSize: '64px', fontWeight: 500, fontFamily: 'var(--font-serif)', letterSpacing: '-0.04em', lineHeight: 1 }}>{formatCurrency(totalInvested)}</div>
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '4px' }}>Unrealized Gain</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: totalReturns >= 0 ? '#10B981' : 'var(--color-rust)' }}>
                {totalReturns >= 0 ? '+' : ''}{formatCurrency(totalReturns)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '4px' }}>Blended Yield</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: returnPct >= 0 ? '#10B981' : 'var(--color-rust)' }}>
                {returnPct >= 0 ? '+' : ''}{returnPct}%
              </div>
            </div>
          </div>
        </div>

        {/* Asset Allocation Donut */}
        <div className="nordic-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '16px', alignSelf: 'flex-start' }}>Asset Allocation</div>
          <div style={{ width: '100%', height: '200px' }}>
            {breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => formatCurrency(val)}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: '0 16px' }}>
                Add positions to see allocation
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            {breakdown.map((a, i) => (
              <div key={a.name || i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ASSET_COLORS[i % ASSET_COLORS.length] }} />
                {a.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>Portfolio Positions</h3>
        <button onClick={() => setAssetModalOpen(true)} style={{ background: 'var(--color-accent)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={14} /> Add Position
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {safeAssets.length === 0 && (
          <div className="nordic-card" style={{ padding: '32px', gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
            No portfolio positions yet. Add your first investment to track wealth here.
          </div>
        )}
        {safeAssets.map(asset => {
          const invested = Number(asset.investedAmount) || 0;
          const current = Number(asset.currentValue) || 0;
          const ret = current - invested;
          const pct = invested > 0 ? ((ret / invested) * 100).toFixed(1) : '0.0';
          return (
            <div key={asset.id} className="nordic-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>{asset.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{asset.type}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => { setNewAsset({ id: asset.id, name: asset.name, type: asset.type, investedAmount: asset.investedAmount, currentValue: asset.currentValue }); setAssetModalOpen(true); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Settings size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteAsset(asset.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-rust)', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '4px' }}>Current Value</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatCurrency(current)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '4px' }}>Yield</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: ret >= 0 ? '#10B981' : 'var(--color-rust)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={12} style={{ transform: ret >= 0 ? 'none' : 'rotate(180deg)' }} />
                    {pct}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FinanceWealth;
