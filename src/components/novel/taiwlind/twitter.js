import React from "react";
import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Tweet } from "react-tweet";

// Accept both twitter.com and x.com status URLs
export const TWITTER_STATUS_REGEX_GLOBAL =
  /(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}\/status\/(\d+)(?:\/?.*)?/g;
export const TWITTER_STATUS_REGEX =
  /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}\/status\/(\d+)(?:\/?.*)?$/;

export const isValidTwitterUrl = (url) => {
  if (typeof url !== "string") return false;
  return TWITTER_STATUS_REGEX.test(url);
};

const TweetComponent = ({ node }) => {
  const url = node?.attrs?.src;
  // Extract the numeric status id from URL
  const match = typeof url === "string" ? url.match(/status\/(\d+)/) : null;
  const tweetId = match?.[1] ?? null;

  if (!tweetId) return null;

  return (
    <NodeViewWrapper>
      <div data-twitter="" data-src={url}>
        <Tweet id={tweetId} />
      </div>
    </NodeViewWrapper>
  );
};

// TipTap Node Extension
export const Twitter = Node.create({
  name: "twitter",

  addOptions() {
    return {
      addPasteHandler: true,
      HTMLAttributes: {},
      inline: false,
      origin: "",
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(TweetComponent);
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-twitter]",
      },
    ];
  },

  addCommands() {
    return {
      setTweet:
        (options) =>
        ({ commands }) => {
          if (!isValidTwitterUrl(options?.src)) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addPasteRules() {
    if (!this.options.addPasteHandler) return [];

    return [
      nodePasteRule({
        find: TWITTER_STATUS_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => {
          // match.input is entire pasted string; prefer the matched substring if available
          const input = typeof match?.[0] === "string" ? match[0] : match?.input;
          return { src: input };
        },
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, ...rest } = HTMLAttributes || {};
    // Persist a stable data attribute that our viewers can detect
    return [
      "div",
      mergeAttributes({ "data-twitter": "", "data-src": src || undefined }, rest),
    ];
  },
});

export default Twitter;

