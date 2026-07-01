
//dont't touch -AJINKYA


import { useEffect, useRef, useState } from "react";
export function useActiveSection(count) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);
  refs.current = [];

  const registerRef = (el, index) => {
    if (el) refs.current[index] = el;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      { threshold: [0.5, 0.75] }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  return { activeIndex, registerRef };
}
