import { type FC, useCallback, useState } from "react";
import { Spin, Table } from "antd";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { ProcessAlarmModal } from "@/modals/process-alarm-modal";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
  setShowSiteInfoModal,
} from "@/store/slices/events";
import type { DeviceEvent } from "@/types/device-event";

import { generateColumns } from "./config";
import { data } from "./mock";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  getAlarmRecordEvents,
  getEvents,
  getSelectedRowIds,
} from "@/store/selectors/events";
import { LoadingOutlined } from "@ant-design/icons";
import { SiteInfo } from "@/modals/site-info-modal";
import { useGetSitesQuery } from "@/services";
import { OrganisationSite } from "@/types/organisation";
import { setSiteObject } from "@/store/slices/sites";

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
export const DisconnectedSitesTable: FC<Props> = ({
  className,
  dataTestId,
  data,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
}) => {

  const { currentData, isLoading, refetch } = useGetSitesQuery({connectionState: false});

  const dispatch = useAppDispatch();
  const event = useAppSelector(getAlarmRecordEvents);
  const rowKey = useAppSelector(getSelectedRowIds);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    dispatch(setSelectedEventsId(selectedRowKeys));
    console.log("Selected Row Keys:", rowKey);
  };

  const rowSelection = {
    selectedRowKeys: rowKey,
    onChange: onSelectChange,
  };

  const handleProcessAlarm = useCallback(
    (record: OrganisationSite) => {
      dispatch(setSiteObject(record));
      // dispatch(setShowProcesslarmModal(true));
      dispatch(setShowSiteInfoModal(true));
    },
    [dispatch],
  );

  const columns = generateColumns({
    onProcess: handleProcessAlarm,
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const handleSiteInfo = () => {
  
  };

  return (
    <>
      <Table
        rowKey="eventId"
        // headerBg="#fff"
        className={className}
        scroll={{ x: 1200 }}
        // dataSource={event.find((item) => item.pageIndex === pageIndex)?.data}
        dataSource={currentData ? currentData.filter(site => site.connectionState == false) : []}
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

     
      <SiteInfo refetch={refetch} />

    </>
  );
};
