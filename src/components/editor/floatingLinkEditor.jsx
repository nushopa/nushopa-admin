import { useCallback, useEffect, useRef, useState } from "react";
import {
  Input,
  IconButton,
  Typography,
} from "@material-tailwind/react";
 
// lexical
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";

import { mergeRegister } from "@lexical/utils";
import { getSelectedNode } from "../../lib/util/getSelectedNode";
import { positionEditorElement } from "../../lib/util/positionEditorElement";
import { LowPriority } from "../../lib/constants/priority";
import EditPencilIcon from "../assets/icons/editPencilIcon";

export default function FloatingLinkEditor({ editor }) {
    const editorRef = useRef(null);
    const inputRef = useRef(null);
    const mouseDownRef = useRef(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [isEditMode, setEditMode] = useState(false);
    const [lastSelection, setLastSelection] = useState(null);
   
    const updateLinkEditor = useCallback(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
          setLinkUrl(parent.getURL());
        } else if ($isLinkNode(node)) {
          setLinkUrl(node.getURL());
        } else {
          setLinkUrl("");
        }
      }
      const editorElem = editorRef.current;
      const nativeSelection = window.getSelection();
      const activeElement = document.activeElement;
   
      if (editorElem === null) {
        return;
      }
   
      const rootElement = editor.getRootElement();
      if (
        selection !== null &&
        !nativeSelection.isCollapsed &&
        rootElement !== null &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        const domRange = nativeSelection.getRangeAt(0);
        let rect;
        if (nativeSelection.anchorNode === rootElement) {
          let inner = rootElement;
          while (inner.firstElementChild != null) {
            inner = inner.firstElementChild;
          }
          rect = inner.getBoundingClientRect();
        } else {
          rect = domRange.getBoundingClientRect();
        }
   
        if (!mouseDownRef.current) {
          positionEditorElement(editorElem, rect);
        }
        setLastSelection(selection);
      } else if (!activeElement || activeElement.className !== "link-input") {
        positionEditorElement(editorElem, null);
        setLastSelection(null);
        setEditMode(false);
        setLinkUrl("");
      }
   
      return true;
    }, [editor]);
   
    useEffect(() => {
      return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            updateLinkEditor();
          });
        }),
   
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            updateLinkEditor();
            return true;
          },
          LowPriority,
        ),
      );
    }, [editor, updateLinkEditor]);
   
    useEffect(() => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    }, [editor, updateLinkEditor]);
   
    useEffect(() => {
      if (isEditMode && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditMode]);
   
    return (
      <div
        ref={editorRef}
        className="absolute -left-[10000px] -top-[10000px] !z-[10000] -mt-1.5 w-full max-w-xs rounded-lg border border-gray-300 bg-white opacity-0 transition-opacity duration-500"
      >
        {isEditMode ? (
          <Input
            ref={inputRef}
            value={linkUrl}
            onChange={(event) => {
              setLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (lastSelection !== null) {
                  if (linkUrl !== "") {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                  }
                  setEditMode(false);
                }
              } else if (event.key === "Escape") {
                event.preventDefault();
                setEditMode(false);
              }
            }}
            className="border-gray-200 !border-t-gray-200 focus:!border-gray-900 focus:!border-t-gray-900"
            labelProps={{
              className: "hidden",
            }}
          />
        ) : (
          <>
            <div className="relative box-border flex w-full items-center justify-between rounded-lg border-0 bg-white px-3 py-2 font-[inherit] text-gray-900">
              <Typography
                as="a"
                variant="small"
                color="blue"
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-8 block overflow-hidden text-ellipsis whitespace-nowrap font-normal no-underline hover:underline"
              >
                {linkUrl}
              </Typography>
              <IconButton
                role="button"
                tabIndex={0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <EditPencilIcon/>
              </IconButton>
            </div>
          </>
        )}
      </div>
    );
  }