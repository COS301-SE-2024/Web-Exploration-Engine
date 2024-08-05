import React from 'react';
import { CircularProgress } from '@nextui-org/react';

interface CircularProgressInterface {
    value: number;
    label: 'Anger' | 'Disgust' | 'Fear' | 'Joy' | 'Neutral' | 'Sadness' | 'Surprise';
}

export default function CircularProgressSentiment({value, label}: CircularProgressInterface) {
    const emotionEmojis = {
        Anger: '😡',
        Disgust: '🤢',
        Fear: '😱',
        Joy: '😊',
        Neutral: '😐',
        Sadness: '😢',
        Surprise: '😲'
    };

    const emotionColours = {
        Anger: { color: '#FF0000', darkColor: '#940000' },
        Disgust: { color: '#8B4513', darkColor: '#b28d6e' },
        Fear: { color: '#8A2BE2', darkColor: '#BB86FC' },
        Joy: { color: '#F9B133', darkColor: '#FFD700' }, // Same for both modes
        Neutral: { color: '#808080', darkColor: '#95969d' },
        Sadness: { color: '#1E90FF', darkColor: '#3fafe8' },
        Surprise: { color: '#E97837', darkColor: '#FF8C00' }
    };

    const { color, darkColor } = emotionColours[label];

    return(
        <div className="relative inline-block">
            <CircularProgress
                classNames={{
                    svg: "w-[10rem] h-[10rem]",
                    indicator: "circular-progress-indicator",
                    track: "stroke-primaryTextColor/10 dark:stroke-dark-primaryTextColor/10",
                    value: "text-2xl lg:text-3xl font-semibold text-primaryTextColor dark:text-dark-primaryTextColor items-start pt-[5rem]",
                    label: "text-primaryTextColor dark:text-dark-primaryTextColor font-semibold",
                }}
                style={{
                    '--indicator-color': color,
                    '--dark-indicator-color': darkColor
                }}
                label={label}
                value={value}
                showValueLabel={true}
            />
            <div className="absolute inset-0 flex items-end pb-[7rem] justify-center">
                <div role="img" aria-label="star" className="text-3xl">{emotionEmojis[label]}</div>
            </div>
        </div>
    );

} 