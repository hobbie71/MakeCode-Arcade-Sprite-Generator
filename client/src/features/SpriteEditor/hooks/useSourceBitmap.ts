import { useEffect, useRef, useState } from "react";

import { useImageImports } from "../../../context/ImageImportContext/useImageImports";

/**
 * The cached source decoded to an ImageBitmap, or null while decoding / when
 * there is no source / when the file is undecodable (e.g. SVG). Decodes once
 * per source change and closes stale bitmaps.
 */
export function useSourceBitmap(): ImageBitmap | null {
  const { sourceImage } = useImageImports();
  // Held outside state so stale bitmaps are closed outside React's pure updaters.
  const heldRef = useRef<ImageBitmap | null>(null);
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);

  useEffect(() => {
    if (!sourceImage) {
      heldRef.current?.close();
      heldRef.current = null;
      setBitmap(null);
      return;
    }
    let cancelled = false;
    createImageBitmap(sourceImage)
      .then((bmp) => {
        if (cancelled) {
          bmp.close();
          return;
        }
        heldRef.current?.close();
        heldRef.current = bmp;
        setBitmap(bmp);
      })
      .catch(() => {
        if (!cancelled) setBitmap(null);
      });
    return () => {
      cancelled = true;
    };
  }, [sourceImage]);

  useEffect(() => {
    return () => {
      heldRef.current?.close();
      heldRef.current = null;
    };
  }, []);

  return bitmap;
}
