import { SpriteProvider } from "@/context/SpriteContext/SpriteContext";
import { CanvasSizeProvider } from "@/context/CanvasSizeContext/CanvasSizeContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SpriteProvider>
      <CanvasSizeProvider>{children}</CanvasSizeProvider>
    </SpriteProvider>
  );
};

export default AppProviders;
