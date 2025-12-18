import React from 'react';

interface LogoProps {
    size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 32 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="url(#gradient)" />
            <path
                d="M30 70V30L50 45L70 30V70"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Logo;
