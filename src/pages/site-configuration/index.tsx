import { GroupOutlined, LinkOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space } from "antd";
import { FC, useContext, useState } from "react";
import { Breadcrumbs } from "../../breadcrumbs";
import { SiteConfigurationTable } from "../../components/site-configuration-table";
import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { SiteConfigurationDrawer } from "../../modals/site-configuration-drawer";
import { setShowSiteInfoModal } from "../../store/slices/events";
import { ThemeContext } from "../../theme";
import { AddSiteModal } from "../../modals/add-site-modal";
import { AddGroupModal } from "../../modals/add-group-modal";
import DeleteModal from "../../modals/delete-modal";
import { EditSiteMapModal } from "../../modals/edit-site-map-modal";
import LinkSitePopOver from "../../components/pop-over/link-site";

export const SiteConfiguration: FC = () => {
  const dispatch = useAppDispatch();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [addSite,setAddSite] = useState<boolean>(false)
  const [addGroup,setAddGroup] = useState<boolean>(false)
  const [deleteModal,setDeleteModal]=useState<boolean>(false)

 
  const handleSiteInfo = () => {
    dispatch(setShowSiteInfoModal(true));
  };

  return (
    <>
      <Row gutter={[24, 24]}>
        {" "}
        <Col span={24}>
          <Breadcrumbs />
        </Col>
        <Col span={24}>
          <Space>
            <Button
              size="large"
              className="primary_button"
              type="primary"
              icon={<PlusOutlined color="white" />}
              onClick={()=>setAddSite(!addSite)}
            >
              Add Site
            </Button>
            <Button
              size="large"
              className="secondary_button"
              type="primary"
              icon={<GroupOutlined />}
              // onClick={handleFilterClick}
              onClick={()=>setAddGroup(true)}
            >
              Add Group
            </Button>
            <LinkSitePopOver/>
          </Space>
        </Col>
        <Col span={24}>
          <SiteConfigurationTable className={darkTheme ? "alerts_table" : "alerts_table_light"} setDeleteModal={setDeleteModal} />
        </Col>
      </Row>
      <SiteConfigurationDrawer handlePageFilter={handleSiteInfo} darkTheme={darkTheme}/>
      <AddSiteModal Show={addSite} setAddSite={setAddSite} darkTheme={darkTheme}/>
      <AddGroupModal Show={addGroup} setAddGroup={setAddGroup} darkTheme={darkTheme}/>
      <DeleteModal Show={deleteModal} setDeleteModal={setDeleteModal} darkTheme={darkTheme}/>
      <EditSiteMapModal title="Test 1" darkTheme={darkTheme}/>
    </>
  );
};
