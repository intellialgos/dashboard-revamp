import { isFilledArray } from "@mvp-tech/utils";
import type { MenuProps } from "antd";

import type { NavigationProps } from ".";

type NavItem = NavigationProps["items"][number];
type MenuItem = Required<MenuProps>["items"][number];

export function getItem({
  label,
  icon,
  disabled,
  href,
  subNav,
}: NavItem): MenuItem {
  const children = isFilledArray(subNav) ? subNav.map(getItem) : undefined;

  return {
    label,
    icon,
    disabled,
    children,
    key: href,
  };
}
