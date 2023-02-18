import React, { useEffect, useRef } from "react";
type Props = {
  children: React.ReactNode;
  ease?: number;
  skew?: boolean;
};
export default function SmoothScroller({
  children,
  ease = 0.1,
  skew = false
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const images = [];
  let data = {
    current: 0,
    target: 0,
    ease,
    skewDiff: 0,
    windowWidth: 0,
    containerHeight: 0,
    imageHeight: 0
  };

  function lerp(start: number, end: number, t: number) {
    return start * (1 - t) + end * t;
  }
  function setTransform(el: HTMLElement, transform: string) {
    el.style.transform = transform;
  }
  // function updateImages() {
  //   let ratio = data.current / scrollProperties.imageHeight;
  //   let intersectioRatioIndex, intersectionRatioValue;

  //   images.forEach((image, idx) => {
  //     intersectioRatioIndex =
  //       scrollProperties.windowWidth > 760 ? parseInt(idx / 2) : idx;
  //     intersectionRatioValue = ratio - intersectioRatioIndex;
  //     setTransform(image, `translateY(${intersectionRatioValue * 70}px)`);
  //   });
  // }

  function smoothScroll() {
    if (containerRef.current) {
      data.current = lerp(data.current, data.target, data.ease);
      data.current = parseFloat(data.current.toFixed(2));
      data.target = window.scrollY;
      data.skewDiff = (data.target - data.current) * 0.015;
      if (skew) {
        setTransform(
          containerRef.current,
          `translateY(${-data.current}px) skewY(${data.skewDiff}deg) `
        );
      } else {
        setTransform(containerRef.current, `translateY(${-data.current}px)`);
      }

      // updateImages();
      requestAnimationFrame(smoothScroll);
    }
  }

  function setupAnimation() {
    if (containerRef.current) {
      data.windowWidth = window.innerWidth;
      data.containerHeight = containerRef.current.getBoundingClientRect().height;
      data.imageHeight =
        data.containerHeight /
        (data.windowWidth > 760 ? images.length / 2 : images.length);

      document.body.style.height = `${data.containerHeight}px`;
      smoothScroll();
    }
  }

  useEffect(() => {
    setupAnimation();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh"
      }}
    >
      <div ref={containerRef}>{children}</div>
    </div>
  );
}
