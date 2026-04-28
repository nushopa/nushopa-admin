import { useEffect, useRef } from "react";
import {
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";

// lexical
import {
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
} from "lexical";
import {
    REMOVE_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
    $createQuoteNode,
    $createHeadingNode,
} from "@lexical/rich-text";
import {
    $createCodeNode,
} from "@lexical/code";
import { $wrapNodes } from "@lexical/selection";
import NormalIcon from "../assets/icons/normalIcon";
import LargeHeadingIcon from "../assets/icons/largeHeadingIcon";
import SmallHeadingIcon from "../assets/icons/smallHeadingIcon";
import BulletListIcon from "../assets/icons/bulletListIcon";
import NumberedListIcon from "../assets/icons/numberedListIcon";
import QuoteIcon from "../assets/icons/quoteIcon";
import CodeIcon from "../assets/icons/codeIcon";

export function BlockOptionsDropdownList({
    editor,
    blockType,
    toolbarRef,
    setShowBlockOptionsDropDown
}) {
    const dropDownRef = useRef(null);

    useEffect(() => {
        const toolbar = toolbarRef.current;
        const dropDown = dropDownRef.current;

        if (toolbar !== null && dropDown !== null) {
            const { top, left } = toolbar.getBoundingClientRect();
            dropDown.style.top = `${top + 40}px`;
            dropDown.style.left = `${left}px`;
        }
    }, [dropDownRef, toolbarRef]);

    useEffect(() => {
        const dropDown = dropDownRef.current;
        const toolbar = toolbarRef.current;

        if (dropDown !== null && toolbar !== null) {
            const handle = (event) => {
                const target = event.target;

                if (!dropDown.contains(target) && !toolbar.contains(target)) {
                    setShowBlockOptionsDropDown(false);
                }
            };
            document.addEventListener("click", handle);

            return () => {
                document.removeEventListener("click", handle);
            };
        }
    }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

    const formatParagraph = () => {
        if (blockType !== "paragraph") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createParagraphNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatLargeHeading = () => {
        if (blockType !== "h1") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode("h1"));
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatSmallHeading = () => {
        if (blockType !== "h2") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode("h2"));
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatBulletList = () => {
        if (blockType !== "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatNumberedList = () => {
        if (blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatQuote = () => {
        if (blockType !== "quote") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createQuoteNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    const formatCode = () => {
        if (blockType !== "code") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createCodeNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };

    return (
        <List
            className="absolute !z-[10000] flex flex-col gap-0.5 rounded-lg border border-blue-gray-50 bg-white p-1"
            ref={dropDownRef}
        >
            <ListItem
                selected={blockType === "paragraph"}
                className="rounded-md py-2"
                onClick={formatParagraph}
            >
                <NormalIcon/>
                Normal
            </ListItem>
            <ListItem
                selected={blockType === "h1"}
                className="rounded-md py-2"
                onClick={formatLargeHeading}
            >
                <LargeHeadingIcon/>
                Large Heading
            </ListItem>
            <ListItem
                selected={blockType === "h2"}
                className="rounded-md py-2"
                onClick={formatSmallHeading}
            >
                <SmallHeadingIcon/>
                Small Heading
            </ListItem>
            <ListItem
                selected={blockType === "ul"}
                className="rounded-md py-2"
                onClick={formatBulletList}
            >
                <BulletListIcon/>
                Bullet List
            </ListItem>
            <ListItem
                selected={blockType === "ol"}
                className="rounded-md py-2"
                onClick={formatNumberedList}
            >
            <NumberedListIcon/>
                Numbered List
            </ListItem>
            <ListItem
                selected={blockType === "quote"}
                className="rounded-md py-2"
                onClick={formatQuote}
            >
                <QuoteIcon/>
                Quote
            </ListItem>
            <ListItem
                selected={blockType === "code"}
                className="rounded-md py-2"
                onClick={formatCode}
            >
                <ListItemPrefix>
                   <CodeIcon/>
                </ListItemPrefix>
                Code
            </ListItem>
        </List>
    );
}