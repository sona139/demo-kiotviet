import { useMemo, useState } from "react";

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export function SimpleLineChart({ data, color = "#3B82F6", height = 180 }: LineChartProps) {
  const padding = { top: 8, right: 8, bottom: 24, left: 28 };

  const { minY, maxY, points, xLabels } = useMemo(() => {
    const values = data.map((d) => d.value);
    const minY = Math.min(...values);
    const maxY = Math.max(...values) || 1;
    return { minY, maxY, points: values, xLabels: data.map((d) => d.label) };
  }, [data]);

  const w = 480;
  const h = height;
  const innerW = w - padding.left - padding.right;
  const innerH = h - padding.top - padding.bottom;

  const toX = (i: number) => padding.left + (i / (data.length - 1)) * innerW;
  const toY = (v: number) =>
    padding.top + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

  const pathD = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`)
    .join(" ");

  const visibleLabels = xLabels.filter((_, i) => i % 3 === 0 || i === xLabels.length - 1);
  const visibleIndices = xLabels.reduce<number[]>((acc, _, i) => {
    if (i % 3 === 0 || i === xLabels.length - 1) acc.push(i);
    return acc;
  }, []);

  const yTicks = [minY, (minY + maxY) / 2, maxY].map((v) => Math.round(v * 10) / 10);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={height}
      style={{ display: "block", overflow: "visible" }}
    >
      {yTicks.map((tick, i) => (
        <line
          key={`y-grid-${i}`}
          x1={padding.left}
          x2={w - padding.right}
          y1={toY(tick)}
          y2={toY(tick)}
          stroke="#F3F4F6"
          strokeWidth={1}
        />
      ))}

      {yTicks.map((tick, i) => (
        <text
          key={`y-label-${i}`}
          x={padding.left - 4}
          y={toY(tick) + 4}
          textAnchor="end"
          fontSize={9}
          fill="#9CA3AF"
        >
          {tick}
        </text>
      ))}

      {visibleIndices.map((idx, i) => (
        <text
          key={`x-label-${i}`}
          x={toX(idx)}
          y={h - 4}
          textAnchor="middle"
          fontSize={9}
          fill="#9CA3AF"
        >
          {visibleLabels[i]}
        </text>
      ))}

      <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {points.map((v, i) => (
        <circle key={`dot-${i}`} cx={toX(i)} cy={toY(v)} r={3} fill={color} />
      ))}
    </svg>
  );
}

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  valueSuffix?: string;
}

export function SimpleBarChart({
  data,
  color = "#3B82F6",
  height = 180,
  valueSuffix = "",
}: BarChartProps) {
  const padding = { top: 8, right: 8, bottom: 24, left: 34 };

  const { maxY } = useMemo(() => {
    const values = data.map((d) => d.value);
    return { maxY: Math.max(...values) || 1 };
  }, [data]);

  const w = 480;
  const h = height;
  const innerW = w - padding.left - padding.right;
  const innerH = h - padding.top - padding.bottom;

  const barW = Math.max(4, (innerW / data.length) * 0.55);
  const gap = innerW / data.length;

  const toX = (i: number) => padding.left + i * gap + gap / 2;
  const toBarH = (v: number) => (v / maxY) * innerH;
  const toBarY = (v: number) => padding.top + innerH - toBarH(v);

  const visibleIndices = data.reduce<number[]>((acc, _, i) => {
    if (i % 3 === 0 || i === data.length - 1) acc.push(i);
    return acc;
  }, []);

  const yTicks = [0, Math.round(maxY / 2), maxY];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={height}
      style={{ display: "block", overflow: "visible" }}
    >
      {yTicks.map((tick, i) => (
        <line
          key={`y-grid-${i}`}
          x1={padding.left}
          x2={w - padding.right}
          y1={toBarY(tick)}
          y2={toBarY(tick)}
          stroke="#F3F4F6"
          strokeWidth={1}
        />
      ))}

      {yTicks.map((tick, i) => (
        <text
          key={`y-label-${i}`}
          x={padding.left - 4}
          y={toBarY(tick) + 4}
          textAnchor="end"
          fontSize={9}
          fill="#9CA3AF"
        >
          {tick}{valueSuffix}
        </text>
      ))}

      {visibleIndices.map((idx) => (
        <text
          key={`x-label-${idx}`}
          x={toX(idx)}
          y={h - 4}
          textAnchor="middle"
          fontSize={9}
          fill="#9CA3AF"
        >
          {data[idx].label}
        </text>
      ))}

      {data.map((d, i) => {
        const bh = Math.max(2, toBarH(d.value));
        return (
          <rect
            key={`bar-${i}`}
            x={toX(i) - barW / 2}
            y={toBarY(d.value)}
            width={barW}
            height={bh}
            rx={2}
            fill={color}
          />
        );
      })}
    </svg>
  );
}

/* ── Pie Chart ── */
interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieSlice[];
  size?: number;
}

export function SimplePieChart({ data, size = 160 }: PieChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const r = size / 2;
  const cx = r;
  const cy = r;
  const outerR = r - 4;
  const innerR = outerR * 0.55;

  const slices = useMemo(() => {
    const result: { label: string; value: number; color: string; path: string; pct: number }[] = [];
    let cumAngle = -Math.PI / 2;
    for (const d of data) {
      const angle = (d.value / total) * Math.PI * 2;
      const startAngle = cumAngle;
      const endAngle = cumAngle + angle;
      cumAngle = endAngle;
      const largeArc = angle > Math.PI ? 1 : 0;
      const x1o = cx + outerR * Math.cos(startAngle);
      const y1o = cy + outerR * Math.sin(startAngle);
      const x2o = cx + outerR * Math.cos(endAngle);
      const y2o = cy + outerR * Math.sin(endAngle);
      const x1i = cx + innerR * Math.cos(endAngle);
      const y1i = cy + innerR * Math.sin(endAngle);
      const x2i = cx + innerR * Math.cos(startAngle);
      const y2i = cy + innerR * Math.sin(startAngle);
      const path = [
        `M ${x1o} ${y1o}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
        `L ${x1i} ${y1i}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i}`,
        "Z",
      ].join(" ");
      result.push({ ...d, path, pct: Math.round((d.value / total) * 100) });
    }
    return result;
  }, [data, total, cx, cy, outerR, innerR]);

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            opacity={hovered === null || hovered === i ? 1 : 0.4}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ transition: "opacity 0.2s", cursor: "pointer" }}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={14} fontWeight={600} fill="#374151">
          {hovered !== null ? `${slices[hovered].pct}%` : "100%"}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#9CA3AF">
          {hovered !== null ? slices[hovered].label : "Tổng"}
        </text>
      </svg>
      <div className="space-y-1.5">
        {slices.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-[11px] cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-gray-600">{s.label}</span>
            <span className="font-semibold text-gray-700 ml-auto">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Donut Chart (for QR ratio) ── */
interface DonutChartProps {
  staticPct: number;
  dynamicPct: number;
  size?: number;
}

export function SimpleDonutChart({ staticPct, dynamicPct, size = 120 }: DonutChartProps) {
  const r = size / 2;
  const strokeW = 14;
  const radius = r - strokeW / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const staticLen = (staticPct / 100) * circumference;
  const dynamicLen = (dynamicPct / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={r} cy={r} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeW} />
      <circle
        cx={r} cy={r} r={radius} fill="none"
        stroke="#22C55E" strokeWidth={strokeW}
        strokeDasharray={`${dynamicLen} ${circumference}`}
        strokeLinecap="round"
      />
      <circle
        cx={r} cy={r} r={radius} fill="none"
        stroke="#F59E0B" strokeWidth={strokeW}
        strokeDasharray={`${staticLen} ${circumference}`}
        strokeDashoffset={-dynamicLen}
        strokeLinecap="round"
      />
    </svg>
  );
}
