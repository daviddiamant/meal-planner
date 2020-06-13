import { useEffect, useState } from "react";

function useScaledRecipeImageDimensions(
  containerWidth,
  imageWidth,
  imageHeight
) {
  const [zoomDiff, setZoomDiff] = useState(0);
  const [scaledImageWidth, setScaledImageWidth] = useState(0);
  const [scaledImageHeight, setScaledImageHeight] = useState(0);

  useEffect(() => {
    let imageRatio = imageWidth / imageHeight;
    let sih = containerWidth / imageRatio;
    let siw = containerWidth;

    if (imageRatio < 0.8) {
      // Too tall image, zoom a bit
      const zoomedHeight = siw / 0.8;
      sih = zoomedHeight;
      setZoomDiff(sih - zoomedHeight);
    }
    if (imageRatio > 1.33) {
      // Too short image, zoom a bit
      const zoomedHeight = siw / 1.33;
      sih = zoomedHeight;
      siw = zoomedHeight * imageRatio;
    }

    setScaledImageWidth(siw);
    setScaledImageHeight(sih);
  }, [
    containerWidth,
    imageWidth,
    imageHeight,
    scaledImageWidth,
    scaledImageHeight,
  ]);

  return [scaledImageWidth, scaledImageHeight, zoomDiff];
}

export default useScaledRecipeImageDimensions;
