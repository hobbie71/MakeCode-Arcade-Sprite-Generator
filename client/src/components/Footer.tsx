const Footer = () => (
  <footer className="text-center py-1 text-sm text-gray-400 flex flex-row flex-wrap justify-around items-center gap-2">
    <div>
      <div>Copyright © 2025 hobbie71. All rights reserved.</div>
      <div>
        GitHub Repository:{" "}
        <a
          href="https://github.com/hobbie71/MakeCode-Arcade-Sprite-Generator"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-gray-400 hover:text-gray-300">
          MakeCode-Arcade-Sprite-Generator
        </a>
      </div>
    </div>
    <div>
      <strong>MakeCode Arcade AI Sprite Generator</strong>
    </div>
    <div>
      <div>Not affiliated with Microsoft or MakeCode Arcade</div>
      <div>
        Built with{" "}
        <span role="img" aria-label="love">
          ❤️
        </span>{" "}
        for the MakeCode Arcade community
      </div>
    </div>
  </footer>
);

export default Footer;
