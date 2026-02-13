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

/**
 * Laskee matemaattisen lausekkeen arvon.
 * @param expression - Lauseke (esim. "2+3*5")
 * @param precision - Desimaalien määrä (0–10). -1 = ei pyöristystä.
 */
export function calculateExpression(
  expression: string,
  precision: number = 6
): string {
  const cleaned = expression.trim();
  if (!cleaned) throw new Error("Empty expression");

  const value = evaluate(cleaned) as number;

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return String(value);
  }

  if (precision < 0) return String(value);

  const factor = Math.pow(10, precision);
  const rounded = Math.round(value * factor) / factor;
  return rounded.toString();
}
