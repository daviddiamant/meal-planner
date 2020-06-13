import { useContext, useRef } from "react"; // No jsx so we do not need React
import { useWindowSize } from "@react-hook/window-size";
import { useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import {
  useMasonry,
  usePositioner,
  useContainerPosition,
  useScroller,
} from "masonic";
import { ThemeContext } from "react-fela";

// Local imports
import {
  lazyLoadImage,
  clearForLazyLargeImage,
  cleanUpLazyLoading,
  processLazyLoadSmallQueue,
  processLazyLoadLargeQueue,
} from "../actions/actionCreators";
import HomepageCard from "./homepageCard";

const url = `${window.location.protocol}//${window.location.hostname}`;

const getOverscanLimits = ({ change, overscanBy, scrollTop, height }) => {
  const direction = change > 0 ? "down" : "up";
  const overScanInPixels = overscanBy * height;

  // Scrolling down
  let lowerLimit = scrollTop - height;
  let upperLimit = scrollTop + overScanInPixels + height;
  if (direction === "up") {
    // Scrolling up
    lowerLimit = scrollTop - overScanInPixels;
    upperLimit = scrollTop + 2 * height;
  }
  return { lowerLimit, upperLimit };
};

const handleScroll = ({
  items,
  dispatch,
  height,
  overscanBy,
  overscanImagesBy,
  scrollTop,
  positioner,
  prevScroll,
  prevStill,
  prevClean,
  loaded,
  loadedLarge,
  initialScrollTop,
}) => {
  const change = scrollTop - prevScroll.current;
  if (Math.abs(change) < 150 && Math.abs(scrollTop - initialScrollTop) > 10) {
    // Given that we are not at the top, we only react to real changes
    return false;
  }

  const { lowerLimit, upperLimit } = getOverscanLimits({
    change,
    overscanBy,
    scrollTop,
    height,
  });

  window.requestAnimationFrame(() => {
    positioner.range(lowerLimit, upperLimit, (index) => {
      if (!items[index]) {
        // This image is not added in state
        return false;
      }

      let curImage = items[index].mediumImage;
      curImage = url + curImage;
      const curImageSmall = url + items[index].smallImage;

      if (!loaded.current[index]) {
        dispatch(lazyLoadImage(curImage, curImageSmall));
        loaded.current[index] = 1;
      }
    });

    prevScroll.current = scrollTop;

    dispatch(processLazyLoadSmallQueue());
  });

  if (Math.abs(change) < 150 && Math.abs(scrollTop - initialScrollTop) < 10) {
    // We have not scrolled and we are at the top - this is a init call
    handleStandingStill({
      items,
      height,
      loaded,
      dispatch,
      scrollTop,
      prevClean,
      prevStill,
      positioner,
      initCall: true,
      loadedLarge,
      overscanBy: overscanImagesBy,
    });
  }
};

const handleStandingStill = ({
  initCall,
  dispatch,
  items,
  overscanBy,
  scrollTop,
  height,
  positioner,
  prevStill,
  prevClean,
  loaded,
  loadedLarge,
}) => {
  const change = scrollTop - prevStill.current;
  if (Math.abs(change) < 150 && !initCall) {
    // Has anything changed?
    return false;
  }

  const { lowerLimit, upperLimit } = getOverscanLimits({
    change,
    overscanBy,
    scrollTop,
    height,
  });

  let currentRecipes = [];
  let newLoaded = {};
  window.requestAnimationFrame(() => {
    positioner.range(lowerLimit, upperLimit, (index) => {
      if (!items[index]) {
        // This image is not added in state
        return false;
      }

      let curImage = items[index].mediumImage;
      curImage = url + curImage;
      currentRecipes = [...currentRecipes, curImage];
      newLoaded[index] = 1;
      if (!loadedLarge.current[index]) {
        dispatch(clearForLazyLargeImage(curImage));
        loadedLarge.current[index] = 1;
      }
    });
    prevStill.current = scrollTop;

    dispatch(processLazyLoadLargeQueue());

    if (Math.abs(scrollTop - prevClean.current) < 10 * height) {
      // Do not clean if its not dirty
      return false;
    }

    dispatch(cleanUpLazyLoading(currentRecipes));
    loaded.current = Object.keys(loaded) ? { ...newLoaded } : {};
    loadedLarge.current = Object.keys(loadedLarge) ? { ...newLoaded } : {};
    prevClean.current = scrollTop;
  });
};

export const HomepageMasonry = ({
  items,
  buttonFinished,
  scrollPosition,
  overscanImagesBy,
  overscanSmallImagesBy,
  ...props
}) => {
  // These should not trigger re-renders (as state does), so use refs
  const containerRef = useRef(null);
  const prevScrollForSpeed = useRef(scrollPosition);
  const fetchLargeLock = useRef(false);
  const prevScroll = useRef(scrollPosition);
  const prevStill = useRef(scrollPosition);
  const prevClean = useRef(scrollPosition);
  const loaded = useRef({});
  const loadedLarge = useRef({});

  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [debouncedScrolling] = useDebouncedCallback(handleScroll, 50);
  const [windowWidth, height] = useWindowSize();
  const { offset, width } = useContainerPosition(containerRef, [
    windowWidth,
    height,
  ]);
  const { scrollTop, isScrolling } = useScroller(offset);

  // Get the number of columns
  const maxWidths = [350, 768, 991, 1200];
  const columnCounts = {
    350: 1,
    768: 2,
    991: 3,
    1200: 4,
  };
  let columnCount = 6; // Desktops
  const outerWidth = width + 2 * theme.homepageCardMargin;
  for (let maxWidth of maxWidths) {
    if (outerWidth < maxWidth) {
      columnCount = columnCounts[maxWidth];
      break;
    }
  }

  const positioner = usePositioner({ width, columnCount }, [width]);

  if (buttonFinished) {
    // Load small images while scrolling, its is not that heavy so we can do it a lot
    debouncedScrolling({
      items,
      height,
      loaded,
      dispatch,
      prevStill,
      scrollTop,
      prevClean,
      prevScroll,
      positioner,
      loadedLarge,
      overscanImagesBy,
      initialScrollTop: scrollPosition ? scrollPosition - offset : 0,
      overscanBy: overscanSmallImagesBy,
    });

    const delta = prevScrollForSpeed.current - scrollTop;
    if (
      !isScrolling ||
      (!fetchLargeLock.current &&
        delta &&
        ((delta > -10 && delta < 0) || (delta < 10 && delta > 0)))
    ) {
      // Remove not shown images and fetch large ones, its heavy so only do it if we are not scrolling
      handleStandingStill({
        items,
        height,
        loaded,
        dispatch,
        scrollTop,
        prevClean,
        prevStill,
        positioner,
        loadedLarge,
        overscanBy: overscanImagesBy,
      });

      fetchLargeLock.current = true;
      setTimeout(() => {
        fetchLargeLock.current = false;
      }, 250);
    }
  }
  prevScrollForSpeed.current = scrollTop;

  // Return the Masonry component
  return useMasonry({
    items,
    height,
    scrollTop,
    positioner,
    isScrolling,
    containerRef,
    render: HomepageCard,
    ...props,
  });
};
