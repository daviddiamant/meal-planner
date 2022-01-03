import { useWindowWidth } from "@react-hook/window-size/throttled";
import { motion, useAnimation } from "framer-motion";
import {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CSS,
  styled,
  StyledComponent,
  theme,
  utils,
} from "../../stitches.config";

export type ExpandTextProps = {
  children: ReactNode;
  numLines?: number;
  toggleColor?: string;
  // Should not be used in production, it's only for dependency injection from test
  getInnerHeight?: (
    ref: MutableRefObject<HTMLDivElement | null>
  ) => number | undefined;
};

const opaqueBackground = utils.hexToRgba(theme.colors.background.value, 0);
const background = utils.hexToRgba(theme.colors.background.value, 1);

const shownVariant = {
  variants: {
    shown: {
      true: {
        display: "initial",
      },
      false: {
        display: "none",
      },
    },
  },
};

const Outer = styled(motion.div, {
  position: "relative",
  overflow: "hidden",
});

const Inner = styled("div", {
  position: "relative",
});

const Gradient = styled(motion.div, {
  position: "absolute",
  width: "100%",
  background: `linear-gradient(180deg, ${opaqueBackground} 0%, ${background} 100%)`,

  ...shownVariant,
});

const ReadMoreToggle = styled(motion.div, {
  position: "absolute",
  right: 0,
  bottom: 0,
  background: "$background",

  "::before": {
    position: "absolute",
    content: " ",
    width: "15px",
    height: "100%",
    right: "100%",
    background: `linear-gradient(90deg, ${opaqueBackground} 0%, ${background} 100%)`,
  },

  ...shownVariant,
});

const ToggleText = styled("a", {
  fontWeight: "bold",

  ...shownVariant,
});

const style = {
  gradient: (restrictedLinesHeight: number): CSS => ({
    top: restrictedLinesHeight,
    height: `calc(100% - ${restrictedLinesHeight}px)`,
  }),
};

const ExpandTextComponent = ({
  children,
  numLines = 3,
  toggleColor = "inherit",
  getInnerHeight = (ref: MutableRefObject<HTMLDivElement | null>) =>
    ref.current?.offsetHeight,
  ...restProps
}: StyledComponent<ExpandTextProps, typeof Outer>): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  // The read more toggle needs to go away after the animations are done so that the read less toggle can be clicked
  const [expandAnimationsDone, setExpandAnimationsDone] = useState(false);

  const innerRef = useRef<HTMLDivElement | null>(null);

  const windowWidth = useWindowWidth();
  const outerAnimation = useAnimation();
  const toggleAnimation = useAnimation();
  const gradientAnimation = useAnimation();

  const lineHeightInPixels =
    parseFloat(theme.fontSizes[1].value) *
    windowWidth *
    0.01 *
    parseFloat(theme.lineHeights.primary.value);
  const heightOfNumLines = Math.floor(numLines * lineHeightInPixels);
  const innerHeight = getInnerHeight(innerRef) || heightOfNumLines;
  const restrictedHeight = Math.min(innerHeight, heightOfNumLines);

  const showToggles = restrictedHeight < innerHeight;

  useEffect(() => {
    const onExpandedChange = async () => {
      // The animations needs to run in a certain order to look sane
      // Awaiting .start means waiting until the animation is done
      if (expanded) {
        // When we are expanding: animate away the toggle and the height at the same time, then animate away the gradient
        toggleAnimation.start({
          opacity: 0,
        });

        await outerAnimation.start({
          height: getInnerHeight(innerRef),
        });

        gradientAnimation.start({
          opacity: 0,
        });
      } else {
        // When we are going back: animate in the gradient, then animate toggle(with a slight delay) and the height at the same time
        await gradientAnimation.start({
          opacity: 1,
        });
        outerAnimation.start({
          height: restrictedHeight,
        });
        await new Promise((resolve) => setTimeout(() => resolve(true), 100));
        toggleAnimation.start({
          opacity: 1,
        });
      }
    };

    onExpandedChange();
  }, [
    expanded,
    getInnerHeight,
    gradientAnimation,
    outerAnimation,
    restrictedHeight,
    toggleAnimation,
  ]);

  return (
    <Outer
      {...restProps}
      animate={outerAnimation}
      data-testid={"outer"}
      initial={{
        height: restrictedHeight,
      }}
      transition={{ type: "tween", duration: 0.2 }}
    >
      <Inner ref={innerRef}>
        {children}

        <ToggleText
          css={{ color: toggleColor }}
          role="button"
          shown={showToggles}
          onClick={() => setExpanded(false)}
        >
          {" "}
          Läs mindre
        </ToggleText>
      </Inner>

      <Gradient
        animate={gradientAnimation}
        css={style.gradient(restrictedHeight)}
        initial={{
          opacity: 1,
        }}
        shown={!expandAnimationsDone}
        transition={{ duration: 0.25 }}
        onAnimationComplete={() => setExpandAnimationsDone(expanded)}
      />

      <ReadMoreToggle
        animate={toggleAnimation}
        data-testid="expand-toggle"
        initial={{
          opacity: 0,
        }}
        shown={showToggles && !expandAnimationsDone}
        transition={{ duration: 0.15 }}
      >
        {"... "}
        <ToggleText
          css={{ color: toggleColor }}
          role="button"
          onClick={() => setExpanded(true)}
        >
          Läs mer
        </ToggleText>
      </ReadMoreToggle>
    </Outer>
  );
};

export const ExpandText = styled(ExpandTextComponent);
