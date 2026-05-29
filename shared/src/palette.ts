import { z } from "zod";

// The MakeCode palette as it crosses the wire: a flat object mapping single-char
// colour codes (".", "1".."f") to CSS colour strings, e.g.
//   { ".": "rgba(0,0,0,0)", "1": "#FFFFFF", ... }
// Per ADR-0002 only this generic type is shared — the MakeCodeColor enum and the
// concrete palette catalogs (ArcadePalette, etc.) stay in the client.
export const MakeCodePaletteSchema = z.record(z.string(), z.string());
export type MakeCodePalette = z.infer<typeof MakeCodePaletteSchema>;
