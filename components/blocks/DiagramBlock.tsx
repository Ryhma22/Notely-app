import { View, Text } from "react-native";
import Svg, {
  Line,
  Circle,
  Text as SvgText,
} from "react-native-svg";
import { DataPoint, calculateTrendLine } from "../MathUtils";

type Props = {
  data: DataPoint[];
};

export default function DiagramBlock({ data }: Props) {
  const width = 300;
  const height = 200;
  const padding = 30;

  const { a, b } = calculateTrendLine(data);

  const rawMaxX = Math.max(...data.map(d => d.y));
  const baseMaxX = 10;
  const maxX =
  rawMaxX <= baseMaxX
    ? baseMaxX
    : Math.ceil(rawMaxX / baseMaxX) * baseMaxX;
 
  const rawMaxY = Math.max(...data.map(d => d.y));
  const baseMaxY = 5;
  const maxY =
  rawMaxY <= baseMaxY
    ? baseMaxY
    : Math.ceil(rawMaxY / baseMaxY) * baseMaxY;


  const scaleX = (x: number) =>
    padding + (x / maxX) * (width - 2 * padding);

  const scaleY = (y: number) =>
    height - padding - (y / maxY) * (height - 2 * padding);




  return (
    <View style={{ marginVertical: 16 }}>
      <Svg width={width} height={height}>
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#000"
          strokeWidth={2}
        />

        <Line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#000"
          strokeWidth={2}
        />

        {Array.from({ length: 5 }).map((_, i) => {
          const y =
            padding +
            (i * (height - 2 * padding)) / 4;
          return (
            <Line
              key={`h-${i}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#E0E0E0"
              strokeWidth={1}
            />
          );
        })}

        {Array.from({ length: 5 }).map((_, i) => {
          const x =
            padding +
            (i * (width - 2 * padding)) / 4;
          return (
            <Line
              key={`v-${i}`}
              x1={x}
              y1={padding}
              x2={x}
              y2={height - padding}
              stroke="#E0E0E0"
              strokeWidth={1}
            />
          );
        })}

        {Array.from({ length: 5 }).map((_, i) => {
          const value = Math.round((maxY / 4) * i);
          const y =
            height -
            padding -
            (i / 4) * (height - 2 * padding);

          return (
            <SvgText
              key={`y-${i}`}
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

        {data.map((p, i) => (
          <SvgText
            key={`x-${i}`}
            x={scaleX(p.x)}
            y={height - padding + 14}
            fontSize="10"
            fill="#555"
            textAnchor="middle"
          >
            {p.x}
          </SvgText>
        ))}

        {data.map((p, i) => (
          <Circle
            key={i}
            cx={scaleX(p.x)}
            cy={scaleY(p.y)}
            r={4}
            fill="#1976D2"
          />
        ))}

        <Line
          x1={scaleX(0)}
          y1={scaleY(b)}
          x2={scaleX(maxX)}
          y2={scaleY(a * maxX + b)}
          stroke="#D32F2F"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}
