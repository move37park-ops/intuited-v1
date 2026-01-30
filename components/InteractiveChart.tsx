"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';
import { fetchHistoricalData } from '@/utils/binance';
import PredictionCanvas from './PredictionCanvas';

interface InteractiveChartProps {
    symbol?: string;
    lang?: 'ENG' | 'KR';
    exchangeRate?: number;
    onSubmit?: () => void;
}

export default function InteractiveChart({
    symbol = 'BTCUSDT',
    lang = 'ENG',
    exchangeRate = 1435,
    onSubmit
}: InteractiveChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    const [visibleRange, setVisibleRange] = useState<{ min: number, max: number } | null>(null);
    const [startPoint, setStartPoint] = useState<{ x: number, y: number, price: number } | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Chart Cleanup Helper
    const cleanupChart = () => {
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
            seriesRef.current = null;
        }
    };

    // Initial Setup & Symbol Change
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Force Cleanup
        cleanupChart();
        setDataLoaded(false);

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#888',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.15)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.15)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                borderColor: '#333',
                timeVisible: true,
                secondsVisible: false,
                rightOffset: 50, // Reduced as requested
                barSpacing: 10, // Increased to force 1h grid blocks (1h = 12 bars @ 5m = 120px)
                minBarSpacing: 5,
                fixLeftEdge: true,
                shiftVisibleRangeOnNewBar: true,
                tickMarkFormatter: (time: number) => {
                    const date = new Date(time * 1000);
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    return `${hours}:${minutes}`;
                },
            },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#ffffff', // White
            downColor: '#333333', // Dark Grey
            borderVisible: true,
            borderColor: '#ffffff',
            wickUpColor: '#ffffff',
            wickDownColor: '#ffffff',
        });

        chartRef.current = chart;
        seriesRef.current = series;

        // Sync Logic
        const syncState = () => {
            if (!chartRef.current || !seriesRef.current) return;

            const height = chart.chartElement().clientHeight;
            const min = series.coordinateToPrice(height);
            const max = series.coordinateToPrice(0);

            if (min !== null && max !== null) {
                setVisibleRange({ min, max });
            }

            // Calculate Start Point (Last Candle)
            const data = series.data();
            if (data.length > 0) {
                const last = data[data.length - 1] as CandlestickData;
                // Need logical indices or time convert
                // Lightweight charts v5 treats timeToCoordinate differently depending on setup.
                // Using `timeToCoordinate` with the time value of the last candle.

                const x = chart.timeScale().timeToCoordinate(last.time as any);
                const y = series.priceToCoordinate(last.close);

                if (x !== null && y !== null) {
                    setStartPoint({ x, y, price: last.close });
                }
            }
        };

        chart.timeScale().subscribeVisibleTimeRangeChange(syncState);
        const syncInterval = setInterval(syncState, 100);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
                syncState();
            }
        };
        window.addEventListener('resize', handleResize);

        // Initial Data Fetch - 5m candles, 144 units (12 hours)
        fetchHistoricalData(symbol, '5m', 144).then(data => {
            const isKR = lang === 'KR';
            const timezoneOffset = isKR ? 9 * 3600 : -5 * 3600; // KR: UTC+9, US: UTC-5 (EST)

            const formatData = data.map(d => ({
                time: (d.time / 1000 + timezoneOffset) as any,
                open: isKR ? d.open * exchangeRate : d.open,
                high: isKR ? d.high * exchangeRate : d.high,
                low: isKR ? d.low * exchangeRate : d.low,
                close: isKR ? d.close * exchangeRate : d.close
            }));
            if (seriesRef.current) {
                seriesRef.current.setData(formatData);
                chart.timeScale().fitContent();
                setDataLoaded(true);
                setTimeout(syncState, 50);
            }
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(syncInterval);
            cleanupChart();
        };
    }, [symbol, lang, exchangeRate]); // Added lang and exchangeRate to trigger updates

    // Polling Data
    useEffect(() => {
        if (!dataLoaded) return;
        const interval = setInterval(() => {
            if (!seriesRef.current) return;
            fetchHistoricalData(symbol, '5m', 1).then(data => {
                if (data.length > 0 && seriesRef.current) {
                    const last = data[0];
                    const isKR = lang === 'KR';
                    const timezoneOffset = isKR ? 9 * 3600 : -5 * 3600;
                    const update = {
                        time: (last.time / 1000 + timezoneOffset) as any,
                        open: isKR ? last.open * exchangeRate : last.open,
                        high: isKR ? last.high * exchangeRate : last.high,
                        low: isKR ? last.low * exchangeRate : last.low,
                        close: isKR ? last.close * exchangeRate : last.close
                    };
                    seriesRef.current.update(update);
                }
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [symbol, dataLoaded, lang, exchangeRate]); // Added lang and exchangeRate here too

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Visual background for drawing area - Approximate via CSS gradient or JS pos */}
            {/* We can do a simpler thing: Just a subtle right-border or bg color on the chart container itself won't work easily due to canvas. 
          We'll rely on the canvas "gap" being obvious. */}

            <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />

            {/* Prediction Canvas Overlay */}
            {visibleRange && startPoint && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                    <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                        <PredictionCanvas
                            key={symbol} // Forces reset on symbol change
                            minPrice={visibleRange.min}
                            maxPrice={visibleRange.max}
                            startPoint={startPoint}
                            onSubmit={onSubmit}
                        />
                    </div>
                </div>
            )}

            {!dataLoaded && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                    Loading {symbol}...
                </div>
            )}
        </div>
    );
}
