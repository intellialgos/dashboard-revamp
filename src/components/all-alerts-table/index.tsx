import { type FC, useCallback, useState, useEffect } from "react";
import { Spin, Table, message, type TableProps } from "antd";

import { ProcessAlarmModal } from "@/modals/process-alarm-modal";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
  setTotalAlertsGlobal,
} from "@/store/slices/events";
import { useDispatch, useSelector } from "react-redux";
import { generateColumns } from "./config";
import { DeviceEvent } from "@/types/device-event";
import { LoadingOutlined } from "@ant-design/icons";
import { useProcessEventMutation, useQueryEventsMutation } from "@/services";
import { ReqProcessEvent } from "@/types/process-event";
import { useAppSelector } from "@/hooks/use-app-selector";
import { getEvents, getSelectedRowIds } from "@/store/selectors/events";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/query";
import { RootState } from "@/types/store";
type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: () => void;
  loading: boolean;
  refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>>
};

export const AllAlertsTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
  refetch
}: Props) => {
  const dispatch = useDispatch();
  // const event = useAppSelector(getEvents); //needs to be passed from parents
  const rowKey = useAppSelector(getSelectedRowIds);
  const [handleProcessEvents, {}] = useProcessEventMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const filters = useSelector((state: RootState) => state.filters);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const rowSelection: TableProps<any>["rowSelection"] = {
  //   onChange: (selectedRowKeys: React.Key[], selectedRows: unknown[]) => {
  //     dispatch(setSelectedEventsId(selectedRowKeys));
  //     console.log("Selected Row Keys",selectedRowKeys)

  //   },
  //   // selectedRowKeys: rowKey,

  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   getCheckboxProps: (record: any) => ({
  //     disabled: record.name === "Disabled User", // Column configuration not to be checked
  //     name: record.name,
  //   }),
  // };
  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId({ selectedRowKeys, pageIndex }));
  };

  const rowSelection = {
    selectedRowKeys: rowKey,
    onChange: onSelectChange,
  };

  const handleProcessAlarm = useCallback(
    (selectedEvent: DeviceEvent) => {
      console.log(selectedEvent);
      dispatch(setSelectedEvents([selectedEvent]));
      dispatch(setShowProcesslarmModal(true));
    },
    [dispatch, refetch],
  );

  const handleMark = async (selectedEvent: DeviceEvent) => {
    setIsLoading(true);
    const event: Array<number> = [];
    event.push(...event, selectedEvent.eventId);
    const body: ReqProcessEvent = {
      event,
      processStatus: 2,
    };
    const res = await handleProcessEvents(body);
    if (res) {
      setIsLoading(false);
      if (res.data) {
        refetch({...filters});
        messageApi.open({
          type: "success",
          content: "Process status updated",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Process status update failed",
        });
      }
    }
  };

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
    onMark: handleMark,
  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const [getEvents, {data: events , isLoading: tableLoading}] = useQueryEventsMutation();

  useEffect(() => {
    (async () => {
      await getEvents({
        ...filters,
        pageSize,
        pageIndex
      });
    })()
}, [filters, pageSize, pageIndex]);

  useEffect(() => {
    if ( events ) {
      const total = events?.data?.totalCount || 0;
      dispatch(setTotalAlertsGlobal(total));
    }
  }, [events])

  return (
    <>
      {contextHolder}
      <Table
        rowKey="eventId"
        // headerBg="#fff"
        className={className}
        scroll={{ x: 1200 }}
        dataSource={events?.data?.event}
        sticky={true}
        columns={columns}
        rowSelection={rowSelection}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || tableLoading,
        }}
        pagination={{
          pageSize,
          current: pageIndex,
          total: events?.data?.totalCount,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: handlePageChange,
        }}
        data-testid={dataTestId}
        // preserveSelectedRowKeys={true}
      />

      <ProcessAlarmModal refetch={refetch} dataTestId="process-alarm" />
    </>
  );
};
