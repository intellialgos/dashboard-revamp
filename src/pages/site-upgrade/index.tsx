import { Col, Row, Tabs } from "antd";
import  { type FC,useContext, useState } from "react";
import { ThemeContext } from "@/theme";
import { useGetUploadsQuery } from "@/services";
import { PackagesTable } from "./components/PackagesTable";
import { SiteUpgradeTable } from "./components/SiteUpgradeTable";
import { Breadcrumbs } from "@/breadcrumbs";


export const SiteUpgrade: FC = () => {
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const { currentData, isLoading, refetch } = useGetUploadsQuery({});
  const [selectedTab, setSelectedTab] = useState<string>("packageUpload");

  const handleTabChange = (key: any) => {
    setSelectedTab(key);
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
          <Breadcrumbs />
      </Col>
      <Col span={24}>
      <Tabs
        defaultActiveKey="1"
        className={`${darkTheme && selectedTab === "siteUpgrade" ? "tabs tabs_dark_grid" : darkTheme && selectedTab === "packageUpload" ? "tabs tabs_dark_chart" : !darkTheme && selectedTab === "packageUpload" ? "tabs_light tabs_light_chart" :"tabs_light tabs_light_grid" }`}
        size={'large'}
        activeKey={selectedTab}
        onChange={handleTabChange}
        type="card"
        style={{ marginBottom: 32 }}
        items={[
          { label: "Upload Packages", key: "packageUpload", children: <PackagesTable refetch={refetch} data={currentData} loading={isLoading} /> },
          { label: "Site Upgrade", key: "siteUpgrade",  children: <SiteUpgradeTable packages={currentData} /> }
        ]}
      />
      </Col>
    </Row>
  );
};