import { Button, Drawer, Form, Input, Space, Typography } from "antd";
import { type FC, useState } from "react";

import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { BaseSelect } from "../../components/base-select";
import styles from "./index.module.css";

type Props = {
  dataTestId?: string;
  alarmRecord?: boolean;
  Show: boolean;
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>;
  darkTheme?:boolean
};

type Fields = {
  organization: string[];
  sitename: string;
  boxtype: string[];
  organizationname: string;
};

const { Item } = Form;
const { TextArea } = Input;
const initialValues: Fields = {
  organization: [],
  sitename: "",
  boxtype: [],
  organizationname: "",
};

export const AddSiteModal: FC<Props> = ({ dataTestId, Show, setAddSite,darkTheme}) => {
  const show = Show;
  const [form] = Form.useForm<Fields>();
  const [index, setIndex] = useState<number>(0);

  const handleClose = () => {
    setAddSite(false);
  };


  return (
    <Drawer
      open={show}
      width={460}
      title="Add New Site (S+ box)"
      onClose={handleClose}
      data-testid={dataTestId}
      style={{ background:`${ darkTheme ? "#0C183B": "" }`  }}
    >
      {index === 0 && <Step1 setStep={setIndex} setAddSite={setAddSite} darkTheme={darkTheme} />}
      {index === 1 && <Step2 setStep={setIndex} setAddSite={setAddSite} darkTheme={darkTheme} />}
    </Drawer>
  );
};
const Step1 = ({
  setStep,
  setAddSite,
  darkTheme
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>;
  darkTheme:boolean
}) => {
  return (
    <Form<Fields>
      // form={form}
      layout="vertical"
      name="alerts-search"
      initialValues={initialValues}
      // onFinish={handleSubmit}
      data-testid="alerts-search-form"
    >
      {" "}
      <Item<Fields> label="Organization" name="organization">
        <BaseSelect
          mode="multiple"
          placeholder="Select"
          allowClear={true}
          // options={siteOptions}
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
      <Item<Fields> label="Site Name" name="sitename">
        <Input placeholder="Type here..." className={darkTheme  ? styles.input_bg : ""} />
      </Item>
      <Item<Fields> label="Box Type" name="boxtype">
        <BaseSelect
          mode="multiple"
          placeholder="Select"
          allowClear={true}
          className="select_input"
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
          // onClick={handleReset}
          style={{
            borderRadius: "1px",
            flex: 1,
          }}
        >
          Create
        </Button>
      </div>
    </Form>
  );
};
const Step2 = ({
  setStep,
  setAddSite,
  darkTheme
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setAddSite: React.Dispatch<React.SetStateAction<boolean>>;
  darkTheme:boolean
}) => {
  return (
    <>
      <Space size={5} align="center" style={{ marginBottom: "1rem" }}>
        <ArrowLeftOutlined
          // style={{ fontSize: "20px" }}
          className={styles.title}
          onClick={() => setStep(0)}
        />
        <Typography.Title
          className={styles.title}

          // style={{ fontSize: "20px" }}
        >
          Add New Organization
        </Typography.Title>
      </Space>

      <Form<Fields>
        // form={form}
        layout="vertical"
        name="alerts-search"
        initialValues={initialValues}
        // onFinish={handleSubmit}
        data-testid="alerts-search-form"
      >
        {" "}
        <Item<Fields> label="Organization name" name="sitename">
          <Input placeholder="Type here..." className={darkTheme ? styles.input_bg : ""} />
        </Item>
        <Item<Fields> label="Organization name" name="">
          <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            maxLength={256}
            showCount={true}
            placeholder="Process notes"
            className={darkTheme ? styles.testingTextarea : ""}
            // style={{backgroundColor: "yellow"}}
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
            style={{
              borderRadius: "1px",
              flex: 1,
            }}
          >
            Save
          </Button>
        </div>
      </Form>
    </>
  );
};
