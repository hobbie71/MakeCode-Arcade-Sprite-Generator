import React from "react";
import { useColorToMakeCodeConverter } from "@/features/InputSection/hooks/useColorToMakeCodeConverter";
import { MakeCodePalette } from "@/types/color";
import PaletteSelector from "./PaletteSelector";

interface Props {
  palette: MakeCodePalette;
}

const HueWheelVisualization: React.FC<Props> = ({ palette }) => {
  const { hueZones } = useColorToMakeCodeConverter(palette);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Hue Wheel Visualization
      </h2>
      <PaletteSelector />

      {/* Full Circle Hue Wheel */}
      <div className="mt-8 flex justify-center">
        <div className="relative">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Interactive Hue Wheel
          </h3>
          <svg
            width="500"
            height="500"
            viewBox="0 0 500 500"
            className="border border-gray-600 rounded-lg bg-gray-800">
            <defs>
              {/* Radial gradient for the background hue wheel */}
              <defs>
                {Array.from({ length: 360 }, (_, i) => (
                  <linearGradient
                    key={`gradient-${i}`}
                    id={`hue-${i}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%">
                    <stop offset="0%" stopColor={`hsl(${i}, 100%, 80%)`} />
                    <stop offset="50%" stopColor={`hsl(${i}, 100%, 50%)`} />
                    <stop offset="100%" stopColor={`hsl(${i}, 100%, 20%)`} />
                  </linearGradient>
                ))}
              </defs>
            </defs>

            {/* Background full hue circle for reference */}
            {Array.from({ length: 360 }, (_, degree) => {
              const startAngle = (degree * Math.PI) / 180;
              const endAngle = ((degree + 1) * Math.PI) / 180;
              const outerRadius = 200;
              const innerRadius = 180;
              const centerX = 250;
              const centerY = 250;

              const x1 = centerX + innerRadius * Math.cos(startAngle);
              const y1 = centerY + innerRadius * Math.sin(startAngle);
              const x2 = centerX + outerRadius * Math.cos(startAngle);
              const y2 = centerY + outerRadius * Math.sin(startAngle);
              const x3 = centerX + outerRadius * Math.cos(endAngle);
              const y3 = centerY + outerRadius * Math.sin(endAngle);
              const x4 = centerX + innerRadius * Math.cos(endAngle);
              const y4 = centerY + innerRadius * Math.sin(endAngle);

              return (
                <path
                  key={`bg-${degree}`}
                  d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`}
                  fill={`hsl(${degree}, 100%, 50%)`}
                  opacity="0.2"
                />
              );
            })}

            {/* Hue zones with luminance rings */}
            {hueZones.map((zone, zoneIdx) => {
              const zoneStart = zone.zoneStart;
              let zoneEnd = zone.zoneEnd;

              // Handle wrap-around for display
              if (zoneEnd < zoneStart) {
                zoneEnd += 360;
              }

              const colors = [
                "#ff6b6b",
                "#4ecdc4",
                "#45b7d1",
                "#96ceb4",
                "#feca57",
                "#ff9ff3",
                "#54a0ff",
              ];
              const zoneColor = colors[zoneIdx % colors.length];

              return (
                <g key={`zone-${zoneIdx}`}>
                  {/* Outer hue zone boundary */}
                  {(() => {
                    const startAngle = (zoneStart * Math.PI) / 180;
                    const endAngle = (zoneEnd * Math.PI) / 180;
                    const outerRadius = 200;
                    const innerRadius = 180;
                    const centerX = 250;
                    const centerY = 250;

                    const x1 = centerX + innerRadius * Math.cos(startAngle);
                    const y1 = centerY + innerRadius * Math.sin(startAngle);
                    const x2 = centerX + outerRadius * Math.cos(startAngle);
                    const y2 = centerY + outerRadius * Math.sin(startAngle);
                    const x3 = centerX + outerRadius * Math.cos(endAngle);
                    const y3 = centerY + outerRadius * Math.sin(endAngle);
                    const x4 = centerX + innerRadius * Math.cos(endAngle);
                    const y4 = centerY + innerRadius * Math.sin(endAngle);

                    const largeArcFlag =
                      Math.abs(zoneEnd - zoneStart) > 180 ? 1 : 0;

                    return (
                      <path
                        d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`}
                        fill="none"
                        stroke={zoneColor}
                        strokeWidth="3"
                        opacity="0.8"
                      />
                    );
                  })()}

                  {/* Luminance zones as concentric rings */}
                  {[...zone.luminanceZone].map((lumZone, lumIdx) => {
                    const ringWidth = 25;
                    const baseRadius = 60;
                    const radius = baseRadius + lumIdx * ringWidth;

                    const startAngle = (zoneStart * Math.PI) / 180;
                    const endAngle = (zoneEnd * Math.PI) / 180;
                    const centerX = 250;
                    const centerY = 250;

                    const x1 = centerX + radius * Math.cos(startAngle);
                    const y1 = centerY + radius * Math.sin(startAngle);
                    const x2 =
                      centerX + (radius + ringWidth) * Math.cos(startAngle);
                    const y2 =
                      centerY + (radius + ringWidth) * Math.sin(startAngle);
                    const x3 =
                      centerX + (radius + ringWidth) * Math.cos(endAngle);
                    const y3 =
                      centerY + (radius + ringWidth) * Math.sin(endAngle);
                    const x4 = centerX + radius * Math.cos(endAngle);
                    const y4 = centerY + radius * Math.sin(endAngle);

                    const largeArcFlag =
                      Math.abs(zoneEnd - zoneStart) > 180 ? 1 : 0;

                    return (
                      <g key={`lum-${zoneIdx}-${lumZone.color}-${lumIdx}`}>
                        <path
                          d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius + ringWidth} ${radius + ringWidth} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`}
                          fill={palette[lumZone.color]}
                          stroke="#374151"
                          strokeWidth="1"
                          opacity="0.9"
                        />
                        {/* Label for the luminance zone */}
                        <text
                          x={
                            centerX +
                            (radius + ringWidth / 2) *
                              Math.cos((startAngle + endAngle) / 2)
                          }
                          y={
                            centerY +
                            (radius + ringWidth / 2) *
                              Math.sin((startAngle + endAngle) / 2)
                          }
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                          stroke="black"
                          strokeWidth="0.5">
                          {lumZone.color}
                        </text>
                        {/* Range label */}
                        <text
                          x={
                            centerX +
                            (radius + ringWidth / 4) *
                              Math.cos((startAngle + endAngle) / 2)
                          }
                          y={
                            centerY +
                            (radius + ringWidth / 4) *
                              Math.sin((startAngle + endAngle) / 2) +
                            12
                          }
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="8"
                          stroke="black"
                          strokeWidth="0.3">
                          {lumZone.zoneStart}-{lumZone.zoneEnd}
                        </text>
                      </g>
                    );
                  })}

                  {/* Zone label */}
                  <text
                    x={
                      250 +
                      190 *
                        Math.cos((((zoneStart + zoneEnd) / 2) * Math.PI) / 180)
                    }
                    y={
                      250 +
                      190 *
                        Math.sin((((zoneStart + zoneEnd) / 2) * Math.PI) / 180)
                    }
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    stroke="black"
                    strokeWidth="1">
                    Z{zoneIdx + 1}
                  </text>
                </g>
              );
            })}

            {/* Degree markers */}
            {Array.from({ length: 36 }, (_, i) => {
              const degree = i * 10;
              const angle = (degree * Math.PI) / 180;
              const innerRadius = 210;
              const outerRadius = 220;
              const centerX = 250;
              const centerY = 250;

              const x1 = centerX + innerRadius * Math.cos(angle);
              const y1 = centerY + innerRadius * Math.sin(angle);
              const x2 = centerX + outerRadius * Math.cos(angle);
              const y2 = centerY + outerRadius * Math.sin(angle);

              return (
                <g key={`marker-${degree}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={centerX + 235 * Math.cos(angle)}
                    y={centerY + 235 * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold">
                    {degree}°
                  </text>
                </g>
              );
            })}

            {/* Center circle with legend */}
            <circle
              cx="250"
              cy="250"
              r="50"
              fill="#1f2937"
              stroke="#374151"
              strokeWidth="3"
            />
            <text
              x="250"
              y="245"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold">
              Hue Wheel
            </text>
            <text
              x="250"
              y="260"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="10">
              {hueZones.length} zones
            </text>
          </svg>

          {/* Legend */}
          <div className="mt-4 p-3 bg-gray-800 rounded-lg text-sm">
            <h4 className="font-semibold mb-2">Legend:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>• Outer ring: Full hue spectrum</div>
              <div>• Colored zones: Your hue zones</div>
              <div>• Inner rings: Luminance zones</div>
              <div>• Letters: MakeCode color IDs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HueWheelVisualization;
