import type { FC } from "react";
import { Button, Checkbox, DatePicker, Drawer, Form, Space } from "antd";

import { BaseSelect } from "@/components/base-select";
import { ALARM_LEVEL_OPTIONS, ALARM_LEVEL_MAP } from "@/const/alarm";
import { APP_DATE_TIME_FORMAT } from "@/const/common";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getShowEventsFilterModalState } from "@/store/selectors/events";
import {
  clearAllEvents,
  setShowEventsFilterModal,
} from "@/store/slices/events";
import { getCheckboxGroupProps } from "@/utils/form-helpers/get-checkbox-group-props";
import { getDateFromEvent } from "@/utils/form-helpers/get-date-from-event";
import { getDateProps } from "@/utils/form-helpers/get-date-props";
import { getMultipleSelectProps } from "@/utils/form-helpers/get-multiple-select-props";
import { ProcessStatus } from "@/types/device-event";
import { useGetSitesQuery } from "@/services";

type Props = {
  dataTestId?: string;
  handlePageFilterDate: (
    startDate: string,
    endDate: string,
    levels: number[],
  ) => void;
  alarmRecord?: boolean;
  darkTheme?:boolean
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
const processStatusOptions = [
  { label: "Pending", value: ProcessStatus.Pending },
  { label: "Completed", value: ProcessStatus.Accomplished },
];

export const AlertsSearchFilterDrawer: FC<Props> = ({
  dataTestId,
  handlePageFilterDate,
  alarmRecord,
  darkTheme
}) => {
  const { currentData: sites, isLoading: sitesLoading } = useGetSitesQuery({});
  const dispatch = useAppDispatch();
  const show = useAppSelector(getShowEventsFilterModalState);
  const [form] = Form.useForm<Fields>();

  const handleReset = () => {
    form.resetFields();
    handleSubmit(initialValues);
    dispatch(setShowEventsFilterModal(false));
  };

  const handleClose = () => {
    dispatch(setShowEventsFilterModal(false));
  };

  const handleSubmit = (values: Fields) => {
    handlePageFilterDate(
      values.datetime[0],
      values.datetime[1],
      values.priority,
    );
    dispatch(setShowEventsFilterModal(false));
  };
  const siteOptions = sites ? sites.map( site => ({
    label: site.name,
    value: site.id
  }) ) : [];
  return (
    <Drawer
      open={show}
      width={460}
      title="Filter"
      extra={
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
            Reset
          </Button>
          <Button
            type="primary"
            onClick={form.submit}
            style={{ borderRadius: "1px" }}
          >
            Apply
          </Button>
        </Space>
      }
      // destroyOnClose={true}
      onClose={handleClose}
      data-testid={dataTestId}
      style={{ background: `${darkTheme ? " #0C183B" : "" }` }}
    >
      <Form<Fields>
        form={form}
        layout="vertical"
        name="alerts-search"
        initialValues={initialValues}
        onFinish={handleSubmit}
        data-testid="alerts-search-form"
      >
        <Item<Fields>
          label="Priority"
          name="priority"
          getValueProps={getCheckboxGroupProps}
        >
          <Checkbox.Group
            options={ALARM_LEVEL_OPTIONS}
            className={"filter_checkbox"}
          />
        </Item>
        {alarmRecord && (
          <Item<Fields>
            label="Status"
            name="status"
            getValueProps={getCheckboxGroupProps}
          >
            <Checkbox.Group
              options={processStatusOptions}
              className={"filter_checkbox"}
            />
          </Item>
        )}
        <Item<Fields>
          label="Site"
          name="site"
          getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="multiple"
            placeholder="Select Site"
            allowClear={true}
            loading={sitesLoading}
            options={siteOptions}
            className="select_input"
          />
        </Item>
        <Item<Fields>
          label="Date and Time"
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
        <Item<Fields>
          label="System"
          name="system"
          getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="multiple"
            placeholder="Select System"
            allowClear={true}
            className="select_input"
          />
        </Item>
        <Item<Fields>
          label="Device"
          name="device"
          getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="multiple"
            placeholder="Select device"
            allowClear={true}
            className="select_input"
          />
        </Item>
        <Item<Fields>
          label="Event Type"
          name="type"
          getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="multiple"
            placeholder="Select Event Type"
            allowClear={true}
            className="select_input"
          />
        </Item>
        <Item<Fields>
          label="Event Details"
          name="eventDetails"
          getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="multiple"
            placeholder="Select Event Details"
            allowClear={true}
            className="select_input"
          />
        </Item>
      </Form>
    </Drawer>
  );
};
