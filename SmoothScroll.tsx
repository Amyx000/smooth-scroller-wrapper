/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useEffect, useRef, useState } from "react";

type Props ={
    children: ReactNode
    ease: number
}

const SmoothScroll = ({ children, ease }:Props) => {
  // 1.

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //2.
  const scrollingContainerRef = useRef<any>(null);

  // 3.
  const data = {
    ease,
    current: 0,
    previous: 0,
    rounded: 0
  };

  // 4.
  useEffect(() => {
    setBodyHeight();
  }, [windowSize.height]);

  const setBodyHeight = () => {
    if(scrollingContainerRef.current){
        document.body.style.height = `${
            scrollingContainerRef.current.getBoundingClientRect().height
        }px`;
    }
  };

  // 5.
  useEffect(() => {
    requestAnimationFrame(() => smoothScrollingHandler());
  }, []);

  const smoothScrollingHandler = () => {
    data.current = window.scrollY;
    data.previous += (data.current - data.previous) * data.ease;
    data.rounded = Math.round(data.previous * 100) / 100;

    if(scrollingContainerRef.current){
        scrollingContainerRef.current.style.transform = `translateY(-${data.previous}px)`;
    }
    // Recursive call
    requestAnimationFrame(() => smoothScrollingHandler());
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden"
      }}
    >
      <div ref={scrollingContainerRef}>{children}</div>
    </div>
  );
};

export default SmoothScroll;
