import Button from "./Button";

interface Props {
  toggleMobileSidebar: () => void;
}

const NavBar = ({ toggleMobileSidebar }: Props) => {
  return (
    <nav className="bg-[#171717] flex flex-row justify-between p-4">
      <div className="flex flex-row items-center">
        <img
          className="max-h-12"
          src="/web-app-manifest-192x192.png"
          alt="MakeSpriteCode.com"
        />
        <h1 className="text-white font-bold text-center pl-4 text-sm sm:text-lg">
          MakeCode Arcade AI Sprite Generator
        </h1>
      </div>
      <div className="items-center">
        <Button
          onClick={toggleMobileSidebar}
          aria-label="Toggle sidebar"
          variant="primary"
          className="sm:hidden bottom-4 right-4 z-40">
          Generate
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
