import { ChevronLeftIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Constrained, LazyImage } from "../../components";
import { useRecipe } from "../../hooks";
import { Style, styled } from "../../stitches.config";

const Wrapper = styled(motion.div, {
  position: "relative",
  display: "block",
  width: "100%",
  aspectRatio: "1 / 1",
  marginBottom: "$2",
  background: "$foreground",
  borderRadius: "$primary",
  overflow: "hidden",
  opacity: 0,
});

const Zoom = styled("div", {
  position: "absolute",
  width: "100%",

  top: "50%",
  left: "50%",
  transform: "translateX(-50%) translateY(-50%)",
});

const ImageButton = styled(motion.div, {
  position: "absolute",
  top: "$2",
  left: "$2",
  width: "36px",
  height: "36px",
  borderRadius: "100%",
});

const imageButtonVariants = {
  shown: {
    opacity: 1,
    background: "rgba(0, 0, 0, 0.015)",
    backdropFilter: "blur(5px)",
  },
  hidden: {
    opacity: 0,
    background: "rgba(0, 0, 0, 0)",
    backdropFilter: "blur(0px)",
  },
};

const Back = styled(ChevronLeftIcon, {
  width: "28px",
  height: "36px",
  margin: "0 2.5px",
  color: "#fff",
});

const style: Style = {
  constrained: {
    padding: "$2",
  },
};

export const Recipe = (): JSX.Element => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [showButtons, setShowButtons] = useState(false);

  const { data: recipe } = useRecipe(slug ?? "");

  const { image, imageHeight, imageWidth, smallImage, title } = recipe ?? {};
  const aspectRatio = (imageWidth ?? 1) / (imageHeight ?? 1);
  const zoomedAspectRatio = Math.min(Math.max(0.9, aspectRatio), 1.33);
  const zoomedWidth = `${Math.max(
    (aspectRatio / zoomedAspectRatio) * 100,
    100
  )}%`;

  return (
    <Constrained css={style.constrained as any}>
      {smallImage && image && title && (
        <Wrapper
          animate={{ opacity: 1 }}
          css={{
            aspectRatio: `${zoomedAspectRatio} / 1`,
          }}
          data-testid={slug}
          role="gridcell"
          transition={{ type: "spring", duration: 0.25 }}
        >
          <Zoom css={{ width: zoomedWidth, aspectRatio: `${aspectRatio} / 1` }}>
            <LazyImage
              alt={title}
              largeUrl={image}
              smallUrl={smallImage}
              onDisplayed={() => setShowButtons(true)}
            />
          </Zoom>
          <ImageButton
            animate={showButtons ? "shown" : "hidden"}
            initial="hidden"
            role="link"
            variants={imageButtonVariants}
            onClick={() => navigate(-1)}
          >
            <Back />
          </ImageButton>
        </Wrapper>
      )}
    </Constrained>
  );
};
