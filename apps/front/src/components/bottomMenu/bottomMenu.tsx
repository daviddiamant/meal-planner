import { HomeIcon, SearchIcon, UserIcon } from "@heroicons/react/outline";
import { HomeIcon as SolidHomeIcon } from "@heroicons/react/solid";
import { Link, useMatch } from "react-router-dom";

import { styled, StyledComponent, theme } from "../../stitches.config";

export type BottomMenuProps = Record<string, unknown>;

const Menu = styled("div", {
  position: "fixed",
  bottom: "$2",
  display: "flex",
  width: `calc(100% - (2 * ${theme.space[2].value}))`,
  minHeight: "50px",
  margin: "0 $2",
  alignItems: "center",
  justifyContent: "space-evenly",
  background: "$foreground",
  borderRadius: "$primary",
});

const MenuLink = styled(Link, {
  lineHeight: 1,
});

const MenuIcon = styled("svg", {
  width: "26px",
  height: "26px",
  color: "$primaryText",
});

const BottomMenuComponent = (
  props: StyledComponent<BottomMenuProps, typeof Menu>
): JSX.Element => {
  const isHome = useMatch("/");
  const isSearch = useMatch("/search");
  const isProfile = useMatch("/profile");

  return (
    <Menu {...props}>
      <MenuLink to="/">
        <MenuIcon as={isHome ? SolidHomeIcon : HomeIcon} />
      </MenuLink>
      <MenuLink to="/search">
        <MenuIcon
          as={SearchIcon}
          {...(isSearch && { fill: theme.colors.primaryText.value })}
        />
      </MenuLink>
      <MenuLink to="/profile">
        <MenuIcon
          as={UserIcon}
          {...(isProfile && { fill: theme.colors.primaryText.value })}
        />
      </MenuLink>
    </Menu>
  );
};

export const BottomMenu = styled(BottomMenuComponent);
