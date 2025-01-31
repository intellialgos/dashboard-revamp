import { message, Spin, Table } from "antd";
import { useCallback, useEffect, useState, type FC } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { ProcessAlarmModal } from "@/modals/process-alarm-modal";
import {
  setSelectedEvents,
  setShowProcesslarmModal
} from "@/store/slices/events";
import type { DeviceEvent } from "@/types/device-event";

import { LoadingOutlined } from "@ant-design/icons";
import { generateColumns } from "./config";
import { data } from "./mock";
import { useDeleteMaskedItemMutation, useGetMaskedItemMutation, useGetSitesQuery } from "@/services";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/query";

type Props = {
  className: string;
  dataTestId: string;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: () => void;
  loading: boolean;
  refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>>
};
const tableData= data;
export const MaskedSourceTable: FC<Props> = ({
  className,
  dataTestId,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
  refetch
}) => {

  const dispatch = useAppDispatch();
  const [ getMaskedItems, { isLoading, data } ] = useGetMaskedItemMutation();
  const { currentData: sites } = useGetSitesQuery({});

  const [messageApi, messageContext] = message.useMessage();

  const [ deleteMaskedItem ] = useDeleteMaskedItemMutation();

  useEffect(() => {
    getMaskedItems({});
  }, [])

  const handleProcessAlarm = useCallback(
    async (keyId: number) => {
      const response = await deleteMaskedItem({keyId: keyId});
      if ( response?.data?.error == 0 ) {
        messageApi.success("Recovery Successful");
      } else {
        messageApi.error("There was an error");
      }
      await getMaskedItems({});
    },
    [dispatch],
  );

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
    sites: sites ? sites?.data : []
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <>
    {messageContext}
      <Table
        rowKey="eventId"
        // headerBg="#fff"
        className={className}
        scroll={{ x: 1200 }}
        // dataSource={event.find((item) => item.pageIndex === pageIndex)?.data}
        dataSource={data ? data?.data?.list : []}
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

      <ProcessAlarmModal refetch={refetch} dataTestId="process-alarm" />
    </>
  );
};
