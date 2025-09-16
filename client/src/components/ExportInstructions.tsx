import X_Button from "./X_Button";

interface Props {
  closeExportInstructions: () => void;
}

const ExportInstructions = ({ closeExportInstructions }: Props) => {
  return (
    <div className="popup-content text-center">
      <X_Button
        onClick={closeExportInstructions}
        className="absolute right-4 top-4"
      />
      <h4 className="heading-4 mb-4 border-b-[1px] border-solid border-white">
        How To Export to MakeCode Arcade
      </h4>

      <div className="mb-4 flex flex-col gap-6">
        <ol className="list-decimal list-inside text-neutral-300 text-sm text-left space-y-2">
          <li>
            Copy the <b>Sprite Editor Code</b> in <b>Export Sprite</b> section.
          </li>
          <li>
            Open the <b>MakeCode Arcade Sprite Editor</b>.
          </li>
          <li>Click inside the Sprite Editor canvas</li>
          <li>
            Paste the code directly into the editor using:
            <div>
              Windows: <span className="font-mono">Ctrl + V</span>
            </div>
            <div>
              Apple: <span className="font-mono">Command + V</span>
            </div>
          </li>
          <li>Your sprite will appear in the editor, ready to use!</li>
        </ol>
        <div className="text-neutral-300 text-sm">
          Need help? See the animation below for a visual guide.
        </div>
        <img
          src="../preview.gif"
          alt="How to copy and paste into MakeCode Arcade"
          className="max-w-[640px] h-auto rounded shadow"
        />
      </div>
    </div>
  );
};

export default ExportInstructions;
