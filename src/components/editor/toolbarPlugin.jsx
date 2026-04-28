import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
// lexical
import {
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $isListNode } from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import {
    $isCodeNode,
    getCodeLanguages,
    getDefaultCodeLanguage,
} from "@lexical/code";
import { ListNode } from "@lexical/list";
import {
    $isLinkNode,
    TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// custom import
import { LowPriority } from "../../lib/constants/priority";
import { supportedBlockTypes } from "../../data/supportedBlockTypes";
import { blockTypeToBlockName } from "../../data/blockTypeToBlockName";
import Divider from "../atoms/divider"
import { Select } from "../atoms/editorSelect";
import { getSelectedNode } from "../../lib/util/getSelectedNode";
import { BlockOptionsDropdownList } from "./blockOptionsDropdownList";
import FloatingLinkEditor from "./floatingLinkEditor";
import DropdownIcon from "../assets/icons/dropdownIcon";
import BoldIcon from "../assets/icons/boldIcon";
import ItallicIcon from "../assets/icons/itallicIcon";
import CodeIcon from "../assets/icons/codeIcon";
import LinkIcon from "../assets/icons/linkIcon";

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [blockType, setBlockType] = useState("paragraph");
    const [selectedElementKey, setSelectedElementKey] = useState(null);
    const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
        useState(false);
    const [codeLanguage, setCodeLanguage] = useState("");
    const [isLink, setIsLink] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList ? parentList.getTag() : element.getTag();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();
                    setBlockType(type);
                    if ($isCodeNode(element)) {
                        setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
                    }
                }
            }
            // Update text format
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
            setIsCode(selection.hasFormat("code"));

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateToolbar();
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, updateToolbar]);

    const codeLanguges = useMemo(() => getCodeLanguages(), []);
    const onCodeLanguageSelect = useCallback(
        (e) => {
            editor.update(() => {
                if (selectedElementKey !== null) {
                    const node = $getNodeByKey(selectedElementKey);
                    if ($isCodeNode(node)) {
                        node.setLanguage(e.target.value);
                    }
                }
            });
        },
        [editor, selectedElementKey],
    );

    const insertLink = useCallback(() => {
        if (!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    return (
        <div
            className="m-1 flex items-center gap-0.5 rounded-lg bg-gray-100 p-1"
            ref={toolbarRef}
        >
            {supportedBlockTypes.has(blockType) && (
                <>
                    <Button
                        variant="text"
                        onClick={() =>
                            setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
                        }
                        className="flex items-center gap-1 font-medium capitalize"
                        aria-label="Formatting Options"
                    >
                        {blockTypeToBlockName[blockType]}
                        <DropdownIcon />
                    </Button>
                    {showBlockOptionsDropDown &&
                        createPortal(
                            <BlockOptionsDropdownList
                                editor={editor}
                                blockType={blockType}
                                toolbarRef={toolbarRef}
                                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                            />,
                            document.body,
                        )}
                    <Divider />
                </>
            )}
            {blockType === "code" ? (
                <>
                    <Select
                        className="appearance-none rounded-md bg-transparent px-2 py-1 outline-none hover:bg-gray-900/10"
                        onChange={onCodeLanguageSelect}
                        options={codeLanguges}
                        value={codeLanguage}
                    />
                </>
            ) : (
                <>
                    <IconButton
                        variant={isBold ? "filled" : "text"}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                        }}
                        aria-label="Format Bold"
                    >
                        <BoldIcon />
                    </IconButton>
                    <IconButton
                        variant={isItalic ? "filled" : "text"}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                        }}
                        aria-label="Format Italics"
                    >
                        <ItallicIcon />
                    </IconButton>
                    <IconButton
                        variant={isCode ? "filled" : "text"}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                        }}
                        aria-label="Insert Code"
                    >
                        <CodeIcon />
                    </IconButton>
                    <IconButton
                        variant={isStrikethrough ? "filled" : "text"}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                        }}
                        aria-label="Strikethrough"
                    >
                        {/* Replace this with a Strikethrough Icon */}
                        <span className=" line-through">S</span>
                    </IconButton>
                    <IconButton
                        onClick={insertLink}
                        variant={isLink ? "filled" : "text"}
                        aria-label="Insert Link"
                    >
                        <LinkIcon />
                    </IconButton>
                    {isLink &&
                        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
                </>
            )}
        </div>
    );
}