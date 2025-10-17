const Footer = () => (
  <footer className="text-center p-3 text-sm text-text-default-100 flex md:flex-row flex-col flex-wrap justify-around items-center gap-2 bg-default-100">
    <div>
      <div>Copyright © 2025 hobbie71. All rights reserved.</div>
      <div>
        GitHub Repository:{" "}
        <a
          href="https://github.com/hobbie71/MakeCode-Arcade-Sprite-Generator"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-text-default-200 hover:text-text-default-300">
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
