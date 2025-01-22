import { NavigationProps } from "@/components/navigation";
import { User } from "@/types/user";
import { hasPermission } from "./userPermissions";

export function getFilteredNavItems(user: User, navItems: NavigationProps["items"]): NavigationProps["items"] {
    return navItems
      .filter((item) => hasPermission(user, item.permissionKey, item.action)) // Filter top-level items
      .map((item) => {
        // Check sub-navigation items if present
        if (item.subNav) {
          const filteredSubNav = item.subNav.filter((subItem) =>
            hasPermission(user, subItem.permissionKey, subItem.action)
          );
          return { ...item, subNav: filteredSubNav };
        }
        return item;
      })
      .filter((item) => !item.subNav || item.subNav.length > 0); // Remove items with empty sub-navigation
  }