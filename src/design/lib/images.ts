/*
 * Marks every image once it has loaded (`data-loaded`), so styles can fade a
 * picture in instead of letting it pop into a frame that is already on screen.
 * One capturing listener catches the load events of images React adds later;
 * a data attribute is used rather than a class so React never overwrites it.
 */
export function mountImageLoadMarks() {
  const mark = (img: HTMLImageElement) => { img.dataset.loaded = ''; };
  document.addEventListener('load', event => {
    const target = event.target;
    if (target instanceof HTMLImageElement) mark(target);
  }, true);
  document.querySelectorAll('img').forEach(img => { if (img.complete && img.naturalWidth > 0) mark(img); });
}
