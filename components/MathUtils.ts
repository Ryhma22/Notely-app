import { evaluate } from "mathjs/number";

export type DataPoint = {
  x: number;
  y: number;
};

export function calculateTrendLine(data: DataPoint[]) {
  const n = data.length;
  if (n === 0) return { a: 0, b: 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  data.forEach((p) => {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  });

  const a =
    (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumY - a * sumX) / n;

  return { a, b };
}

export function calculateExpression(expression: string): string {
  const cleaned = expression.trim();
  if (!cleaned) throw new Error("Empty expression");

  const value = evaluate(cleaned);
  return String(value);
}
