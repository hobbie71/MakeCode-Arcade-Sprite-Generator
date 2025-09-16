import Button from "./Button";

interface Props {
  toggleMobileSidebar: () => void;
  toggleExportInstructions: () => void;
}

const NavBar = ({ toggleMobileSidebar, toggleExportInstructions }: Props) => {
  return (
    <nav className="bg-[#171717] flex flex-row justify-between p-4">
      <div className="flex flex-row items-center">
        <img
          className="max-h-12"
          src="/web-app-manifest-192x192.png"
          alt="MakeSpriteCode.com"
        />
        <h1 className="text-white font-bold text-center pl-4 hidden sm:text-lg">
          MakeCode Arcade AI Sprite Generator
        </h1>
      </div>
      <div className="items-center flex flex-row space-x-6">
        <Button
          onClick={toggleExportInstructions}
          aria-label="Show how to export sprite"
          variant="primary">
          How to Export
        </Button>
        <Button
          onClick={toggleMobileSidebar}
          aria-label="Toggle sidebar"
          variant="primary"
          className="sm:hidden">
          Generate
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
