import { Header, Heading } from "../../../components";
import { useUser, useUserConfig } from "../../../hooks";
import { CSS, styled } from "../../../stitches.config";

const TitleWrapper = styled("div", {
  display: "flex",
  justifyContent: "center",
  variants: {
    low: {
      true: {
        margin: "70px 0 0 0",
      },
      false: {
        margin: "25px 0 0 0",
      },
    },
  },
});
const style = {
  title: (low: boolean): CSS => ({
    textAlign: "center",
    fontFamily: "$veryCursive",
    fontSize: "11vw",
    fontWeight: "$2",
    lineHeight: low ? 1.1 : 1.775,
    letterSpacing: "normal", // Font does not support it :(
    background: `linear-gradient(170deg,rgba(0,0,0,1) 0%,#3c4257 100%)`,
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  }),
  secondTitle: {
    textAlign: "right",
    color: "$secondaryText",
    fontSize: "7.6vw",
    fontWeight: 200,
    lineHeight: 1,
  } as CSS,
};

export const HomeHeader = () => {
  const { user } = useUser();
  const { data: userConfig } = useUserConfig(user);
  const { bookTitle, lowTitle } = userConfig || {};

  return (
    <Header>
      {bookTitle ? (
        <TitleWrapper low={lowTitle}>
          <div>
            <Heading css={style.title(!!lowTitle) as any} role="banner">
              {bookTitle}
            </Heading>
            <Heading as="h3" css={style.secondTitle as any}>
              kokbok
            </Heading>
          </div>
        </TitleWrapper>
      ) : null}
    </Header>
  );
};
