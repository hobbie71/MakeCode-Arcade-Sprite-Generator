import PaletteSelector from "./PaletteSelector";
import { MakeCodeColor } from "../../../types";
import type { MakeCodePalette } from "../../../types/color";
import { useColorToMakeCodeConverter } from "../../../features/InputSection/hooks/useColorToMakeCodeConverter";

const HueWheelTable = ({ palette }: { palette: MakeCodePalette }) => {
  const { hueZones } = useColorToMakeCodeConverter();

  const getColorName = (color: MakeCodeColor): string => {
    return Object.keys(MakeCodeColor)[
      Object.values(MakeCodeColor).indexOf(color)
    ];
  };

  const getLuminanceZoneWidth = (
    zoneStart: number,
    zoneEnd: number
  ): number => {
    return ((zoneEnd - zoneStart) / 100) * 200; // Scale to fit container
  };

  const getHueZoneHeight = (zoneStart: number, zoneEnd: number): number => {
    let range = zoneEnd - zoneStart;
    if (range < 0) range += 360; // Handle wrap-around
    return (range / 360) * 300; // Scale to fit container
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Hue Wheel Visualization Demo
        </h1>
        <PaletteSelector />

        <div className="space-y-6">
          {hueZones
            .sort((a, b) => a.zoneStart - b.zoneStart)
            .map((hueZone, hueIdx) => (
              <div
                key={hueIdx}
                className="border border-gray-600 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Hue Zone {hueIdx + 1}
                  </h3>
                  <div className="text-sm text-gray-300 mb-3">
                    Hue Range: {hueZone.zoneStart.toFixed(1)}° -{" "}
                    {hueZone.zoneEnd.toFixed(1)}°
                    <div
                      className="mt-2 h-4 rounded border"
                      style={{
                        background: `linear-gradient(to right, 
                      hsl(${hueZone.zoneStart}, 100%, 50%), 
                      hsl(${hueZone.zoneEnd}, 100%, 50%))`,
                        width: `${getHueZoneHeight(hueZone.zoneStart, hueZone.zoneEnd)}px`,
                        maxWidth: "300px",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-200">
                    Luminance Zones:
                  </h4>
                  {[...hueZone.luminanceZone].map((lumZone, lumIdx) => (
                    <div
                      key={lumIdx}
                      className="flex items-center space-x-4 p-3 bg-gray-800 rounded">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded border border-gray-500"
                          style={{
                            backgroundColor:
                              palette[lumZone.color as keyof MakeCodePalette],
                          }}
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            {getColorName(lumZone.color)}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({lumZone.color})
                          </span>
                        </div>

                        <div className="text-sm text-gray-300">
                          Luminance: {lumZone.luminance.toFixed(1)}%
                        </div>

                        <div className="text-sm text-gray-300">
                          Range: {lumZone.zoneStart.toFixed(1)}% -{" "}
                          {lumZone.zoneEnd.toFixed(1)}%
                        </div>

                        <div className="mt-2">
                          <div
                            className="h-3 rounded border border-gray-600"
                            style={{
                              background: `linear-gradient(to right, 
                            hsl(${(hueZone.zoneStart + hueZone.zoneEnd) / 2}, 50%, ${lumZone.zoneStart}%), 
                            hsl(${(hueZone.zoneStart + hueZone.zoneEnd) / 2}, 50%, ${lumZone.zoneEnd}%))`,
                              width: `${getLuminanceZoneWidth(lumZone.zoneStart, lumZone.zoneEnd)}px`,
                              maxWidth: "200px",
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-xs text-gray-400">
                        Hex: {palette[lumZone.color as keyof MakeCodePalette]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-300">Total Hue Zones:</span>
              <span className="ml-2 font-medium">{hueZones.length}</span>
            </div>
            <div>
              <span className="text-gray-300">Total Luminance Zones:</span>
              <span className="ml-2 font-medium">
                {hueZones.reduce(
                  (sum, zone) => sum + zone.luminanceZone.length,
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HueWheelTable;
