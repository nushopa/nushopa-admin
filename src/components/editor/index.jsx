import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

// custom imports
import { Placeholder } from "../atoms/placeholder";
import { editorConfig } from "../../config/editorConfig";
import ToolbarPlugin from "./toolbarPlugin";

export function TextEditorReact({ handleEditorChange }) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative overflow-hidden my-5 w-full max-w-full rounded-xl border border-gray-300 bg-white text-left font-normal leading-5 text-gray-900">
        <ToolbarPlugin />
        <div className="relative rounded-b-lg border-opacity-5 bg-white">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="lexical min-h-[280px] resize-none px-2.5 py-4 text-base caret-gray-900 outline-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={null}
          />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          {/* Add the OnChangePlugin */}
          <OnChangePlugin onChange={handleEditorChange} />        </div>
      </div>
    </LexicalComposer>
  );
}
