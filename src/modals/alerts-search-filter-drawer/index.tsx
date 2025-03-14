import { useEffect, useState, type FC } from "react";
import { Button, Card, Checkbox, DatePicker, Divider, Drawer, Form, Space, Switch, Typography } from "antd";

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
import { DeviceEvent, ProcessStatus } from "@/types/device-event";
import { useEventsFiltersMutation, useGetSitesQuery } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store";
import { setFilters } from "@/store/slices/filters";
import { formatDate, getLastWeekDate } from "@/utils/general-helpers";
import { getShowDateFilter } from "@/store/selectors/sites";
import { selectOptions } from "@/utils/selectOptions";

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
  devices: string;
  priority: number[];
  sites: string[];
  type: unknown[];
  value: unknown[];
  vendors: string[];
  systems: string[];
  status: string[];
  eventType: string;
};

const { Item } = Form;
const { RangePicker } = DatePicker;

// const CustomSelect = ({ options, setState }: { options: any[], setState: React.Dispatch<React.SetStateAction<any[]|undefined>> }) => {
//   const [value, setValue] = useState<string | undefined>(undefined);

//   const handleChange = (val: string) => {
//       // Add custom input to options if it's not already present
//       if (!options.some(option => option.value === val)) {
//           setState([...options, { label: val, value: val }]);
//       }
//       setValue(val);
//   };

//   return (
//       <BaseSelect
//           style={{ width: "100%" }}
//           // placeholder="Select or enter a value"
//           value={value}
//           options={options}
//           onChange={handleChange}
//           onSearch={(val) => setValue(val)} // Update state while typing
//           filterOption={(input, option) => 
//               (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
//           }
//       />
//   );
// };

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
  const [filterBy, setFilterBy] = useState<boolean>(0);


  const filters = useSelector((state: RootState) => state.filters);
  const date = new Date();

  const [ getFilters, {data: filtersData} ] = useEventsFiltersMutation();

  // useEffect(() => {
  //   getFilters({});
  // }, []);

  const handleReset = () => {
  const initialFilters = {
    startTime: formatDate(getLastWeekDate(date)),
    endTime: formatDate(new Date()),
    priority: [],
    devices: null,
    sites: [],
    eventType: null,
    vendors: [],
  };

  // Reset form fields and update values explicitly
  form.resetFields();
  form.setFieldsValue({
    ...initialFilters,
    datetime: [initialFilters.startTime, initialFilters.endTime],
  });

  // Update Redux state with initial filters
  dispatch(setFilters(initialFilters));

  // Close the filter modal
  dispatch(setShowEventsFilterModal(false));
};

  const handleClose = () => {
    dispatch(setShowEventsFilterModal(false));
  };

  const handleSubmit = (values: Fields) => {
    dispatch(setFilters({
      startTime: values.datetime ? values.datetime[0] : filters.startTime,
      endTime: values.datetime ? values.datetime[1] : filters.endTime,
      priority: values.priority ? values.priority.flat() : [],
      devices: values.devices || null,
      sites: values.sites || [],
      eventType: values.eventType || null,
      vendors: values.vendors || []
    }));
    dispatch(setShowEventsFilterModal(false));
  };
  const siteOptions = sites ? sites.map( site => ({
    label: site.name,
    value: site.id
  }) ) : [];

  const AllEventsData = useSelector((state: RootState) => state.events);
  const showDateFilter = useAppSelector(getShowDateFilter);

  var vendors: any = [];
  var devices: any = [];
  var eventTypes: any = [];

  AllEventsData.allEvents.forEach((ev: DeviceEvent) => {  
        // Vendors
        const findVendor = vendors.find((item) => item.value == ev.vendor);
        if (!findVendor) {
          vendors.push({ label: ev.vendor, value: ev.vendor });
        }
        // devices
        const device = devices.find((item) => item.value == ev.obj.name);
        if (!device) {
          devices.push({ label: ev.obj.name, value: ev.obj.name });
        }
        // Event Types
        const type = eventTypes.find((item) => item.value == ev.obj.key);
        if (!type) {
          eventTypes.push({ label: ev.obj.key, value: ev.obj.key });
        }
  });

  // const [ devicesState, setDevices ] = useState<[]>();
  // const [ eventTypesState, setEventTypes ] = useState<[]>();
  
  // useEffect(() => {
  //   if ( filtersData?.eventTypes ) {
  //     setEventTypes(selectOptions(filtersData?.eventTypes) || []);
  //   }
  // }, []);
  
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
      style={{ background:`${darkTheme ? " #0C183B" :"" }`  }}
    >
      <Form<Fields>
        form={form}
        layout="vertical"
        name="alerts-search"
        initialValues={{
          ...filters,
          datetime: [filters.startTime, filters.endTime],
        }}
        onFinish={handleSubmit}
        data-testid="alerts-search-form"
      >
        {/* <Item<Fields>
          label="Priority"
          name="priority"
          getValueProps={getCheckboxGroupProps}
        >
          <Checkbox.Group
            options={ALARM_LEVEL_OPTIONS}
            className={"filter_checkbox"}
          />
        </Item> */}
        <Item<Fields>
          label="Site"
          name="sites"
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
        {
          showDateFilter && 
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
        }
        {/* <Item<Fields>
          label="Vendors"
          name="vendors"
          getValueProps={getMultipleSelectProps}
        >
          <BaseSelect
            mode="tags"
            placeholder="Select Vendors"
            allowClear={true}
            options={selectOptions(filtersData?.vendors) || []}
            className="select_input"
          />
        </Item> */}
        {/* <Divider /> */}
        {/* <Card
          bodyStyle={{display: 'none'}}
          style={{background: 'transparent'}}
          headStyle={{borderBottom: 0, background: 'transparent'}}
          title="Filter By:"
          extra={
            <Space>
                <Typography.Text>Devices</Typography.Text>
                <Switch
                  onChange={setFilterBy}
                  checked={filterBy}
                  style={{ background: filterBy ? '#1568db' : '#dc5b16' }}
                />
                <Typography.Text>Event Type</Typography.Text>
            </Space>
          }
        >
        </Card> */}
        {/* <Divider style={{border: 0, marginBottom: 5}} />
        {
          !filterBy ?
            <Item<Fields>
            label="Device"
            name="devices"
          >
            <BaseSelect
              placeholder="Select device"
              allowClear={true}
              options={selectOptions(filtersData?.devices) || []}
              className="select_input"
            />
          </Item> :
          <Item<Fields>
          label="Event Type"
          name="eventType"
        >
          <BaseSelect
            placeholder="Select Event Type"
            allowClear={true}
            options={selectOptions(filtersData?.eventTypes) || []}
            className="select_input"
          />
        </Item>
        } */}
      </Form>
    </Drawer>
  );
};
