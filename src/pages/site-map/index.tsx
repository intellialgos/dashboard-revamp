import { Col, Row } from "antd";
import { useState, type FC } from "react";
import { SiderTrigger } from "../../components/sider-trigger";
import { EditSiteMapModal } from "../../modals/edit-site-map-modal";
import { SiteInfoModal } from "../../modals/site-map-modal";
import { SiteMapComp } from "../../widgets/site-map";
import styles from './index.module.css';

export const SiteMap: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const handleCollapseMenu = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    // Cookies.set(SIDER_MENU_COLLAPSED_STATE_COOKIE, `${newCollapsed}`);
  };
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <SiteMapComp />
      </Col>
     
        <SiderTrigger
          left={true}
          dataTestId="sider-trigger"
          onClick={handleCollapseMenu}
          collapsed={collapsed}
          className={`${styles.trigger} ${collapsed ? styles.trigger_expand : styles.trigger_collapse}`}
        />
      <SiteInfoModal collapse={collapsed} onClick={handleCollapseMenu} />
      <EditSiteMapModal />
    </Row>
  );
};
