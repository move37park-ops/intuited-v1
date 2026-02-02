"use client";

import { useEffect, useState } from 'react';

interface StatsBoardProps {
    lang: 'ENG' | 'KR';
}

export default function StatsBoard({ lang }: StatsBoardProps) {
    const [stats, setStats] = useState({
        totalPaths: 124503,
        activeParticipants: 428,
        systemAccuracy: 64.2
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                totalPaths: prev.totalPaths + Math.floor(Math.random() * 3),
                activeParticipants: 400 + Math.floor(Math.random() * 50),
                systemAccuracy: 64.0 + Math.random() * 2
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const labels = {
        ENG: {
            paths: "TOTAL PATHS",
            participants: "ACTIVE PARTICIPANTS",
            accuracy: "SYSTEM ACCURACY"
        },
        KR: {
            paths: "총 예측 경로 수",
            participants: "총 참여자 수",
            accuracy: "시스템 정확도"
        }
    };

    return (
        <div className="flex items-center justify-center space-x-6 md:space-x-12">
            <StatItem label={labels[lang].paths} value={stats.totalPaths.toLocaleString()} />
            <div className="w-px h-6 bg-white/10" />
            <StatItem label={labels[lang].participants} value={stats.activeParticipants.toString()} />
            <div className="w-px h-6 bg-white/10" />
            <StatItem label={labels[lang].accuracy} value={`${stats.systemAccuracy.toFixed(1)} %`} />
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col items-center text-center px-4 md:px-8">
            <span className="text-xs md:text-sm tracking-[0.3em] text-white/40 mb-3 leading-none uppercase truncate w-full font-bold">
                {label}
            </span>
            <span className="text-3xl md:text-5xl font-light text-white leading-none tabular-nums tracking-tighter drop-shadow-lg">
                {value}
            </span>
        </div>
    );
}


