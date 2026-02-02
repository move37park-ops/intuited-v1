"use client";

import React from 'react';

interface AssetCardProps {
    symbol: string;
    name: string;
    price: number;
    prevPrice?: number;
    lang: 'ENG' | 'KR';
    exchangeRate: number;
    themeColor: string;
    bgImage?: string;
    onDraw: (timeframe: '4H' | '1Q') => void;
}

export default function AssetCard({
    symbol,
    name,
    price,
    lang,
    exchangeRate,
    themeColor,
    bgImage,
    onDraw
}: AssetCardProps) {

    const displayPrice = lang === 'KR'
        ? (price * exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })
        : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const currency = lang === 'KR' ? 'KRW' : 'USD';

    return (
        <div
            className="group relative h-48 md:h-64 border border-white/5 bg-black/40 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden flex flex-col cursor-default isolate rounded-sm"
        >
            {/* Background Gradient / Glow */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-to-br from-transparent via-white/[0.02] to-white/5 -z-10" />

            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl -z-10"
                style={{ background: `radial-gradient(circle at center, ${themeColor}, transparent 80%)` }}
            />

            {/* LAYER 1: DATA (Hidden on Hover) */}
            <div className="flex-1 flex flex-col justify-between p-6 transition-all duration-500 group-hover:opacity-0 group-hover:scale-[0.98] group-hover:blur-sm z-10">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase mb-1">{symbol}</span>
                        <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight">{name}</h3>
                    </div>
                    {bgImage && (
                        <div className="w-8 h-8 relative flex-shrink-0 opacity-40 grayscale">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={bgImage} alt={name} className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl md:text-3xl font-light text-white tracking-widest">{displayPrice}</span>
                        <span className="text-xs font-bold text-white/20 tracking-widest">{currency}</span>
                    </div>
                    <div className="mt-4 h-0.5 w-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-white/20 w-0 group-hover:w-full transition-all duration-1000 ease-out" />
                    </div>
                </div>
            </div>

            {/* LAYER 2: ACTIONS (Full Card Buttons, Shown on Hover) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto flex flex-col z-20 translate-y-4 group-hover:translate-y-0">
                {/* 4H Button - Top Half */}
                <button
                    onClick={(e) => { e.stopPropagation(); onDraw('4H'); }}
                    className="flex-1 w-full group/btn relative flex flex-col items-center justify-center border-b border-white/5 hover:bg-white/[0.08] transition-all"
                >
                    <div className="absolute inset-0 bg-blue-500/0 group-hover/btn:bg-blue-500/[0.02] transition-colors" />
                    <span className="text-3xl font-light tracking-[0.3em] text-white/40 group-hover/btn:text-white transition-all transform group-hover/btn:scale-110">4H</span>
                    <span className="text-[10px] font-bold tracking-[0.4em] text-white/20 group-hover/btn:text-blue-400 uppercase mt-2 transition-all">
                        {lang === 'ENG' ? 'SHORT-TERM FLOW' : '단기 흐름 예측'}
                    </span>
                    {/* Visual indicator dot */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse opacity-0 group-hover/btn:opacity-100" />
                </button>

                {/* 1Q Button - Bottom Half */}
                <button
                    onClick={(e) => { e.stopPropagation(); onDraw('1Q'); }}
                    className="flex-1 w-full group/btn relative flex flex-col items-center justify-center hover:bg-white/[0.08] transition-all"
                >
                    <div className="absolute inset-0 bg-purple-500/0 group-hover/btn:bg-purple-500/[0.02] transition-colors" />
                    <span className="text-3xl font-light tracking-[0.3em] text-white/40 group-hover/btn:text-white transition-all transform group-hover/btn:scale-110">1Q</span>
                    <span className="text-[10px] font-bold tracking-[0.4em] text-white/20 group-hover/btn:text-purple-400 uppercase mt-2 transition-all">
                        {lang === 'ENG' ? 'MID-TERM FLOW' : '중기 흐름 예측'}
                    </span>
                    {/* Visual indicator dot */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse opacity-0 group-hover/btn:opacity-100" />
                </button>
            </div>
        </div>
    );
}
