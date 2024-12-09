import type { FC } from "react";
import {
  AimOutlined,
  AlertOutlined,
  BellOutlined,
  ControlOutlined,
  DashboardOutlined,
  DisconnectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ConfigProvider, type ThemeConfig } from "antd";

import { AlarmRoute, AppRoute } from "../../routes/routes";
import { Navigation, type NavigationProps } from "../navigation";

type Props = {
  className?: string;
  dataTestId?: string;
};

const navItems: NavigationProps["items"] = [
  {
    label: "Home",
    href: AppRoute.Dashboard,
    icon: <DashboardOutlined aria-hidden={true} />,
  },
  {
    label: "Alarm",
    href: AppRoute.Alarm,
    icon: <AlertOutlined aria-hidden={true} />,
    subNav: [
      {
        label: "Record",
        href: `${AppRoute.Alarm}/${AlarmRoute.Record}`,
      },
      {
        label: "Self Recovery",
        href: `${AppRoute.Alarm}/${AlarmRoute.SelfRecovery}`,
      },
    ],
  },
  {
    label: "Site Map",
    href: AppRoute.SiteMap,
    icon: <AimOutlined aria-hidden={true} />,
  },
  {
    label: "Site Configuration",
    href: AppRoute.SiteConfiguration,
    icon: <ControlOutlined aria-hidden={true} />,
  },

  {
    label: "Masked Source",
    href: AppRoute.MaskedSource,
    icon: <BellOutlined aria-hidden={true} />,
  },
  {
    label: "Disconnected Sites",
    href: AppRoute.DisconnectedSites,
    icon: <DisconnectOutlined aria-hidden={true} />,
  },
  {
    label: "Users",
    href: AppRoute.Users,
    icon: <UserOutlined aria-hidden={true} />,
  },
];

const themeConfig: ThemeConfig = {
  components: {
    Menu: {
      darkItemSelectedBg:"rgba(17, 26, 44, 1)",
      darkItemSelectedColor:"rgba(9, 109, 217, 1)",
      darkSubMenuItemBg: "rgba(12, 24, 59, 1)",
      horizontalItemBorderRadius: 1,
    },
  },
};

export const DashboardNavigation: FC<Props> = ({
  className,
  dataTestId = "dashboard-navigation",
}) => (
  <ConfigProvider theme={themeConfig}>
    <Navigation
      className={className}
      mode="vertical"
      items={navItems}
      dataTestId={dataTestId}
    />
  </ConfigProvider>
);
