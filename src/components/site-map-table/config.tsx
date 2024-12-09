import { Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { AlarmLevel, DeviceEvent } from "../../types/device-event";
import { getFormattedDateTime } from "../../utils/get-formatted-date-time";
import { AlarmLevelTag } from "../alarm-level-tag";
import { StatusLevelTag } from "../status-level-tag";

const { Link } = Typography;

type ColumnParams = {
  onProcess: (event: DeviceEvent) => void;
};

export const generateColumns = (): ColumnType<DeviceEvent>[] => [
  {
    title: "ID",
    dataIndex: ["site", "id"],
    width:88,
    sorter:true
  },
  {
    title: "Name",
    dataIndex: ["site", "name"],
    sorter:true,
    width:100
  },
  {
    title: "Client Name",
    dataIndex: "vendor",
    width:100,
    sorter:true
  },
  {
    title: "Status",
    sorter: true,
    dataIndex: "statusLevel",
    width:100,
    render: (statusLevel: AlarmLevel) =><div style={{display:"flex",justifyContent:"center"}}> <StatusLevelTag level={statusLevel} /></div>,

    
  },

];
