import React, { useEffect, useState } from "react";

// Raw coordinates of statue features based on 1920x1080 original image space (in percentages 0-100)
const hotspots = [
  {
    id: "legal-sections",
    title: "Applicable Legal Sections",
    desc: "Cross-references evidence against current statutory penal codes to map viable prosecution and defense pathways.",
    x: 44.5, // Left scale pan
    y: 24.8,
    labelX: 18,
    labelY: 26,
    side: "left",
  },
  {
    id: "similar-cases",
    title: "Similar Case Retrieval",
    desc: "Indexes millions of precedent briefs and historical filings in seconds to extract matching jurisprudence.",
    x: 54.0, // Hand holding the sword
    y: 43.3,
    labelX: 82,
    labelY: 16,
    side: "right",
  },
  {
    id: "evidence-mapping",
    title: "Evidence Mapping",
    desc: "Synthesizes physical exhibits, timeline trails, and dynamic depositions into interactive relational graphs.",
    x: 50.5, // Chest / heart of the statue
    y: 36.2,
    labelX: 18,
    labelY: 48,
    side: "left",
  },
  {
    id: "missing-evidence",
    title: "Missing Evidence Detection",
    desc: "Identifies gaps in procedural logs, missing testimonies, and undocumented forensic links automatically.",
    x: 53.5, // Sword blade
    y: 60.0,
    labelX: 82,
    labelY: 62,
    side: "right",
  },
  {
    id: "judicial-analytics",
    title: "Judicial Analytics",
    desc: "Aggregates ruling distributions, judge leanings, and forum-specific timeline behaviors.",
    x: 50.0, // Pedestal base emblem
    y: 86.0,
    labelX: 18,
    labelY: 82,
    side: "left",
  }
];

const StatueHotspots = () => {
  const [opacity, setOpacity] = useState(0);
  const [active, setActive] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [activeMobileCard, setActiveMobileCard] = useState(null);
  const [viewportSize, setViewportSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  // Track window resizing for precise dynamic cover scaling math
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Monitor scroll height to fade hotspots overlay in and out exactly when Lady Justice is stationary
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      
      // Extremely smooth cinematic scroll fade ranges (start earlier, fade out slower)
      const startFadeIn = 1.2 * h;
      const endFadeIn = 2.0 * h;
      const startFadeOut = 2.1 * h;
      const endFadeOut = 3.1 * h;

      let op = 0;
      if (y >= startFadeIn && y <= endFadeOut) {
        if (y < endFadeIn) {
          // Very slow, gradual fade in
          op = (y - startFadeIn) / (endFadeIn - startFadeIn);
        } else if (y > startFadeOut) {
          // Very slow, gradual fade out
          op = 1 - (y - startFadeOut) / (endFadeOut - startFadeOut);
        } else {
          // Fully visible
          op = 1;
        }
      }
      setOpacity(op);
      setActive(op > 0.01);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // MATHEMATICAL COVER ALIGNMENT ENGINE:
  // Maps original 1920x1080 background image pixel space coordinates
  // to the active viewport coordinates considering "object-cover" scaling and vertical/horizontal cropping.
  const getRenderedCoords = (px, py) => {
    const { w, h } = viewportSize;
    const iar = 1920 / 1080; // Original image aspect ratio
    const ar = w / h; // Viewport aspect ratio

    let rx = 0;
    let ry = 0;

    if (iar > ar) {
      // Viewport is narrower than the image (cropped heavily on left and right)
      // Height matches viewport height; rendered width is wider
      const renderedWidth = h * iar;
      const offsetX = (renderedWidth - w) / 2;
      rx = (px / 100) * renderedWidth - offsetX;
      ry = (py / 100) * h;
    } else {
      // Viewport is wider than the image (cropped heavily on top and bottom)
      // Width matches viewport width; rendered height is taller
      const renderedHeight = w / iar;
      const offsetY = (renderedHeight - h) / 2;
      rx = (px / 100) * w;
      ry = (py / 100) * renderedHeight - offsetY;
    }

    // Convert pixels to viewport percentages (0-100) for clean absolute layout rendering
    return {
      x: (rx / w) * 100,
      y: (ry / h) * 100,
    };
  };

  if (!active) return null;

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-30"
      style={{ opacity }}
    >
      
      {/* 1. ANCHOR DESKTOP DESCRIPTIVE CARDS */}
      <div className="absolute inset-0 w-full h-full hidden md:block">
        {hotspots.map((h) => {
          const isLeft = h.side === "left";
          const renderedLabel = getRenderedCoords(h.labelX, h.labelY);
          
          // Cards are positioned at the mathematically aligned coordinates
          const cardStyle = isLeft 
            ? { left: `${renderedLabel.x}%`, top: `${renderedLabel.y}%`, transform: "translate(-50%, -50%)" }
            : { right: `${100 - renderedLabel.x}%`, top: `${renderedLabel.y}%`, transform: "translate(50%, -50%)" };

          return (
            <div
              key={h.id}
              className={`absolute w-72 pointer-events-auto z-[25] hotspot-card-glow border rounded-xl px-5 py-4 backdrop-blur-md bg-black/70 transition-all duration-500 ${
                activeCard === h.id 
                  ? "border-[#C8A45D] shadow-[0_0_30px_rgba(200,164,93,0.22)]" 
                  : "border-zinc-800/60"
              }`}
              style={cardStyle}
              onMouseEnter={() => setActiveCard(h.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Gold marker line indicating card hierarchy */}
              <div className={`absolute top-0 bottom-0 w-[2px] bg-[#C8A45D] transition-transform duration-300 scale-y-0 ${
                activeCard === h.id ? "scale-y-100" : ""
              } ${isLeft ? "left-0" : "right-0"}`} />

              <h3 className="text-[#C8A45D] text-xs font-semibold uppercase tracking-[0.2em] mb-2 font-display">
                {h.title}
              </h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-light font-sans tracking-wide">
                {h.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2. SVG LAYER FOR ANGLING / CONNECTING LINES */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="absolute inset-0 w-full h-full pointer-events-none z-[19] hidden md:block"
      >
        {hotspots.map((h) => {
          const isLeft = h.side === "left";
          
          // Map both start node and end label cards to exact cover-aligned coordinates
          const startCoords = getRenderedCoords(h.x, h.y);
          const labelCoords = getRenderedCoords(h.labelX, h.labelY);
          
          // Card width is 288px (w-72) in pixel space. Convert half card width to viewport percentage.
          const halfCardWidthPx = 144;
          const halfCardWidthPct = (halfCardWidthPx / viewportSize.w) * 100;
          
          // Line terminates exactly at the vertical border of the card
          const endX = isLeft 
            ? labelCoords.x + halfCardWidthPct 
            : labelCoords.x - halfCardWidthPct;
          const endY = labelCoords.y;

          // Technical angled path layout
          const midX = isLeft ? startCoords.x - 2.5 : startCoords.x + 2.5;
          const midY = startCoords.y;

          const isActive = activeCard === h.id;

          return (
            <path
              key={h.id}
              d={`M ${startCoords.x} ${startCoords.y} L ${midX} ${midY} L ${endX} ${endY}`}
              stroke={isActive ? "#C8A45D" : "rgba(200, 164, 93, 0.28)"}
              strokeWidth={isActive ? "0.15" : "0.08"}
              fill="none"
              strokeLinecap="round"
              className="animate-draw-line transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* 3. INTERACTIVE PULSING NODES LAYER */}
      <div className="absolute inset-0 w-full h-full">
        {hotspots.map((h) => {
          const nodeCoords = getRenderedCoords(h.x, h.y);
          return (
            <div
              key={h.id}
              className="absolute z-[25] pointer-events-auto"
              style={{
                left: `${nodeCoords.x}%`,
                top: `${nodeCoords.y}%`,
                transform: "translate(-50%, -50%)"
              }}
            >
              {/* Pulsing ring */}
              <div className="absolute w-7 h-7 rounded-full bg-[#C8A45D]/25 -top-2 -left-2 animate-ping-slow pointer-events-none" />

              {/* Glowing core trigger */}
              <button
                onClick={() => {
                  setActiveCard(h.id);
                  setActiveMobileCard(h);
                }}
                onMouseEnter={() => setActiveCard(h.id)}
                onMouseLeave={() => setActiveCard(null)}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-500 cursor-pointer ${
                  activeCard === h.id
                    ? "bg-[#C8A45D] border-white scale-125 shadow-[0_0_20px_#C8A45D]"
                    : "bg-black border-[#C8A45D] hover:bg-[#C8A45D] hover:scale-115 hover:border-white shadow-[0_0_10px_rgba(200,164,93,0.4)]"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* 4. MOBILE SYSTEM RESPONSIVE OVERLAY (BOTTOM DRAWER) */}
      {activeMobileCard && (
        <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-auto md:hidden p-6 bg-zinc-950/95 border-t border-[#C8A45D]/40 backdrop-blur-lg animate-fade-in shadow-[0_-10px_40px_rgba(0,0,0,0.9)]">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[#C8A45D] text-sm font-semibold uppercase tracking-[0.2em] font-display">
              {activeMobileCard.title}
            </h3>
            
            {/* Mobile close button */}
            <button 
              onClick={() => {
                setActiveMobileCard(null);
                setActiveCard(null);
              }}
              className="text-zinc-500 hover:text-white p-1 cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-zinc-300 text-xs leading-relaxed font-light font-sans tracking-wide mb-2">
            {activeMobileCard.desc}
          </p>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block text-right mt-4 font-mono">
            TAP OUTSIDE OR CLOSE TO DISMISS
          </span>
        </div>
      )}

      {/* Mobile background tap detector */}
      {activeMobileCard && (
        <div 
          onClick={() => {
            setActiveMobileCard(null);
            setActiveCard(null);
          }}
          className="fixed inset-0 z-40 bg-black/50 pointer-events-auto md:hidden"
        />
      )}

    </div>
  );
};

export default StatueHotspots;
