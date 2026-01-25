export interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

/**
 * Fetches historical kline (candlestick) data from Binance API
 * @param symbol - e.g. "BTCUSDT"
 * @param interval - e.g. "1m", "1h", "1d"
 * @param limit - number of candles (default 1000)
 */
export async function fetchHistoricalData(
    symbol: string = 'BTCUSDT',
    interval: string = '1m',
    limit: number = 180 // 3 hours of 1m data
): Promise<CandleData[]> {
    try {
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        const rawData = await res.json();

        // Binance API returns array of arrays:
        // [ [openTime, open, high, low, close, volume, closeTime, ...], ... ]
        return rawData.map((d: any) => ({
            time: d[0],
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
            volume: parseFloat(d[5]),
        }));
    } catch (error) {
        console.error("Error fetching historical data:", error);
        return [];
    }
}
