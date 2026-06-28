/**
 * Scrolls to the first element matching a data attribute within a grid container.
 * Skips on desktop (xl+) where the full grid is visible.
 */
export function scrollToCategory(
  gridRef: React.RefObject<HTMLDivElement | null>,
  category: string,
  dataAttribute: string
) {
  if (window.innerWidth >= 1280) return;
  requestAnimationFrame(() => {
    const target = category === "all"
      ? gridRef.current
      : gridRef.current?.querySelector<HTMLElement>(`[${dataAttribute}="${category}"]`);
    if (!target) return;
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;
    const offset = 140;
    const top = target.getBoundingClientRect().top + scrollContainer.scrollTop - offset;
    scrollContainer.scrollTo({ top, behavior: "smooth" });
  });
}
