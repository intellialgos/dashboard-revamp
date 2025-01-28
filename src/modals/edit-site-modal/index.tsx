import { Button, Divider, Drawer, Form, Input, message, Space, Typography } from "antd";
import { type FC, useContext, useEffect, useState } from "react";

import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { BaseSelect } from "@/components/base-select";
import styles from "./index.module.css";
import { useCreateSiteMutation, useGetOrganizationsMutation, usePostOrganizationMutation } from "@/services";
import { Organisation } from "@/types/organisation";
import { MessageInstance } from "antd/es/message/interface";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { ThemeContext } from "@/theme";

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
  orgId: string;
  name: string;
  boxType: "sbox-win"|"sbox-linux";
};

type OrgFields = {
  name: string;
  remark: string;
};

const { Item } = Form;
const { TextArea } = Input;

export const EditSiteModal: FC<Props> = ({ getOrganizations, dataTestId, Show, setAddSite, organizations, organizationsLoading}) => {
  const show = Show;
  const [messageApi, contextHolder] = message.useMessage();
  const [index, setIndex] = useState<number>(0);

  const handleClose = () => {
    setAddSite(false);
  };

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (
    <>
    {contextHolder}
    <Drawer
      open={show}
      width={460}
      title="Edit Site (S+ box)"
      onClose={handleClose}
      data-testid={dataTestId}
      style={{ background:`${darkTheme ? " #0C183B" :"" }`  }}
    >
      <EditSiteForm
        getOrganizations={getOrganizations}
        organizationsLoading={organizationsLoading}
        organizations={organizations}
        setStep={setIndex}
        messageApi={messageApi}
        setAddSite={setAddSite}
        darkTheme={darkTheme}
      />
    </Drawer>
    </>
  );
};
const EditSiteForm = ({
  setStep,
  setAddSite,
  darkTheme,
  messageApi,
  organizations,
  getOrganizations,
  organizationsLoading
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>,
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>,
  darkTheme:boolean,
  messageApi: MessageInstance,
  organizations: any,
  getOrganizations: MutationTrigger<any>;
  organizationsLoading: boolean
}) => {
  const [createSite, {isLoading: siteCreationLoading}] = useCreateSiteMutation();
  const [form] = Form.useForm();

  const organizationsOptions = organizations?.orgs
      ? organizations.orgs.map((org: Organisation) => ({
          label: org.name,
          value: org.id,
        }))
  : [];

  const handleSubmitSite = async (data: any) => {
    try {
    const result = await createSite(data);
      if ( result?.data && !result?.data?.error ) {
        messageApi.success(`Site has been added successfully !`);
        form.resetFields();
        getOrganizations({});
        // handleCancel();
        setAddSite(false);
      } else if ( result?.data?.error ) {
        messageApi.error(result?.data?.desc);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("There was an error");
    }
  }
  
  return (
    <>
    <Form<SiteFields>
      // form={form}
      layout="vertical"
      name="add-site-form"
      onFinish={handleSubmitSite}
      data-testid="add-site-form"
      disabled={siteCreationLoading}
    >
      {" "}
      <Item<SiteFields>
        label="Organization"
        name="orgId"
        rules={[{ required: true, message: 'Select Organization' }]}
      >
        <BaseSelect
          placeholder="Select"
          allowClear={true}
          loading={organizationsLoading}
          options={organizationsOptions}
          className="select_input"
        />
      </Item>
      <Button
        type="default"
        className={styles.default_btn}
        style={{
          width: "100%",
        }}
        icon={<PlusOutlined />}
        onClick={() => setStep(1)}
      >
        Add New Organization
      </Button>
      <Divider />
      <Item<SiteFields>
        label="Site Name"
        name="name"
        rules={[{ required: true, message: 'Write site name' }]}
      >
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>
      <Item<SiteFields>
        label="Box Type"
        name="boxType"
        rules={[{ required: true, message: 'Select box type' }]}
      >
        <BaseSelect
          placeholder="Select"
          className="select_input"
          options={[
            {
              value: "sbox-win",
              label: "Windows"
            },
            {
              value: "sbox-linux",
              label: "Linux"
            }
          ]}
        />
      </Item>
      <div className={styles.btn_container}>
        <Button
          type="default"
          style={{
            flex: 1,
          }}
          className={styles.default_btn}
          onClick={() => setAddSite(false)}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={siteCreationLoading}
          style={{
            borderRadius: "1px",
            flex: 1,
          }}
        >
          Create
        </Button>
      </div>
    </Form>
    </>
  );
};
