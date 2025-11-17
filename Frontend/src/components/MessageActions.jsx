import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import './MessageActions.css'

export default function MessageActions({ text }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="msg-actions">
      <button
        onClick={handleLike}
        className={`msg-btn ${liked ? "liked" : ""}`}
      >
        <ThumbsUp size={15} />
        Like
      </button>

      <button
        onClick={handleDislike}
        className={`msg-btn ${disliked ? "disliked" : ""}`}
      >
        <ThumbsDown size={15} />
        Dislike
      </button>

      <button
        onClick={handleCopy}
        className={`msg-btn ${copied ? "copied" : ""}`}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
