import styles from "./index.module.css";
import { Button, Col, DatePicker, Spin, Table, message } from "antd";
import { useEffect, useCallback, useState, type FC, useContext } from "react";

import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
} from "@/store/slices/events";
import { DeviceEvent } from "@/types/device-event";
import { generateColumns } from "./config";
import { formatDate, getLastMonthDate, getLastWeekDate } from "@/utils/general-helpers";
import { useGetFastRecoveryMutation, useQueryeventsiteMutation } from "@/services";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { APP_DATE_TIME_FORMAT } from "@/const/common";
import { ThemeContext } from "@/theme";
type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: () => void;
  loading: boolean;
};


const { RangePicker } = DatePicker;

export const AlarmSelfRecoveryTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
}: Props) => {
  const dispatch = useDispatch();
  const [getAllEvents, { isLoading }] = useQueryeventsiteMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const [ getFastRecovery, {isLoading: recoveryLoading} ] = useGetFastRecoveryMutation();
  let date = new Date();

  const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => {
    const today = dayjs();
    const lastMonthDate = dayjs().subtract(1, "month");
    return [lastMonthDate, today];
  });
  const [body, setBody] = useState({
    startTime: formatDate(getLastMonthDate(date)),
      endTime: formatDate(date),
  });

  const handleDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (dates) {
      setSelectedDates(dates); // Update the state with the selected dates
      console.log("DATE: ", selectedDates);
    }
  };

  const [alertsSite,setAlertsSite]=useState<any[]>([])
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await getFastRecovery(body);
      if (res?.error) {
        messageApi.open({
          type: "error",
          content: "Request Timeout",
        });
      }
      setAlertsSite(res.data.data.site);
    })();
  }, [body]);

  useEffect(() => {
    if (selectedDates) {
      setBody({
        startTime: formatDate(selectedDates[0].toDate()), // Convert Dayjs to Date
        endTime: formatDate(selectedDates[1].toDate()), // Convert Dayjs to Date
      });
    }
  }, [selectedDates]);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId({ selectedRowKeys, pageIndex }));
  };

  const rowSelection = {
    // selectedRowKeys: rowKey,
    onChange: onSelectChange,
  };

  const handleProcessAlarm = useCallback(
    (selectedEvent: any) => {
      
      // dispatch(setSelectedEvents([selectedEvent]));
      // dispatch(setShowProcesslarmModal(true));
      navigate(`/alarm/self-recovery-site?siteId=${selectedEvent.id}&&title=${selectedEvent.name}`)
      console.log("selectedEvent",selectedEvent)

    },
    [dispatch],
  );

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  return (

    <>
    {contextHolder}
      <Col span={24}>
          <div
            className={styles.container}
            style={{marginBottom: 20}}
            data-testid="alarm-record-grid-search"
          >
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format={APP_DATE_TIME_FORMAT}
              className={`date_input_alarm ${darkTheme ? "date_input_alarm_bg":""}`}
              style={{ flex: 1 }}
              value={selectedDates} // Set default values
              onChange={handleDateChange}
            />
          </div>
        </Col>
      <Table
        rowKey="eventId"
        className={className}
        scroll={{ x: 1200 }}
        sticky={true}
        columns={columns}
        dataSource={alertsSite}
        // rowSelection={rowSelection}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: isLoading,
        }}
        // pagination={{
        //   pageSize,
        //   showQuickJumper: true,
        //   showSizeChanger: true,
        //   total: Math.ceil(totalAlerts / pageSize),
        //   current: pageIndex,
        //   onChange: handlePageChange,
        // }}
        data-testid={dataTestId}
        // preserveSelectedRowKeys={true}
      />
    </>
  );
};
