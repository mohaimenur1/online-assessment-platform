'use client';
import { useTimer } from '@/lib/hooks';

export default function ExamTimer({ totalSeconds, onTimeout }) {
  const { minutes, seconds, progress } = useTimer(totalSeconds, onTimeout);

  const color = progress > 0.4 ? '#10b981' : progress > 0.15 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 15; // r=15
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex items-center gap-2.5 bg-[#1e2535] rounded-xl px-4 py-2">
      <svg width="32" height="32" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="none" stroke="#2d3748" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 18 18)"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s' }}
        />
      </svg>
      <span
        className="text-lg font-bold tabular-nums"
        style={{ color, minWidth: 56 }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
