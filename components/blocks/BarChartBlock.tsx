import { View, Text } from "react-native";
import Svg, { Rect, Line, Text as SvgText } from "react-native-svg";

type BarDataPoint = {
  label: string;
  value: number;
};

type BarChartBlockProps = {
  data: BarDataPoint[];
};

export default function BarChartBlock({ data }: BarChartBlockProps) {
  const width = 300;
  const height = 200;
  const padding = 30;

  const rawMax = Math.max(...data.map((d) => d.value));
  const maxY = rawMax <= 10 ? 10 : Math.ceil(rawMax / 10) * 10;

  const step = (width - 2 * padding) / data.length;
  const barWidth = step - 8;

  const scaleY = (value: number) =>
    height -
    padding -
    (value / maxY) * (height - 2 * padding);

  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ marginBottom: 6, color: "#000" }}>
      </Text>

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

        {data.map((d, i) => {
          const x = padding + i * step + 4;
          const y = scaleY(d.value);
          const barHeight = height - padding - y;

          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#1976D2"
            />
          );
        })}

        {data.map((d, i) => {
          const x = padding + i * step + step / 2;

          return (
            <SvgText
              key={`x-${i}`}
              x={x}
              y={height - padding + 14}
              fontSize="9"
              fill="#555"
              textAnchor="middle"
            >
              {d.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
