import { GroupOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Space } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "@/breadcrumbs";
import { SiteConfigurationTable } from "@/components/site-configuration-table";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { SiteConfigurationDrawer } from "@/modals/site-configuration-drawer";
import { setShowSiteInfoModal } from "@/store/slices/events";
import { ThemeContext } from "@/theme";
import { AddSiteModal } from "@/modals/add-site-modal";
import { AddGroupModal } from "@/modals/add-group-modal";
import DeleteModal from "@/modals/delete-modal";
import { EditSiteMapModal } from "@/modals/edit-site-map-modal";
import LinkSitePopOver from "@/components/pop-over/link-site";
import { useGetOrganizationsMutation } from "@/services";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getSelectedSite } from "@/store/selectors/sites";
import EditOrganizationModal from "@/modals/edit-organization-modal";
import EditGroupModal from "@/modals/edit-group-modal";
import { PermissionGuard } from "@/components/permission-guard";

export const SiteConfiguration: FC = () => {
  const dispatch = useAppDispatch();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [addSite,setAddSite] = useState<boolean>(false)
  const [addGroup,setAddGroup] = useState<boolean>(false)
  const [deleteModal,setDeleteModal]=useState<boolean>(false)
  const site = useAppSelector(getSelectedSite);
  const [messageApi, contextHolder] = message.useMessage();


  const [getOrganizations, { isLoading, data: organizations }] = useGetOrganizationsMutation();
  useEffect(() => {
      getOrganizations({});
  }, [getOrganizations]);

  const handleSiteInfo = () => {
    dispatch(setShowSiteInfoModal(true));
  };

  return (
    <>
      {contextHolder}
      <Row gutter={[24, 24]}>
        {" "}
        <Col span={24}>
          <Breadcrumbs />
        </Col>
        <Col span={24}>
          <Space>
            <PermissionGuard keyName="siteConfiguration" action="c">
              <Button
                size="large"
                className="primary_button"
                type="primary"
                icon={<PlusOutlined color="white" />}
                onClick={()=>setAddSite(!addSite)}
              >
                Add Site/Organization
              </Button>
            </PermissionGuard>

            <PermissionGuard keyName="siteConfiguration" action="c">
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
            </PermissionGuard>
            {/* <LinkSitePopOver/> */}
          </Space>
        </Col>
        <Col span={24}>
          <SiteConfigurationTable refetch={getOrganizations} data={organizations} isLoading={isLoading} className={darkTheme ? "alerts_table" : "alerts_table_light"} />
        </Col>
      </Row>
      <SiteConfigurationDrawer handlePageFilter={handleSiteInfo} darkTheme={darkTheme}/>
      <AddSiteModal getOrganizations={getOrganizations} organizationsLoading={isLoading} organizations={organizations} Show={addSite} setAddSite={setAddSite} darkTheme={darkTheme}/>
      <AddGroupModal organizationsLoading={isLoading} organizations={organizations} getOrganizations={getOrganizations} Show={addGroup} setAddGroup={setAddGroup} darkTheme={darkTheme}/>
      {/* <DeleteModal Show={deleteModal} setDeleteModal={setDeleteModal} darkTheme={darkTheme}/> */}
      <EditSiteMapModal title={site} darkTheme={darkTheme}/>

      <EditOrganizationModal refetch={getOrganizations} messageApi={messageApi} />
      <EditGroupModal refetch={getOrganizations} messageApi={messageApi} />
    </>
  );
};
