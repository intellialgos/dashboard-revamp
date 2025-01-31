import { Col, Row } from "antd";
import { useState, type FC } from "react";
import { SiderTrigger } from "@/components/sider-trigger";
import { EditSiteMapModal } from "@/modals/edit-site-map-modal";
import { SiteInfoModal } from "@/modals/site-map-modal";
import { SiteMapComp } from "@/widgets/site-map";
import styles from './index.module.css';
import { useGetSitesQuery } from "@/services";
import { EditSiteModal } from "@/modals/edit-site-modal";
import { SiteInfo } from "@/modals/site-info-modal";

export const SiteMap: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showOnlyDisconnected, setShowOnlyDisconnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>();

  const { currentData: sites, isLoading: sitesLoading, refetch } = useGetSitesQuery({
    ...( searchTerm ? { keyword: searchTerm } : {} )
  });
  const handleCollapseMenu = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    // Cookies.set(SIDER_MENU_COLLAPSED_STATE_COOKIE, `${newCollapsed}`);
  };

  const filteredSitesByStatus = showOnlyDisconnected ? sites.filter((item:any) => item.connectionState == false) : sites;
  
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <SiteMapComp sites={sites} />
      </Col>
     
        <SiderTrigger
          left={true}
          dataTestId="sider-trigger"
          onClick={handleCollapseMenu}
          collapsed={collapsed}
          className={`${styles.trigger} ${collapsed ? styles.trigger_expand : styles.trigger_collapse}`}
        />
      <SiteInfoModal sites={sites} collapse={collapsed} onClick={handleCollapseMenu} />
      <SiteInfo refetch={refetch} />
      <EditSiteMapModal />
    </Row>
  );
};
