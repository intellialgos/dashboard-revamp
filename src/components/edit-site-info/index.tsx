import { type FC, useMemo,useContext, useEffect, useState } from "react";

import { DescriptionList, DescriptionListItem } from "@/description-list";
import { StatusLevelTag } from "../status-level-tag";
import { Button, Card, Form, FormListFieldData, Input, InputNumber, Skeleton, Space, Tag } from "antd";
import styles from "./index.module.css";
import { DeleteOutlined, PlusOutlined, PoweroffOutlined, RedoOutlined } from "@ant-design/icons";
import { BaseSelect } from "../base-select";
import { ThemeContext } from "@/theme";
import { useDeleteMaskedItemMutation, useGetBoxStatusMutation, useGetIoEventsMutation, useGetMaskedItemMutation, useRestartBoxMutation, useUpdateIoEventsMutation } from "@/services";
import useMessage from "antd/es/message/useMessage";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getSelectedSite } from "@/store/selectors/sites";
import { DeviceEvent } from "@/types/device-event";

type Props = {
  className?: string;
  dataTestId?: string;
  title?:string;
  data?: any,
  boxStatus: any,
  ioEvents: any,
  maskedItem: any,
  site: string,
};
const { Item } = Form;
export const EditSiteInfo: FC<Props> = ({
  className,
  dataTestId,
  data,
  boxStatus,
  ioEvents,
  maskedItem,
  site,
  title
}) => {
  const [ restartBox, { isLoading } ] = useRestartBoxMutation();
  const [ messageApi, messageContext ] = useMessage();
  const [ updateIoEvents, { isLoading: ioEventsLoading } ] = useUpdateIoEventsMutation();
  const [filteredMaskedItems, setMaskedItems] = useState([]);

  const [form] = Form.useForm();


  const [ deleteMasked, {isLoading: isRecovering} ] = useDeleteMaskedItemMutation();
  
  const handleRestart = async () => {
    try {
      const response = await restartBox({siteId: site});
      if ( response && !response?.error ) {
        messageApi.success('App has been rebooted !');
        // refetch();
      } else if (response?.error) {
        messageApi.error(response?.desc);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  }
  const handleUpdateIoEvents = async (data: any) => {
    try {
      const response = await updateIoEvents({
        siteId: site,
        ...data
      });
      if ( response && !response?.error ) {
        messageApi.success('IO Events Text has been updated !');
      } else if ( response?.error ) {
        messageApi.error(response?.desc);
      }
    } catch (error) {
      messageApi.error("There was an error");
    }
  }
  const handleRecovery = async (keyId: number) => {
    const res = await deleteMasked({keyId: keyId});
    if (res.data?.error === 0) {
      setMaskedItems((prevItems: any[]) => prevItems.filter((item) => item.keyId !== keyId));
      messageApi.open({
        type: "success",
        content: "Recovered Successfully !",
      });
    } else {
      messageApi.open({
        type: "error",
        content: "There was an error",
      });
    }
  }
  useEffect(() => {
    if (maskedItem?.list) {
      setMaskedItems(maskedItem.list.filter((i:any) => i.siteId == site));
    }
  }, [maskedItem])

  // TODO: Get rest info from BE
  const items = useMemo<DescriptionListItem[]>(
    () => [
      { label: "Box Type", value: <Tag color={(boxStatus?.boxType == 'sbox-linux') ? "orange" : "cyan"}> { (boxStatus?.boxType == 'sbox-linux') ? "Linux" : "Windows" } </Tag> },
      {
        label: "Status",
        value: (
          <>
            <Space size="small">
            <Tag color={boxStatus?.connectionState ? "green" : "red"}> <PoweroffOutlined /> { boxStatus?.connectionState ? "Online" : "Offline" } </Tag>
              {
                boxStatus?.connectionState &&
                <Button size="small" loading={isLoading} type="primary" onClick={handleRestart}>Reboot App</Button>
              }
            </Space>
          </>
        ),
      },
      { label: "Current Firmware Version", value: boxStatus?.firmwareVersion?.currentFwVersion || "N/A" },
      { label: "Pending Firmware Version", value: boxStatus?.firmwareVersion?.pendingFwVersion || "N/A" },
      { label: "Firmware Update Status", value: <Tag color={boxStatus?.firmwareVersion?.fwUpdateStatus == "error" ? "error" : "blue"}>{boxStatus?.firmwareVersion?.fwUpdateStatus}</Tag> },
      { label: "Os Version", value: boxStatus?.osVersion || "N/A" }
    ],
    [site],
  );

  const maskeditems = useMemo<DescriptionListItem[]>(
    () =>
      filteredMaskedItems
        ? filteredMaskedItems.flatMap((item: any) => [
            { label: "Site ID", value: site },
            { label: "Source ID", value: item?.objId || "N/A" },
            { label: "Ignore ID", value: item?.keyId || "N/A" },
            { label: "Item Key", value: item?.key || "N/A" },
            { label: "Action", value: <Button onClick={() => handleRecovery(item?.keyId)} type="primary" size="small" icon={<RedoOutlined />}>Recovery</Button> }
          ])
        : [],
    [site, maskedItem, filteredMaskedItems],
  );

  return (
    <>
      {messageContext}

    {

    }
      <DescriptionList
        className={className}
        // title="Site Info"
        items={data ? data : items}
        dataTestId={dataTestId}
      />
      <Form
        layout="vertical"
        form={form}
        style={{ textAlign: 'center' }}
        onFinish={handleUpdateIoEvents}
        disabled={ioEventsLoading}
      >
        <Form.List
          name={'ioCustomText'}
          initialValue={ioEvents ?? [{}]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <ContactCard
                  key={field.key}
                  field={field}
                  remove={remove}
                  length={fields.length}
                />
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ marginBottom: 20, background: 'transparent' }}
                block
              >
                <PlusOutlined />
                Add Another
              </Button>
            </>
          )}
        </Form.List>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={ioEventsLoading}
          style={{ marginBottom: 30 }}
        >
          Apply IO Alarm Text
        </Button>
      </Form>

        
      <DescriptionList
        className={className}
        title={`Masked Source (${filteredMaskedItems.length})`}
        items={maskeditems}
        dataTestId={dataTestId}
      />
    </>
  );
};

const ContactCard = ({field, remove, length}: {length: number,field: FormListFieldData, remove: (index: number|number[]) => void}) => {
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  return (
      <Card className="contact_card" style={{marginBottom:"1rem"}} key={field.key}>
        <Item
          label="IO"
          name={[field.name, "io"]}
          rules={[ {required: true}, { type: "number", min: 0, max: 1000, message: "IO between 0-1000" } ]}
        >
          <InputNumber
            style={{width: '100%'}}
            placeholder="0"
            className={`${darkTheme ? styles.input_bg : ""}`}
            type="number"
            min={0}
            max={1000}
          />
        </Item>
        <Item label="Alarm Text" name={[field.name, "text"]} rules={[{ required: true }]}>
          <Input
            placeholder="Type here..."
            className={`${darkTheme ? styles.input_bg : ""}`}
            />
        </Item>
        {/* When Clicked on Edit */}
        <Item
          label="Alarm Level"
          name={[field.name, "level"]}
        >
        <BaseSelect
            placeholder="Select"
            options={[
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4", value: 4 },
              { label: "5", value: 5 },
            ]}
            className={`${darkTheme ? styles.input_bg : ""} select_input`}
          />
        </Item>
       
         {/* When Clicked on Edit */}
        <Button
          type="default"
          onClick={() => {
            remove(field.name);
          }}
          style={{
           background:`rgba(255, 77, 79, 1)`,
            borderRadius: "1px",
            width: "100%",
            marginBottom: 10
          }}
          icon={<DeleteOutlined />}
         
        >
         Delete
        </Button>
      </Card>
  );
};
