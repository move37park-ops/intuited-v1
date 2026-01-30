import { useEffect, useState, useRef } from 'react';

export interface PriceMap {
    [symbol: string]: number;
}

export function useBinanceStream(symbols: string[] = ['btcusdt', 'ethusdt', 'solusdt']) {
    const [prices, setPrices] = useState<PriceMap>({});
    const wsRef = useRef<WebSocket | null>(null);

    const symbolsKey = JSON.stringify(symbols);
    useEffect(() => {
        // Construct stream URL
        // Format: wss://stream.binance.com:9443/stream?streams=btcusdt@miniTicker/ethusdt@miniTicker...
        const streamNames = symbols.map(s => `${s.toLowerCase()}@miniTicker`).join('/');
        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames}`;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to Binance WebSocket');
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                // Message structure: { stream: "btcusdt@miniTicker", data: { s: "BTCUSDT", c: "28000.50", ... } }
                if (message.data && message.data.s && message.data.c) {
                    const symbol = message.data.s; // e.g. "BTCUSDT"
                    const price = parseFloat(message.data.c);

                    setPrices((prev) => ({
                        ...prev,
                        [symbol]: price
                    }));
                }
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('Binance WebSocket Error:', error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbolsKey]); // Re-connect only if symbols list changes

    return prices;
}
