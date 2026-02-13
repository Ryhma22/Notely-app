/**
 * Valuutanmuunnospalvelu – ExchangeRate-API (ilmainen, ei avainta)
 * Kurssit päivittyvät noin kerran päivässä.
 */

const API_URL = "https://api.exchangerate-api.com/v4/latest/EUR";

export type CurrencyCode = "EUR" | "USD" | "GBP" | "SEK" | "CHF" | "JPY" | "NOK" | "DKK";

export const CURRENCY_CODES: CurrencyCode[] = [
  "EUR",
  "USD",
  "GBP",
  "SEK",
  "CHF",
  "JPY",
  "NOK",
  "DKK",
];

export type RatesResponse = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

export async function fetchRates(): Promise<RatesResponse> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Kurssien haku epäonnistui");
  const data = (await res.json()) as RatesResponse;
  return data;
}

/**
 * Muuntaa summan valuutasta toiseen.
 * rates: { EUR: 1, USD: 1.19, GBP: 0.871, ... } (perus EUR)
 */
export function convert(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  if (!fromRate || !toRate) throw new Error("Tuntematon valuutta");
  return (amount * toRate) / fromRate;
}
