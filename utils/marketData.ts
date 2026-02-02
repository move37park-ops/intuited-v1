export interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

// Configuration for Mock Assets
const MOCK_ASSETS: Record<string, { basePrice: number, volatility: number }> = {
    'NVDA': { basePrice: 135.50, volatility: 0.02 },
    'TSLA': { basePrice: 245.80, volatility: 0.03 },
    'AAPL': { basePrice: 226.40, volatility: 0.015 },
    'SAMSUNG': { basePrice: 58000, volatility: 0.015 }, // KRW
};

// Helper: Generate Mock History
function generateMockHistory(symbol: string, interval: string, limit: number): CandleData[] {
    const asset = MOCK_ASSETS[symbol.toUpperCase()];
    if (!asset) return [];

    let currentPrice = asset.basePrice;
    const now = Math.floor(Date.now() / 1000);
    const data: CandleData[] = [];

    // Determine time step in seconds
    let step = 60; // 1m
    if (interval === '5m') step = 300;
    if (interval === '1h') step = 3600;
    if (interval === '1d') step = 86400;

    // Generate backwards
    for (let i = limit; i > 0; i--) {
        const time = now - (i * step);
        const change = (Math.random() - 0.5) * asset.volatility * currentPrice;
        const open = currentPrice;
        const close = currentPrice + change;
        const high = Math.max(open, close) + Math.random() * Math.abs(change) * 0.5;
        const low = Math.min(open, close) - Math.random() * Math.abs(change) * 0.5;

        data.push({
            time: time * 1000, // Ms
            open,
            high,
            low,
            close,
            volume: Math.floor(Math.random() * 10000)
        });
        currentPrice = close;
    }
    return data;
}

/**
 * Unified fetcher for Crypto (Binance) and Stocks (Mock)
 */
export async function fetchMarketData(
    symbol: string,
    interval: string = '1m',
    limit: number = 180
): Promise<CandleData[]> {
    const upperSymbol = symbol.toUpperCase();

    // Check if Mock Asset
    if (MOCK_ASSETS[upperSymbol]) {
        return new Promise((resolve) => {
            // Simulate network delay for realism
            setTimeout(() => {
                resolve(generateMockHistory(upperSymbol, interval, limit));
            }, 300);
        });
    }

    // Default: Binance (Crypto)
    // Map stock-like symbols to Binance equivalent if needed, but for now we assume distinct sets.
    // If user passed 'BTC', map to 'BTCUSDT'
    let binanceSymbol = upperSymbol;
    if (!binanceSymbol.endsWith('USDT')) {
        binanceSymbol += 'USDT';
    }

    try {
        const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const rawData = await res.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return rawData.map((d: any) => ({
            time: d[0],
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
            volume: parseFloat(d[5]),
        }));
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return [];
    }
}
