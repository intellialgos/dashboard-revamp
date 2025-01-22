import { Spin, Table } from "antd";
import { useCallback, type FC } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
// import { ProcessAlarmModal } from "@/modals/process-alarm-modal";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowEventsFilterModal,
  setShowProcesslarmModal,
} from "@/store/slices/events";
import type { DeviceEvent } from "@/types/device-event";

import { LoadingOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getEvents, getSelectedRowIds } from "@/store/selectors/events";
import { generateColumns } from "./config";
import { TransformOrgs } from "@/utils/orgs-transform";

type Props = {
  className: string;
  dataTestId: string;
  data: any;
  pageIndex: number;
  pageSize: number;
  isLoading: boolean;
  totalAlerts: number;
  handlePageChange: () => void;
  loading: boolean;
};

export const SiteConfigurationTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  isLoading,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
}) => {

  const dispatch = useAppDispatch();
  const event = useAppSelector(getEvents);
  const rowKey = useAppSelector(getSelectedRowIds);

  const handleDelete = useCallback(
    (selectedEvent: DeviceEvent) => {
      dispatch(setSelectedEvents([selectedEvent]));
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
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
      <Table
        bordered
        rowKey="key"
        className={className}
        // scroll={{ x: 1200 }}
        // dataSource={event.find((item) => item.pageIndex === pageIndex)?.data}
        dataSource={(data && data?.error == 0) ? TransformOrgs(data?.orgs) : []}
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
