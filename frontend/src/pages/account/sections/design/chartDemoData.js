/** Demo series for Bklit charts in Design Lab */
export function buildXpSeries(pointCount = 14) {
  const base = new Date();
  base.setDate(base.getDate() - pointCount);

  return Array.from({ length: pointCount }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    return {
      date,
      xp: Math.round(80 + Math.sin(i * 0.9) * 28 + i * 6),
      focus: Math.round(45 + Math.cos(i * 0.7) * 18 + i * 2.5),
    };
  });
}

/** GitHub-style heatmap columns for Bklit HeatmapChart */
export function buildHeatmapDemoData(weeks = 16) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: weeks }, (_, weekIndex) => {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (weeks - 1 - weekIndex) * 7 - today.getDay());

    const bins = Array.from({ length: 7 }, (_, day) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + day);
      const future = date > today;
      return {
        bin: day,
        date,
        count: future ? 0 : Math.random() > 0.35 ? Math.floor(Math.random() * 5) : 0,
      };
    });

    return { bin: weekIndex, bins };
  });
}
