import { View } from "react-native";
import Svg, {
  Line,
  Circle,
  Text as SvgText,
  Path,
  Polyline,
} from "react-native-svg";
import { DataPoint, calculateTrendLine } from "../MathUtils";

type Props = {
  data: DataPoint[];
  lineMode?: "trend" | "straight" | "wave";
};

export default function DiagramBlock({
  data,
  lineMode = "trend",
}: Props) {
  const width = 300;
  const height = 200;
  const padding = 30;

  const { a, b } = calculateTrendLine(data);

  const rawMaxX = Math.max(...data.map(d => d.x));
  const rawMaxY = Math.max(...data.map(d => d.y));

  const maxX = Math.max(10, Math.ceil(rawMaxX / 10) * 10);
  const maxY = Math.max(5, Math.ceil(rawMaxY / 5) * 5);

  const scaleX = (x: number) =>
    padding + (x / maxX) * (width - 2 * padding);

  const scaleY = (y: number) =>
    height - padding - (y / maxY) * (height - 2 * padding);

  const buildWavePath = () => {
    if (data.length < 2) return "";

    let d = `M ${scaleX(data[0].x)} ${scaleY(data[0].y)}`;

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      const cx = (scaleX(prev.x) + scaleX(curr.x)) / 2;

      d += ` C ${cx} ${scaleY(prev.y)}, ${cx} ${scaleY(curr.y)}, ${scaleX(curr.x)} ${scaleY(curr.y)}`;
    }

    return d;
  };

  return (
    <View style={{ marginVertical: 16 }}>
      <Svg width={width} height={height}>
        {/* axes */}
        <Line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#000" />
        <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#000" />

        {/* grid */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding + (i * (height - 2 * padding)) / 4;
          const x = padding + (i * (width - 2 * padding)) / 4;
          return (
            <>
              <Line key={`h${i}`} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#E0E0E0" />
              <Line key={`v${i}`} x1={x} y1={padding} x2={x} y2={height - padding} stroke="#E0E0E0" />
            </>
          );
        })}

        {/* y labels */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = Math.round((maxY / 4) * i);
          const y = height - padding - (i / 4) * (height - 2 * padding);
          return (
            <SvgText
              key={i}
              x={padding - 6}
              y={y + 4}
              fontSize="10"
              fill="#555"
              textAnchor="end"
            >
              {value}
            </SvgText>
          );
        })}

        {/* x labels */}
        {data.map((p, i) => (
          <SvgText
            key={i}
            x={scaleX(p.x)}
            y={height - padding + 14}
            fontSize="10"
            fill="#555"
            textAnchor="middle"
          >
            {p.x}
          </SvgText>
        ))}

        {/* points */}
        {data.map((p, i) => (
          <Circle key={i} cx={scaleX(p.x)} cy={scaleY(p.y)} r={4} fill="#1976D2" />
        ))}

        {/* lines */}
        {lineMode === "trend" && (
          <Line
            x1={scaleX(0)}
            y1={scaleY(b)}
            x2={scaleX(maxX)}
            y2={scaleY(a * maxX + b)}
            stroke="#D32F2F"
            strokeWidth={2}
          />
        )}

        {lineMode === "straight" && (
          <Polyline
            points={data.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(" ")}
            fill="none"
            stroke="#1976D2"
            strokeWidth={2}
          />
        )}

        {lineMode === "wave" && (
          <Path
            d={buildWavePath()}
            fill="none"
            stroke="#1976D2"
            strokeWidth={2}
          />
        )}
      </Svg>
    </View>
  );
}
