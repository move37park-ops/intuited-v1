"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';
import { fetchHistoricalData } from '@/utils/binance';
import PredictionCanvas from './PredictionCanvas';

interface InteractiveChartProps {
    symbol?: string;
    onSubmit?: () => void;
}

export default function InteractiveChart({ symbol = 'BTCUSDT', onSubmit }: InteractiveChartProps) {
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
                vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                borderColor: '#333',
                timeVisible: true,
                rightOffset: 200, // Increased space (~2h worth)
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

        // Initial Data Fetch
        fetchHistoricalData(symbol, '1m', 100).then(data => {
            const formatData = data.map(d => ({
                time: d.time / 1000 as any,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close
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
    }, [symbol]);

    // Polling Data
    useEffect(() => {
        if (!dataLoaded) return;
        const interval = setInterval(() => {
            if (!seriesRef.current) return;
            fetchHistoricalData(symbol, '1m', 1).then(data => {
                if (data.length > 0 && seriesRef.current) {
                    const last = data[0];
                    const update = {
                        time: last.time / 1000 as any,
                        open: last.open,
                        high: last.high,
                        low: last.low,
                        close: last.close
                    };
                    seriesRef.current.update(update);
                }
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [symbol, dataLoaded]);

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
