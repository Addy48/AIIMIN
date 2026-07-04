import React from 'react';
import { curveNatural } from '@visx/curve';
import { shouldShip } from '../../utils/designVoteShip';
import SafeRender from './SafeRender';
import { AreaChart, Area } from '../charts/area-chart';
import { LineChart } from '../charts/line-chart';
import { Line } from '../charts/line';
import { Grid } from '../charts/grid';
import { XAxis } from '../charts/x-axis';
import AreaChartLoading from '../charts/area-chart-loading';
import LineChartLoading from '../charts/line-chart-loading';
import HeatmapChartLoading from '../charts/heatmap/heatmap-chart-loading';

function wrap(name, node, fallback) {
  return (
    <SafeRender name={name} fallback={fallback}>
      {node}
    </SafeRender>
  );
}

const pulseBox = (height = 120) => (
  <div style={{ height, borderRadius: 16, background: 'var(--color-surface)', border: '1px solid var(--color-border)', animation: 'aiimin-pulse 1.5s infinite' }} />
);

const HEATMAP_SKELETON = Array.from({ length: 12 }, (_, col) => ({
  bin: col,
  bins: Array.from({ length: 7 }, (_, row) => ({
    bin: row,
    count: 0,
    date: '',
  })),
}));

export function ShippedAreaLoading({ label = 'Syncing metrics…', shipId = 'chart-area-loading-pulse' }) {
  if (!shouldShip(shipId)) return pulseBox(120);
  return wrap('area-loading', <AreaChartLoading loadingStyle="pulse" label={label} />, pulseBox(120));
}

export function ShippedLineLoading({ label = 'Loading chart…', shipId = 'chart-line-loading-sweep' }) {
  if (!shouldShip(shipId)) return pulseBox(200);
  return wrap('line-loading', <LineChartLoading loadingStyle="sweep" label={label} />, pulseBox(200));
}

export function ShippedHeatmapLoading({ label = 'Building grid…', data, shipId = 'chart-heatmap-loading' }) {
  const fallback = (
    <div style={{ padding: '48px 20px', textAlign: 'center', fontSize: 12, color: 'var(--color-text-3)' }}>
      {label}
    </div>
  );
  if (!shouldShip(shipId)) return fallback;
  return wrap(
    'heatmap-loading',
    <HeatmapChartLoading data={data || HEATMAP_SKELETON} label={label} />,
    fallback,
  );
}

export function ShippedSleepAreaChart({ series, shipId = 'chart-area-live' }) {
  if (!shouldShip(shipId) || !series?.length) return null;
  return wrap('sleep-area', (
    <div style={{ height: 200, marginTop: 8 }}>
      <AreaChart data={series} xDataKey="date" status="ready" margin={{ top: 16, right: 12, bottom: 28, left: 44 }}>
        <Grid horizontal />
        <XAxis />
        <Area
          dataKey="hours"
          curve={curveNatural}
          fill="var(--color-accent)"
          fillOpacity={0.16}
          stroke="var(--color-accent)"
          strokeWidth={2}
        />
      </AreaChart>
    </div>
  ));
}

export function ShippedFinanceLineChart({ series, shipId = 'chart-line-live' }) {
  if (!shouldShip(shipId) || !series?.length) return null;
  return wrap('finance-line', (
    <div style={{ height: 220, marginBottom: 24 }}>
      <LineChart data={series} xDataKey="date" status="ready" margin={{ top: 16, right: 12, bottom: 28, left: 48 }}>
        <Grid horizontal />
        <XAxis />
        <Line dataKey="income" curve={curveNatural} stroke="var(--color-success)" strokeWidth={2} />
        <Line dataKey="expense" curve={curveNatural} stroke="var(--color-accent)" strokeWidth={2} strokeDasharray="6 4" />
      </LineChart>
    </div>
  ));
}
