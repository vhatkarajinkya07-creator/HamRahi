export default function Sidebar({ items, activeIndex, onSelect }) {
  return (
    <nav
      className="fixed right-[26px] top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3.5 max-[900px]:hidden"
      aria-label="Jump to destination"
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          className={`group relative w-2.5 h-2.5 rounded-full transition-[background,transform] duration-300 ease-linear ${
            index === activeIndex
              ? "bg-[var(--theme-primary,var(--color-coral))] scale-[1.6]"
              : "bg-[rgba(16,26,51,0.2)]"
          }`}
          onClick={() => onSelect(index)}
          aria-label={`Jump to ${item.name}`}
        >
          <span className="absolute right-[22px] top-1/2 -translate-y-1/2 font-mono text-[11px] whitespace-nowrap bg-ink text-white px-2.5 py-1 rounded-md opacity-0 pointer-events-none transition-opacity duration-200 ease-linear group-hover:opacity-100">
            {item.name}
          </span>
        </button>
      ))}
    </nav>
  );
}
