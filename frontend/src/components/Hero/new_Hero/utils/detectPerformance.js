
const HIGH = "high";
const LOW = "low";

function getWebglInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!gl) return { supported: false, renderer: "", isSoftware: true };

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER) || "";

    const rendererLower = String(renderer).toLowerCase();

    const isSoftware =
      rendererLower.includes("swiftshader") ||
      rendererLower.includes("software") ||
      rendererLower.includes("llvmpipe") ||
      rendererLower.includes("basic render");

    return { supported: true, renderer: rendererLower, isSoftware };
  } catch {
    return { supported: false, renderer: "", isSoftware: true };
  }
}

function isMobileUA() {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || "");
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isLikelyAppleSiliconMac(renderer = "") {
  if (typeof navigator === "undefined") return false;

  const platform =
    navigator.userAgentData?.platform ||
    navigator.platform ||
    "";

  const userAgent = navigator.userAgent || "";
  const rendererLower = String(renderer).toLowerCase();

  const isMac =
    /mac/i.test(platform) ||
    /macintosh|mac os x/i.test(userAgent);

  const hasAppleGpu =
    rendererLower.includes("apple") &&
    (
      rendererLower.includes("gpu") ||
      rendererLower.includes("metal") ||
      rendererLower.includes("m1") ||
      rendererLower.includes("m2") ||
      rendererLower.includes("m3") ||
      rendererLower.includes("m4")
    );

  return isMac && hasAppleGpu;
}

// Runs a short rAF loop and resolves with an approximate FPS reading.
// Kept intentionally brief (~450ms) so it doesn't delay first paint.
function benchmarkFps(sampleMs = 450) {
  return new Promise((resolve) => {
    let frames = 0;
    let start = null;

    function tick(timestamp) {
      if (start === null) start = timestamp;

      frames += 1;

      const elapsed = timestamp - start;

      if (elapsed < sampleMs) {
        requestAnimationFrame(tick);
      } else {
        resolve(Math.round((frames * 1000) / elapsed));
      }
    }

    requestAnimationFrame(tick);
  });
}

export async function detectPerformance() {
  if (typeof window === "undefined") {
    // SSR / non-browser environment: default to the safe, lightweight tier.
    return { tier: LOW, reasons: ["no-window"], meta: null };
  }

  const reasons = [];
  const { supported, renderer, isSoftware } = getWebglInfo();

  if (!supported) {
    reasons.push("no-webgl");

    return {
      tier: LOW,
      reasons,
      meta: { renderer: "", mobile: isMobileUA() },
    };
  }

  const mobile = isMobileUA();
  const reducedMotion = prefersReducedMotion();
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory; // undefined in browsers that don't expose it (e.g. Safari)
  const appleSiliconMac = isLikelyAppleSiliconMac(renderer);

  if (isSoftware) reasons.push("software-renderer");
  if (mobile) reasons.push("mobile-device");
  if (reducedMotion) reasons.push("reduced-motion");
  if (appleSiliconMac) reasons.push("apple-silicon-mac");
  if (cores <= 4) reasons.push(`low-core-count:${cores}`);
  if (typeof memory === "number" && memory <= 4) {
    reasons.push(`low-device-memory:${memory}`);
  }

  // Reduced motion is a hard override — never auto-select the heavier globe.
  if (reducedMotion) {
    return {
      tier: LOW,
      reasons,
      meta: {
        renderer,
        mobile,
        cores,
        memory,
        fps: null,
        appleSiliconMac,
      },
    };
  }

  const fps = await benchmarkFps();
  reasons.push(`fps-benchmark:${fps}`);

  let score = 0;

  // Apple Silicon MacBooks, including M2/M3/M4 models, should start as
  // capable desktop devices unless real runtime signals say otherwise.
  if (appleSiliconMac) score += 3;

  if (isSoftware) score -= 3;
  if (mobile) score -= 1;

  // Some browsers under-report memory or expose modest core counts on Macs.
  // Do not penalize likely Apple Silicon Macs for those weak signals alone.
  if (!appleSiliconMac && cores <= 4) score -= 1;
  if (!appleSiliconMac && typeof memory === "number" && memory <= 4) {
    score -= 1;
  }

  if (fps < 45) score -= 2;
  else if (fps >= 55) score += 1;

  const tier = score < 0 ? LOW : HIGH;

  return {
    tier,
    reasons,
    meta: {
      renderer,
      mobile,
      cores,
      memory,
      fps,
      appleSiliconMac,
    },
  };
}