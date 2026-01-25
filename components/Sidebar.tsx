import React from 'react';
import styles from './Sidebar.module.css';
import { PriceMap } from '@/hooks/useBinanceStream';

interface SidebarProps {
    prices: PriceMap;
    activeSymbol: string;
    onSelectSymbol: (symbol: string) => void;
}

export default function Sidebar({ prices, activeSymbol, onSelectSymbol }: SidebarProps) {
    const getPrice = (symbol: string, defaultPrice: string) => {
        return prices[symbol] ? `$${prices[symbol].toFixed(2)}` : defaultPrice;
    };

    const tickers = [
        { id: 'BTCUSDT', symbol: 'BTC', name: 'Bitcoin', defaultPrice: '$28,450.10' },
        { id: 'ETHUSDT', symbol: 'ETH', name: 'Ethereum', defaultPrice: '$1,890.55' },
        { id: 'SOLUSDT', symbol: 'SOL', name: 'Solana', defaultPrice: '$95.20' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span style={{ color: '#fff' }}>■</span> Intuited
            </div>

            <div className={styles.tickerList}>
                {tickers.map((ticker) => (
                    <div
                        key={ticker.id}
                        className={`${styles.tickerItem} ${activeSymbol === ticker.id ? styles.active : ''}`}
                        onClick={() => onSelectSymbol(ticker.id)}
                    >
                        <span className={styles.symbol}>{ticker.symbol}</span>
                        <span className={styles.name}>{ticker.name}</span>
                        <div className={styles.priceInfo}>
                            <span className={styles.price}>{getPrice(ticker.id, ticker.defaultPrice)}</span>
                            <span className={styles.change} style={{ color: '#888' }}>Live</span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
