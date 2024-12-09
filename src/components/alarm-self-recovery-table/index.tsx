import { Spin, Table, message } from "antd";
import { useEffect, useCallback, useState, type FC } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
} from "../../store/slices/events";
import { DeviceEvent } from "../../types/device-event";
import { generateColumns } from "./config";
import { formatDate, getLastWeekDate } from "../../utils/general-helpers";
import { useQueryeventsiteMutation } from "../../services";
import { useNavigate } from "react-router-dom";
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

  const [alertsSite,setAlertsSite]=useState<any[]>([])
  const navigate = useNavigate();
  let date = new Date();
  useEffect(() => {
    const body = {
      startTime: formatDate(getLastWeekDate(date)),
      endTime: formatDate(date),
    };
    (async () => {
      const res = await getAllEvents(body);
      if (res?.error) {
        messageApi.open({
          type: "error",
          content: "Request Timeout",
        });
      }
      setAlertsSite(res.data.data.site);
    })();
  }, []);

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

  return (

    <>
    {contextHolder}
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
