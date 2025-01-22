import { type FC, useCallback, useState } from "react";
import { Spin, Table } from "antd";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import {
  setSelectedEvents,
  setSelectedEventsId,
  setShowProcesslarmModal,
  setShowSiteInfoModal,
} from "@/store/slices/events";
import type { DeviceEvent } from "@/types/device-event";

import { generateColumns } from "./config";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  getAlarmRecordEvents,
  getSelectedRowIds,
} from "@/store/selectors/events";
import { LoadingOutlined } from "@ant-design/icons";
import { SiteInfoModal } from "@/modals/site-info-modal";
import { OrganisationSite } from "@/types/organisation";

type Props = {
  className: string;
  dataTestId: string;
  data: DeviceEvent | null;
  pageIndex: number;
  pageSize: number;
  totalAlerts: number;
  handlePageChange: () => void;
  loading: boolean;
  sites: OrganisationSite[]
};
export const SiteMapTable: FC<Props> = ({
  className,
  dataTestId,
  sites,
  pageIndex,
  pageSize,
  totalAlerts,
  handlePageChange,
  loading,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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
    (selectedEvent: DeviceEvent) => {
      dispatch(setSelectedEvents([selectedEvent]));
      dispatch(setShowProcesslarmModal(true));
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
        className={className}
        dataSource={sites}
        sticky={true}
        columns={columns}
        showSorterTooltip={false}
        loading={{
          indicator: <Spin indicator={antIcon} />,
          spinning: loading || isLoading,
        }}
        pagination={false}
        // pagination={{
        //   pageSize,
        //   showQuickJumper: true,
        //   showSizeChanger: true,
        //   // total: Math.ceil(totalAlerts / pageSize),
        //   total: totalAlerts,
        //   current: pageIndex,
        //   onChange: handlePageChange,
        // }}
        data-testid={dataTestId}
      />

     
      <SiteInfoModal handlePageFilter={handleSiteInfo} />

    </>
  );
};
