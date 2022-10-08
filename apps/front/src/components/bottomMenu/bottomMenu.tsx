import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon as SolidHomeIcon } from "@heroicons/react/24/solid";
import { Link, useMatch } from "react-router-dom";

import { styled, StyledComponent, theme } from "../../stitches.config";

export type BottomMenuProps = Record<string, unknown>;

const Menu = styled("div", {
  position: "fixed",
  bottom: 0,
  display: "flex",
  width: `100%`,
  minHeight: "56px",
  alignItems: "center",
  justifyContent: "space-evenly",
  background: "$foreground",
});

const MenuLink = styled(Link, {
  lineHeight: 1,
});

const MenuIcon = styled("svg", {
  width: "32px",
  height: "32px",
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
          as={MagnifyingGlassIcon}
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
