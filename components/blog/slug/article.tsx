"use client";

import Preview from "@/components/editor/preview2";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";
import { fadeInUp } from "@/utils/animations";
import React from "react";

import "../../editor/code.css";

type Props = {
  content: string;
};

export default function Article({ content }: Props) {
  return (
    <div>
      <FadeInWhenVisible variants={fadeInUp}>
        <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
          <Preview markdown={content} />
        </div>
      </FadeInWhenVisible>
    </div>
  );
}
