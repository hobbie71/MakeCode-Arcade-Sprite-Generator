import SpriteEditorProvider from "./provider/SpriteEditorProviders";
import EditorSurface from "./EditorSurface";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
  onOpenExport: () => void;
}

/** The sprite editor: editor-local context providers wrapping the EditorSurface. */
const SpriteEditor = (props: Props) => {
  return (
    <SpriteEditorProvider>
      <EditorSurface {...props} />
    </SpriteEditorProvider>
  );
};

export default SpriteEditor;
