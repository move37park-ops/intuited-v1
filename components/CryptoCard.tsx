"use client";

import React from 'react';

interface CryptoCardProps {
    symbol: string;
    name: string;
    price: number;
    lang: 'ENG' | 'KR';
    exchangeRate: number;
    bgImage?: string;
    themeColor?: string;
    onDraw: () => void;
}

export default function CryptoCard({ symbol, name, price, lang, exchangeRate, bgImage, themeColor, onDraw }: CryptoCardProps) {
    const isKR = lang === 'KR';
    const displayPrice = isKR ? price * exchangeRate : price;
    const formattedPrice = displayPrice ? displayPrice.toLocaleString(undefined, {
        minimumFractionDigits: isKR ? 0 : 2,
        maximumFractionDigits: isKR ? 0 : 2
    }) : '---';

    return (
        <div
            className="group relative flex flex-col p-10 bg-black hover:bg-zinc-950 border border-white/10 transition-all duration-700 h-80 justify-between items-center text-center overflow-hidden"
        >
            {/* Background Image - Interactive blur effect */}
            {bgImage && (
                <div
                    className="absolute inset-0 z-0 opacity-40 transition-all duration-500 blur-[4px] group-hover:blur-0 grayscale group-hover:grayscale-0 group-hover:opacity-70"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}

            {/* Theme Color Radial Gradient - Increased intensity */}
            {themeColor && (
                <div
                    className="absolute inset-0 z-0 opacity-15 group-hover:opacity-35 transition-opacity duration-700"
                    style={{
                        background: `radial-gradient(circle at center, ${themeColor} 0%, transparent 80%)`
                    }}
                />
            )}

            {/* Minimal overlay for text protection */}
            <div className="absolute inset-0 z-1 bg-black/20" />

            <div className="z-10 w-full relative">
                <div className="text-[11px] tracking-[0.4em] text-white/60 mb-2 font-medium uppercase">
                    {name}
                </div>
                <h3 className="text-4xl font-extralight text-white mb-8 tracking-[0.3em] uppercase">{symbol}</h3>
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-light text-white/50 select-none">{isKR ? '₩' : '$'}</span>
                    <span className="text-3xl font-medium text-white tracking-tight tabular-nums">
                        {formattedPrice}
                    </span>
                </div>
            </div>

            <button
                onClick={onDraw}
                className="z-10 w-full py-4 px-10 border border-white/25 bg-white/[0.03] text-white/70 text-xs font-bold tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all duration-500 uppercase rounded-sm"
            >
                DRAW & MERGE
            </button>

            {/* Minimalist hover shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        </div>
    );
}
