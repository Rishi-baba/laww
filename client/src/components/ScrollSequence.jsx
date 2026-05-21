import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Eagerly resolve dynamic asset imports using Vite
const frameModules = import.meta.glob("../assets/frames/*.jpg", { eager: true });
const framePaths = Object.keys(frameModules).sort();
const imageUrls = framePaths.map((path) => frameModules[path].default || frameModules[path]);

/**
 * Helper to draw image on canvas with 'cover' scaling (similar to CSS background-size: cover)
 */
const drawImageProp = (ctx, img, x = 0, y = 0, w = ctx.canvas.width, h = ctx.canvas.height, rOffset = 0.5, cOffset = 0.5) => {
  if (!img) return;

  const iw = img.width;
  const ih = img.height;
  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let cx, cy, cw, ch;

  if (nw < w) {
    const r2 = w / nw;
    nw *= r2;
    nh *= r2;
  }
  if (nh < h) {
    const r2 = h / nh;
    nw *= r2;
    nh *= r2;
  }

  const ar = w / h;
  const iar = iw / ih;

  if (iar > ar) {
    cw = ih * ar;
    ch = ih;
    cx = (iw - cw) * rOffset;
    cy = 0;
  } else {
    cw = iw;
    ch = iw / ar;
    cx = 0;
    cy = (ih - ch) * cOffset;
  }

  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
};

const ScrollSequence = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const loadedImagesRef = useRef([]);

  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1. Preload image frames into memory
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = imageUrls.length;
    const preloadedImages = [];

    if (totalFrames === 0) {
      setLoaded(true);
      return;
    }

    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      
      const handleLoad = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalFrames) * 100));
        
        if (loadedCount === totalFrames) {
          loadedImagesRef.current = preloadedImages;
          setLoaded(true);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad;
      preloadedImages[index] = img;
    });

    return () => {
      preloadedImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // 2. Setup GSAP Canvas Scroll trigger
  useEffect(() => {
    if (!loaded || loadedImagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // High-DPI resizing helper
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.scale(dpr, dpr);
      
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      // Redraw current frame
      const currentFrame = Math.round(imageSeq.frame);
      if (loadedImagesRef.current[currentFrame]) {
        drawImageProp(context, loadedImagesRef.current[currentFrame], 0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const imageSeq = { frame: 0 };
    const frameCount = loadedImagesRef.current.length;

    // Set initial frame & subscribe resize listener
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Frame update scrub timeline
    const bgTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const frameIndex = Math.round(imageSeq.frame);
          if (loadedImagesRef.current[frameIndex]) {
            drawImageProp(context, loadedImagesRef.current[frameIndex], 0, 0, window.innerWidth, window.innerHeight);
          }
        },
      },
    });

    bgTimeline.to(imageSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      bgTimeline.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loaded]);

  // 3. Setup Lenis smooth scrolling & GSAP integration
  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo ease
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Sync Lenis frame updates with GSAP global ticker
    const gsapTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
    };
  }, [loaded]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[400vh] bg-black">
      {/* Absolute minimal loader label */}
      {!loaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 text-zinc-400 text-xs font-semibold uppercase tracking-widest">
          Loading Sequences ({progress}%)
        </div>
      )}

      {/* Full-screen fixed canvas background */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        } z-0 pointer-events-none`}
      />
    </div>
  );
};

export default ScrollSequence;
