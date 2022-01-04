import { ChevronLeftIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Constrained, Heading, LazyImage } from "../../components";
import { ExpandText } from "../../components/expandText";
import { useRecipe } from "../../hooks";
import { Style, styled } from "../../stitches.config";

const Wrapper = styled("div", {
  position: "relative",
  display: "block",
  width: "100%",
  aspectRatio: "1 / 1",
  marginBottom: "$2",
  background: "$foreground",
  borderRadius: "$primary",
  overflow: "hidden",
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

const RecipeContent = styled("div", {
  marginTop: "$5",
  padding: "$2",
});

const style: Style = {
  constrained: {
    display: "block",
    padding: "$2",
  },
  title: {
    fontSize: "7.5vw",
  },
  description: {
    position: "relative",
    marginTop: "$4",
    textAlign: "justify",
    color: "$secondaryText",
  },
};

export const Recipe = (): JSX.Element => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [showButtons, setShowButtons] = useState(false);

  const { data: recipe } = useRecipe(slug ?? "");

  const {
    description,
    image,
    imageHeight,
    imagePalette,
    imageWidth,
    smallImage,
    title,
  } = recipe ?? {};
  const aspectRatio = (imageWidth ?? 1) / (imageHeight ?? 1);
  const zoomedAspectRatio = Math.min(Math.max(0.9, aspectRatio), 1.33);
  const zoomedWidth = `${Math.max(
    (aspectRatio / zoomedAspectRatio) * 100,
    100
  )}%`;

  return (
    <Constrained css={style.constrained}>
      {smallImage && image && title && (
        <Wrapper
          css={{
            aspectRatio: `${zoomedAspectRatio} / 1`,
          }}
          data-testid={slug}
          role="gridcell"
        >
          <Zoom css={{ width: zoomedWidth, aspectRatio: `${aspectRatio} / 1` }}>
            <LazyImage
              alt={title}
              largeUrl={image}
              smallUrl={smallImage}
              useConfirmationTime={false}
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
      <RecipeContent>
        <Heading css={style.title}>{title}</Heading>
        <ExpandText
          css={style.description}
          toggleColor={`rgba(${imagePalette?.Vibrant.join(", ")}, 0.45)`}
        >
          {description}
        </ExpandText>
      </RecipeContent>
    </Constrained>
  );
};
