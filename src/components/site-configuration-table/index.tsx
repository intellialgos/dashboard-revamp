import { Spin, Table } from "antd";
import { useCallback, useState, type FC } from "react";

import { useAppDispatch } from "../../hooks/use-app-dispatch";
// import { ProcessAlarmModal } from "../../modals/process-alarm-modal";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowEventsFilterModal,
  setShowProcesslarmModal,
} from "../../store/slices/events";
import type { DeviceEvent } from "../../types/device-event";

import { LoadingOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../hooks/use-app-selector";
import { getEvents, getSelectedRowIds } from "../../store/selectors/events";
import { generateColumns } from "./config";
import { data } from './mock'

type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: () => void;
  loading: boolean;
  setDeleteModal:React.Dispatch<React.SetStateAction<boolean>>;
};
const tableData = data;
export const SiteConfigurationTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
  setDeleteModal
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const event = useAppSelector(getEvents);
  const rowKey = useAppSelector(getSelectedRowIds);

 
  const handleProcessAlarm = useCallback(
    (selectedEvent: DeviceEvent) => {
      dispatch(setSelectedEvents([selectedEvent]));
      dispatch(setShowProcesslarmModal(true));
    },
    [dispatch],
  );
  const handleDelete = useCallback(
    (selectedEvent: DeviceEvent) => {
      dispatch(setSelectedEvents([selectedEvent]));
      setDeleteModal(true)
    },
    [dispatch],
  );
  const handleEdit = useCallback(
    (selectedEvent: DeviceEvent) => {
      dispatch(setSelectedEvents([selectedEvent]));
      dispatch(setShowEventsFilterModal(true));
    },
    [dispatch],
  );

  const columns = generateColumns({
    onEdit:handleEdit,
    onProcess: handleProcessAlarm,
    onDelete:handleDelete,
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      <Table
        rowKey="eventId"
        className={className}
        // scroll={{ x: 1200 }}
        // dataSource={event.find((item) => item.pageIndex === pageIndex)?.data}
        dataSource={tableData}
        sticky={true}
        columns={columns}
        showSorterTooltip={false}
        // rowSelection={rowSelection}
        pagination={{ showQuickJumper: true, showSizeChanger: true }}
        data-testid={dataTestId}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || isLoading,
        }}
      />

    </>
  );
};
