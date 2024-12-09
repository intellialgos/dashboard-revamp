import { Spin, Table } from "antd";
import { useCallback, useState, type FC } from "react";

import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { ProcessAlarmModal } from "../../modals/process-alarm-modal";
import {
  setSelectedEvents,
  setShowProcesslarmModal
} from "../../store/slices/events";
import type { DeviceEvent } from "../../types/device-event";

import { LoadingOutlined } from "@ant-design/icons";
import { generateColumns } from "./config";
import { data } from "./mock";

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
const tableData= data;
export const MaskedSourceTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();


  const handleProcessAlarm = useCallback(
    (selectedEvent: DeviceEvent) => {
      dispatch(setSelectedEvents([selectedEvent]));
      dispatch(setShowProcesslarmModal(true));
    },
    [dispatch],
  );

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      <Table
        rowKey="eventId"
        // headerBg="#fff"
        className={className}
        scroll={{ x: 1200 }}
        // dataSource={event.find((item) => item.pageIndex === pageIndex)?.data}
        dataSource={tableData}
        // headerBg={"#0000FF"}
        sticky={true}
        columns={columns}
        // rowSelection={rowSelection}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || isLoading,
        }}
        pagination={{
          pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          // total: Math.ceil(totalAlerts / pageSize),
          total: totalAlerts,
          current: pageIndex,
          onChange: handlePageChange,
        }}
        data-testid={dataTestId}
      />

      <ProcessAlarmModal dataTestId="process-alarm" />
    </>
  );
};
