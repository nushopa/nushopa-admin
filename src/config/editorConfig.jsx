import {
  QuoteNode,
  HeadingNode,
} from "@lexical/rich-text";

import { ListItemNode, ListNode } from "@lexical/list";
import {
  AutoLinkNode,
  LinkNode,
} from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";

export const editorConfig = {
    namespace: "MyEditor",
    onError(error) {
      throw error;
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
    ],
  };
   