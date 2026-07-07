
const OPTIONS = [
  { value: "high", label: "3D Experience" },
  { value: "low", label: "Normal Mode" },
];

export default function HeroToggle({ mode, onChange, className = "" }) {
  const activeIndex = OPTIONS.findIndex((option) => option.value === mode);

  return (
    <div
      className={`hidden md:inline-flex relative items-center rounded-full border border-white/14 bg-white/[0.06] p-1 shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur-2xl ${className}`}
      role="group"
      aria-label="Hero display mode"
    >
      {/* Sliding highlight behind the active option */}
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-[0_2px_12px_rgba(255,255,255,0.35)] transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${activeIndex === 1 ? "100%" : "0%"})`,
        }}
      />

      {OPTIONS.map((option) => {
        const active = option.value === mode;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => !active && onChange(option.value)}
            aria-pressed={active}
            className={`relative z-[1] rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${
              active
                ? "text-[#101722]"
                : "text-white/58 hover:text-white/90 active:scale-[0.97]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
