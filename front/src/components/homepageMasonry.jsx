import { useContext, useEffect, useRef } from "react"; // No jsx so we do not need React
import { useWindowSize } from "@react-hook/window-size";
import {
  useMasonry,
  usePositioner,
  useContainerPosition,
  useScroller,
} from "masonic";
import { ThemeContext } from "react-fela";
import { useDebouncedCallback } from "use-debounce";

// Local imports
import { IMAGE_URL } from "../appConfig";
import { MasonryCard } from "./masonryCard";

class HomepageMasonryHelper {
  constructor({
    items,
    offset,
    height,
    loaded,
    loadLarge,
    scrollTop,
    prevClean,
    prevStill,
    positioner,
    prevScroll,
    isScrolling,
    loadedLarge,
    lazyLoadImage,
    buttonFinished,
    lazyLoadedImages,
    overscanImagesBy,
    processLargeQueue,
    processSmallQueue,
    cleanUpLazyLoading,
    prevScrollForSpeed,
    firstCallAfterMount,
    overscanSmallImagesBy,
  }) {
    this.items = items;
    this.offset = offset;
    this.height = height;
    this.loaded = loaded;
    this.loadLarge = loadLarge;
    this.scrollTop = scrollTop;
    this.prevClean = prevClean;
    this.prevStill = prevStill;
    this.positioner = positioner;
    this.prevScroll = prevScroll;
    this.isScrolling = isScrolling;
    this.loadedLarge = loadedLarge;
    this.lazyLoadImage = lazyLoadImage;
    this.buttonFinished = buttonFinished;
    this.lazyLoadedImages = lazyLoadedImages;
    this.overscanImagesBy = overscanImagesBy;
    this.processLargeQueue = processLargeQueue;
    this.processSmallQueue = processSmallQueue;
    this.cleanUpLazyLoading = cleanUpLazyLoading;
    this.prevScrollForSpeed = prevScrollForSpeed;
    this.firstCallAfterMount = firstCallAfterMount;
    this.overscanSmallImagesBy = overscanSmallImagesBy;

    this.url = IMAGE_URL;
  }

  getOverscanLimits(change, overscanBy) {
    const direction = change > 0 ? "down" : "up";
    const overScanInPixels = overscanBy * this.height;

    // Scrolling down
    let lowerLimit = this.scrollTop - this.height;
    let upperLimit = this.scrollTop + overScanInPixels + this.height;
    if (direction === "up") {
      // Scrolling up
      lowerLimit = this.scrollTop - overScanInPixels;
      upperLimit = this.scrollTop + 2 * this.height;
    }
    return { lowerLimit, upperLimit };
  }

  handleScroll() {
    const change = this.scrollTop - this.prevScroll.current;
    if (Math.abs(change) < 50) {
      // We only react to real changes
      return false;
    }
    this.prevScroll.current = this.scrollTop;

    const { lowerLimit, upperLimit } = this.getOverscanLimits(
      change,
      this.overscanSmallImagesBy
    );

    window.requestAnimationFrame(() => {
      this.positioner.range(lowerLimit, upperLimit, (index) => {
        if (!this.items[index]) {
          // This recipe is not added in state
          return false;
        }

        let curImage = this.items[index].mediumImage;
        curImage = this.url + curImage;
        const curImageSmall = this.url + this.items[index].smallImage;

        if (!this.loaded.current[index] || !this.lazyLoadedImages[curImage]) {
          this.lazyLoadImage(curImage, curImageSmall);
          this.loaded.current[index] = 1;
        }
      });

      this.processSmallQueue();
    });
  }

  handleMovingSlow() {
    const change = this.scrollTop - this.prevStill.current;
    if (Math.abs(change) < 150) {
      // We only react to real changes
      return false;
    }
    this.prevStill.current = this.scrollTop;

    const { lowerLimit, upperLimit } = this.getOverscanLimits(
      change,
      this.overscanImagesBy
    );

    window.requestAnimationFrame(() => {
      this.positioner.range(lowerLimit, upperLimit, (index) => {
        if (!this.items[index]) {
          // This image is not added in state
          return false;
        }

        let curImage = this.items[index].mediumImage;
        curImage = this.url + curImage;
        if (
          // Not loaded in state
          (this.lazyLoadedImages &&
            this.lazyLoadedImages[curImage] &&
            !this.lazyLoadedImages[curImage].loaded) ||
          // Not loaded here, locally
          !this.loadedLarge.current[index]
        ) {
          this.loadLarge(curImage);
          this.loadedLarge.current[index] = 1;
        }
      });

      this.processLargeQueue();
    });
  }

  handleStandingStill() {
    if (Math.abs(this.scrollTop - this.prevClean.current) < 4 * this.height) {
      // Do not clean if its not dirty
      return false;
    }

    const { lowerLimit, upperLimit } = this.getOverscanLimits(
      1,
      this.overscanImagesBy
    );

    let currentRecipes = [];
    let newLoaded = {};
    window.requestAnimationFrame(() => {
      this.positioner.range(lowerLimit, upperLimit, (index) => {
        if (!this.items[index]) {
          // This image is not added in state
          return false;
        }

        let curImage = this.items[index].mediumImage;
        curImage = this.url + curImage;
        currentRecipes.push(curImage);
        newLoaded[index] = 1;
      });

      this.cleanUpLazyLoading(currentRecipes);
      this.loaded.current = Object.keys(this.loaded) ? { ...newLoaded } : {};
      this.loadedLarge.current = Object.keys(this.loadedLarge)
        ? { ...newLoaded }
        : {};
      this.prevClean.current = this.scrollTop;
    });
  }

  handleUpdates() {
    if (
      this.buttonFinished &&
      this.items.length &&
      !isNaN(this.offset) &&
      typeof this.offset !== "undefined"
    ) {
      // Load small images while scrolling, its is not that heavy so we can do it a lot
      this.handleScroll();

      const delta = this.prevScrollForSpeed.current - this.scrollTop;
      if (
        // Scrolling slow
        (delta !== 0 && delta > -125 && delta < 125) ||
        // Init call
        this.firstCallAfterMount.current ||
        // Or we are standing still
        !this.isScrolling
      ) {
        // Remove not shown images and fetch large ones, its heavy so only do it if we are not scrolling
        this.handleMovingSlow();

        this.firstCallAfterMount.current = false;
      }

      this.prevScrollForSpeed.current = this.scrollTop;
    }
  }
}

export const HomepageMasonry = (props) => {
  // These should not trigger re-renders (as state does), so use refs
  const theme = useContext(ThemeContext);
  const containerRef = useRef(null);
  const prevScrollForSpeed = useRef(props.scrollPosition);
  const firstCallAfterMount = useRef(false);
  const prevScroll = useRef(-Number.MAX_SAFE_INTEGER);
  const prevStill = useRef(-Number.MAX_SAFE_INTEGER);
  const prevClean = useRef(props.scrollPosition);
  const loaded = useRef({});
  const loadedLarge = useRef({});

  // Mount and unmount
  useEffect(() => {
    firstCallAfterMount.current = true;
    return () => {
      firstCallAfterMount.current = false;
    };
  }, []);

  const [windowWidth, height] = useWindowSize();
  let { offset, width } = useContainerPosition(containerRef, [
    windowWidth,
    height,
  ]);
  offset = offset || props.initialOffset;
  width = width || windowWidth - 2 * theme.homepageCardMargin;

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

  const params = {
    offset,
    height,
    loaded,
    scrollTop,
    prevClean,
    prevStill,
    positioner,
    prevScroll,
    isScrolling,
    loadedLarge,
    items: props.items,
    prevScrollForSpeed,
    firstCallAfterMount,
    loadLarge: props.loadLarge,
    lazyLoadImage: props.lazyLoadImage,
    buttonFinished: props.buttonFinished,
    lazyLoadedImages: props.lazyLoadedImages,
    overscanImagesBy: props.overscanImagesBy,
    processLargeQueue: props.processLargeQueue,
    processSmallQueue: props.processSmallQueue,
    cleanUpLazyLoading: props.cleanUpLazyLoading,
    overscanSmallImagesBy: props.overscanSmallImagesBy,
  };
  const helper = new HomepageMasonryHelper(params);
  const { callback: debouncedOnRender } = useDebouncedCallback(
    () => helper.handleUpdates(),
    1000
  );
  const { callback: debouncedCleaning } = useDebouncedCallback(
    () => helper.handleStandingStill(),
    1000
  );

  const masonry = useMasonry({
    items: props.items,
    height,
    scrollTop,
    positioner,
    isScrolling,
    containerRef,
    render: MasonryCard,
    onRender: debouncedOnRender,
    ...props,
  });

  helper.handleUpdates();

  if (!isScrolling) {
    debouncedCleaning();
  }

  // Return the Masonry component
  return masonry;
};
