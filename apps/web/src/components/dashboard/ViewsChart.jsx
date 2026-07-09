import { motion } from "framer-motion";

export function ViewsChart({ data = [] }) {
  if (!data.length) return null;

  const maxViews = Math.max(...data.map((d) => d.views), 10);
  const height = 180;
  const width = 500;
  const padding = 30;

  // Calculate coordinates for the line chart
  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (d.views * (height - padding * 2)) / maxViews;
    return { x, y, label: d.date, value: d.views };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full relative select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#528bf2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#528bf2" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio, index) => {
          const y = padding + ratio * (height - padding * 2);
          const value = Math.round(maxViews - ratio * maxViews);
          return (
            <g key={index} className="opacity-40">
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="white"
                strokeWidth={1}
                strokeDasharray="4 6"
                className="opacity-10"
              />
              <text
                x={padding - 8}
                y={y + 4}
                fill="#8e96aa"
                fontSize="10"
                fontWeight="bold"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <motion.path
          d={areaPath}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#528bf2"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Interactive Dots */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="#528bf2"
              stroke="#090a0f"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ r: 6 }}
            />
            <text
              x={p.x}
              y={height - 8}
              fill="#8e96aa"
              fontSize="10"
              fontWeight="semibold"
              textAnchor="middle"
            >
              {p.label}
            </text>

            {/* Hover Tooltip inside SVG */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <rect
                x={p.x - 20}
                y={p.y - 30}
                width={40}
                height={20}
                rx={6}
                fill="#12141c"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              <text
                x={p.x}
                y={p.y - 17}
                fill="white"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {p.value}
              </text>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
