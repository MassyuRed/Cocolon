import React from "react";
import Svg, { Circle, G } from "react-native-svg";

import { EMOTIONS, coerceNum } from "./analysisReportFormatters";
import { normalizeEmotionMap } from "./analysisReportNormalize";

export function PieRingChart({ shares, size = 88, strokeWidth = 14, trackColor = "#E5E7EB" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedShares = normalizeEmotionMap(shares);
  const segments = EMOTIONS.map((emotion) => ({
    key: emotion.key,
    color: emotion.color,
    value: Math.max(0, Math.min(100, coerceNum(normalizedShares[emotion.key]))),
  })).filter((segment) => segment.value > 0);

  let offset = 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
        {segments.map((segment) => {
          const arcLength = (segment.value / 100) * circumference;
          const element = (
            <Circle
              key={segment.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${arcLength} ${Math.max(circumference - arcLength, 0)}`}
              strokeDashoffset={-offset}
              strokeLinecap={segments.length === 1 ? "round" : "butt"}
            />
          );
          offset += arcLength;
          return element;
        })}
      </G>
    </Svg>
  );
}
