"use client";

import React from "react";
import { useCallback, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Modal = ({ children }: { children: ReactNode }) => {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  //to navigate to different page
  const router = useRouter();

  //turned a regular reroute function into useCallback, "Memoizing"
  //so it only changes if the dependency array (router) has changed
  const onDismiss = useCallback(() => {
    router.push("/");
  }, [router]);

  //useCallback RETURNS a memoized version of the funcion in its first argument
  // this is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders
  //tldr this is how you handle clicking outside of a modal to close it
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current && onDismiss) {
        onDismiss();
      }
    },
    [onDismiss, overlay]
  );

  return (
    //the overlay is taking up the whole screen, so it's not exactly "click away to close"
    //because you're actually clicking on this overlay
    <div ref={overlay} className="modal" onClick={handleClick}>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-4 right-8"
      >
        <Image src="/close.svg" width={17} height={17} alt="close" />
      </button>
      <div ref={wrapper} className="modal_wrapper">
        {children}
      </div>
    </div>
  );
};

export default Modal;
