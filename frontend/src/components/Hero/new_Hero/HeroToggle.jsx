// Hero/HeroToggle.jsx
//
// Top-right toggle letting the user override the auto-selected rendering
// engine at any time. Uses PrimeReact's SelectButton (unstyled passthrough)
// so all visual styling stays in Tailwind, matching the rest of the Hero.
//
// Note: the `pt` (passthrough) shape below targets PrimeReact 9/10.
// If the project pins an older PrimeReact version, swap this for the
// `unstyled` + `pt` API that version exposes, or restyle with plain CSS.

import { SelectButton } from "primereact/selectbutton";

const OPTIONS = [
  { label: "Interactive Globe", value: "cesium" },
  { label: "Minimal Motion", value: "three" },
];

export default function HeroToggle({ mode, onChange, className = "" }) {
  return (
    <div className={`absolute right-6 top-6 z-10 hidden sm:block ${className}`}>
      <SelectButton
        value={mode}
        onChange={(e) => e.value && onChange(e.value)}
        options={OPTIONS}
        optionLabel="label"
        optionValue="value"
        allowEmpty={false}
        aria-label="Hero background style"
        pt={{
          root: {
            className:
              "flex rounded-full border border-white/14 bg-white/[0.06] p-1 backdrop-blur-2xl",
          },
          button: ({ context }) => ({
            className: `rounded-full border-0 px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 ${
              context.active
                ? "bg-white text-[#101722] shadow-sm"
                : "bg-transparent text-white/60 hover:text-white/85"
            }`,
          }),
        }}
      />
    </div>
  );
}
