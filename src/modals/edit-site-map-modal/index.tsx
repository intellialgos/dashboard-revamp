import { Button, DatePicker, Drawer, Form, Input, Space } from "antd";
import { useState, type FC, useContext} from "react";

import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { EditSiteInfo } from "../../components/edit-site-info";
import { APP_DATE_TIME_FORMAT } from "../../const/common";
import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { useAppSelector } from "../../hooks/use-app-selector";
import { getShowEventsFilterModalState } from "../../store/selectors/events";
import { setShowEventsFilterModal } from "../../store/slices/events";
import { getDateFromEvent } from "../../utils/form-helpers/get-date-from-event";
import { getDateProps } from "../../utils/form-helpers/get-date-props";
import styles from "./index.module.css";
import { ThemeContext } from "../../theme";

type Props = {
  dataTestId?: string;
  handlePageFilterDate: (
    startDate: string,
    endDate: string,
    levels: number[],
  ) => void;
  alarmRecord?: boolean;
  title?: string;

};

type Fields = {
  datetime: string[];
  object: unknown[];
  priority: number[];
  site: unknown[];
  type: unknown[];
  value: unknown[];
  vendor: unknown[];
  system: unknown[];
  device: unknown[];
  eventDetails: unknown[];
  status: unknown[];
};

const { Item } = Form;
const { RangePicker } = DatePicker;
const initialValues: Fields = {
  datetime: [],
  status: [],
  object: [],
  priority: [],
  site: [],
  type: [],
  value: [],
  vendor: [],
  system: [],
  device: [],
  eventDetails: [],
};

export const EditSiteMapModal: FC<Props> = ({
  dataTestId,
  title,

}) => {
  const dispatch = useAppDispatch();
  const show = useAppSelector(getShowEventsFilterModalState);
  const [form] = Form.useForm<Fields>();
  const [expand, setExpand] = useState<boolean>(false);
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const handleReset = () => {
    dispatch(setShowEventsFilterModal(false));
  };

  const handleClose = () => {
    dispatch(setShowEventsFilterModal(false));
  };

  const handleSubmit = (values: Fields) => {
   
    dispatch(setShowEventsFilterModal(false));
  };
 
  return (
    <Drawer
      open={show}
      width={460}
      title={title ? title : "Edit Site"}
      extra={
      !title && (
        <Space>
        <Button
          type="default"
          onClick={handleReset}
          style={{
            background: "transparent",
            borderRadius: "1px",
            borderColor: "#1B3687",
          }}
        >
          Cancel
        </Button>
        <Button
          // type="primary"
          onClick={form.submit}
          danger
          icon={<DeleteOutlined />}
          style={{ borderRadius: "1px", background:`${darkTheme ? "rgba(12, 24, 59, 1)" : ""}`}}
        >
          Delete
        </Button>
        <Button
          type="primary"
          onClick={form.submit}
          style={{ borderRadius: "1px" }}
        >
          Save
        </Button>
      </Space>
      ) 
      }
      // destroyOnClose={true}
      onClose={handleClose}
      data-testid={dataTestId}
      className={`${darkTheme ? "modal_bg_dark" : ""}`}

    
    >
      <Form<Fields>
        form={form}
        layout="vertical"
        name="alerts-search"
        initialValues={initialValues}
        onFinish={handleSubmit}
        data-testid="alerts-search-form"
      >
        {!title ? (
          <>
            <Item<Fields> label="Name" name="remarks">
              <Input placeholder="Name" className={`${darkTheme ? styles.input_bg : ""}`} />
            </Item>
            <Item<Fields> label="Address" name="remarks">
              <Input placeholder="Address" className={`${darkTheme ? styles.input_bg : ""}`} />
            </Item>
            <Item<Fields> label="Contact 1" name="remarks">
              <Input placeholder="Name" className={`${darkTheme ? styles.input_bg : ""}`} />
            </Item>
            <Item<Fields> name="remarks">
              <Input placeholder="Email" className={`${darkTheme ? styles.input_bg : ""}`} />
            </Item>
            <Item<Fields> name="remarks">
              <Input placeholder="Phone" className={`${darkTheme ? styles.input_bg : ""}`} />
            </Item>
            <Item<Fields> label="Contact 2" name="remarks">
              <Input placeholder="Name" className={`${darkTheme ? styles.input_bg : ""}`} />
            </Item>
            <Item<Fields> name="remarks">
              <Input placeholder="Email" className={`${darkTheme ? styles.input_bg : ""}`} />
            </Item>
            <Item<Fields> name="remarks">
              <Input placeholder="Phone" className={`${darkTheme ? styles.input_bg : ""}`} />
            </Item>
            <Item<Fields>
              label="Start and End, Date and Time"
              name="datetime"
              getValueFromEvent={getDateFromEvent}
              getValueProps={getDateProps}
            >
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format={APP_DATE_TIME_FORMAT}
                className="date_input"
              />
            </Item>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Item<Fields> label="Latitude" name="remarks">
                <Input placeholder="35.1432" className={`${darkTheme ? styles.input_bg : ""}`} />
              </Item>
              <Item<Fields> label="Longtitude" name="remarks">
                <Input placeholder="50.3456" className={`${darkTheme ? styles.input_bg : ""}`} />
              </Item>
            </div>
            <Button
              type="default"
              // onClick={handleReset}
              style={{
                background: "transparent",
                borderRadius: "1px",
                borderColor: "#1B3687",
                width: "100%",
              }}
              icon={<PlusCircleOutlined />}
              onClick={() => setExpand(!expand)}
            >
              {expand ? "Collapse" : "Expand"} Advance Info
            </Button>
            <>
              {expand && (
                <div style={{ marginTop: "1rem" }}>
                  <EditSiteInfo />
                </div>
              )}
            </>
          </>
        ) : (
          <EditSiteInfo title={title} />
        )}
      </Form>
    </Drawer>
  );
};
