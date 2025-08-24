import { MakeCodeColor } from "@/types/color";

export interface HueZone {
  luminanceZone: LuminanceZone[];
  zoneStart: number;
  zoneEnd: number;
}

export interface LuminanceZone {
  color: MakeCodeColor;
  luminance: number;
  zoneStart: number;
  zoneEnd: number;
}
