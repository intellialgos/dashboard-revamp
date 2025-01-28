import { Button, Card, Col, Divider, Drawer, Form, Input, message, Row, Space, Typography } from "antd";
import { type FC, useContext, useEffect, useState } from "react";

import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { BaseSelect } from "@/components/base-select";
import styles from "./index.module.css";
import { useCreateSiteMutation, useGetOrganizationsMutation, usePostOrganizationMutation } from "@/services";
import { Organisation } from "@/types/organisation";
import { MessageInstance } from "antd/es/message/interface";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { ThemeContext } from "@/theme";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getShowConfigureSiteDrawer, getSiteObject } from "@/store/selectors/sites";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setShowConfigureSiteDrawer } from "@/store/slices/sites";

type Props = {
  dataTestId?: string;
  alarmRecord?: boolean;
  Show: boolean;
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>;
  organizations: any;
  organizationsLoading: boolean;
  getOrganizations: MutationTrigger<any>;
};

type SiteFields = {
  name: string;
  remark: string;
  address: string;
  contactPerson: string;
  contactPhoneNum: string;
  contactEmail: string;
  contactPerson2: string;
  contactPhoneNum2: string;
  contactEmail2: string;
  longitude: number;
  latitude: number;
  simExpirationTime: string;
  activate: string;
  deactivate: string;
};


const { Item } = Form;
const { TextArea } = Input;

export const EditSiteModal: FC<Props> = ({ getOrganizations, dataTestId,}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const show = useAppSelector(getShowConfigureSiteDrawer)
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setShowConfigureSiteDrawer(false));
  };

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <>
    {contextHolder}
    <Drawer
      open={show}
      width={700}
      title="Configure Site (S+ box)"
      onClose={handleClose}
      data-testid={dataTestId}
      style={{ background:`${darkTheme ? " #0C183B" :"" }`  }}
    >
      <EditSiteForm
        getOrganizations={getOrganizations}
        messageApi={messageApi}
        darkTheme={darkTheme}
      />
    </Drawer>
    </>
  );
};
const EditSiteForm = ({
  darkTheme,
  messageApi,
  getOrganizations,
}: {
  darkTheme:boolean,
  messageApi: MessageInstance,
  getOrganizations: MutationTrigger<any>;
}) => {
  const [createSite, {isLoading: siteCreationLoading}] = useCreateSiteMutation();
  const [form] = Form.useForm();
  const siteObject = useAppSelector(getSiteObject);

  const handleSubmitSite = async (data: any) => {
    try {
    const result = await createSite(data);
      if ( result?.data && !result?.data?.error ) {
        messageApi.success(`Site has been updated successfully !`);
        form.resetFields();
        getOrganizations({});
        // handleCancel();
      } else if ( result?.data?.error ) {
        messageApi.error(result?.data?.desc);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("There was an error");
    }
  }

  useEffect(() => {
    form.setFieldsValue(siteObject);
  }, [siteObject])
  
  return (
    <>
    <Form<SiteFields>
      form={form}
      layout="vertical"
      name="edit-site-form"
      onFinish={handleSubmitSite}
      data-testid="add-site-form"
      disabled={siteCreationLoading}
    >
      {" "}
      <Item<SiteFields>
        label="Site Name"
        name="name"
        rules={[{ required: true, message: 'Write site name' }]}
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>
      <Item<SiteFields>
        label="Remark"
        name="remark"
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>
      <Item<SiteFields>
        label="Address"
        name="address"
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>

      <Row style={{marginBottom: 20}}>
        <Col span={12}>
          <Card title="Contact 1" className="contact_card">
            <Item<SiteFields>
              label="Name"
              name="contactPerson"
            >
              <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
            </Item>
            <Item<SiteFields>
              label="Phone Number"
              name="contactPhoneNum"
            >
              <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
            </Item>
            <Item<SiteFields>
              label="Email"
              name="contactEmail"
            >
              <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
            </Item>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Contact 2" className="contact_card">
              <Item<SiteFields>
                label="Name"
                name="contactPerson2"
              >
                <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
              </Item>
              <Item<SiteFields>
                label="Phone Number"
                name="contactPhoneNum2"
              >
                <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
              </Item>
              <Item<SiteFields>
                label="Email"
                name="contactEmail2"
              >
                <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
              </Item>
            </Card>
          </Col>
      </Row>

      <Row style={{marginBottom: 20}}>
        <Col span={12}>
          <Item<SiteFields>
            label="Longitude"
            name="longitude"
          >
            <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
          </Item>
        </Col>
        <Col span={12}>
          <Item<SiteFields>
            label="Latitude"
            name="latitude"
          >
            <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
          </Item>
        </Col>
      </Row>

      <Row style={{marginBottom: 20}}>
        <Col span={12}>
          <Item<SiteFields>
            label="Activate"
            name="activate"
          >
            <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
          </Item>
        </Col>
        <Col span={12}>
          <Item<SiteFields>
            label="Deactivate"
            name="deactivate"
          >
            <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
          </Item>
        </Col>
      </Row>

      <Item<SiteFields>
        label="SIM Expiration Time"
        name="simExpirationTime"
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>

      <div className={styles.btn_container}>
        <Button
          type="primary"
          htmlType="submit"
          loading={siteCreationLoading}
          style={{
            borderRadius: "1px",
            flex: 1,
          }}
        >
          Update
        </Button>
      </div>
    </Form>
    </>
  );
};
