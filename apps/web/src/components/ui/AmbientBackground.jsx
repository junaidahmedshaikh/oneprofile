import React, { memo } from "react";

/**
 * AmbientBackground Component
 * 
 * A subtle, restrained, premium background system featuring:
 * - Off-white base canvas with low-contrast radial depth
 * - Soft green/mint ambient lighting in upper-left and upper-right
 * - Neutral low-contrast center zone for maximum content focus & readability
 * - GPU-accelerated ultra-slow ambient drift (20-28s) that respects prefers-reduced-motion
 * - Micro-dot matrix mesh overlay for tactile SaaS finish
 */
export const AmbientBackground = memo(function AmbientBackground({
  className = "",
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden -z-10 bg-[#FAFAF7] ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Subtle Editorial Paper Foundation */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 15% 10%, rgba(159, 232, 112, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 65% 45% at 85% 15%, rgba(16, 185, 129, 0.04) 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 50% 90%, rgba(22, 51, 0, 0.025) 0%, transparent 65%)
          `,
        }}
      />

      {/* 2. Slowly Drifting Ambient Light Orbs (Ultra-Restrained) */}
      <div className="absolute inset-0">
        {/* Upper-Left Soft Lime Aura */}
        <div
          className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-[130px] opacity-60 animate-op-ambient-1"
          style={{
            background: "radial-gradient(circle, rgba(159, 232, 112, 0.14) 0%, rgba(159, 232, 112, 0.02) 70%, transparent 100%)",
          }}
        />

        {/* Upper-Right Soft Emerald/Mint Aura */}
        <div
          className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full blur-[140px] opacity-50 animate-op-ambient-2"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, rgba(52, 211, 153, 0.02) 70%, transparent 100%)",
          }}
        />

        {/* Center-Bottom Grounding Shadow Aura */}
        <div
          className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-40"
          style={{
            background: "radial-gradient(ellipse, rgba(22, 51, 0, 0.04) 0%, transparent 75%)",
          }}
        />
      </div>

      {/* 3. Micro-Texture Mesh Pattern (Tactile, anti-banding finish) */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(#163300 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 4. Fine Top Vignette for Nav Separation */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
    </div>
  );
});
