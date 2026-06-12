// Fabric (Office UI Fabric / MDL2) icon glyph — the icon set MakeCode Arcade uses.
// The font itself is loaded by useFabricIcons() (call it once at the top of any
// composition that renders these); this component just emits the glyph element.
export const MsIcon: React.FC<{
  name: string;
  style?: React.CSSProperties;
}> = ({ name, style }) => (
  <i
    className={`ms-Icon ms-Icon--${name}`}
    aria-hidden="true"
    style={{ fontStyle: "normal", lineHeight: 1, ...style }}
  />
);
