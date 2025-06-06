"use client";

import Preview from "@/components/editor/preview2";
import React from "react";

// import "../../editor/code.css";
import "@/components/editor/styles/code.css";

type Props = {
  content: string;
};

export default function Article({ content }: Props) {
  return (
    <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
      <Preview markdown={content} />
    </div>
  );
}
