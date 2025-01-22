import { Tag, Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { AlarmLevel, DeviceEvent } from "@/types/device-event";
import { getFormattedDateTime } from "@/utils/get-formatted-date-time";
import { AlarmLevelTag } from "../alarm-level-tag";
import { StatusLevelTag } from "../status-level-tag";
import { PoweroffOutlined } from "@ant-design/icons";

const { Link } = Typography;

type ColumnParams = {
  onProcess: (event: DeviceEvent) => void;
};

export const generateColumns = (): ColumnType<DeviceEvent>[] => [
  {
    title: "ID",
    dataIndex: "id",
    width:88,
    sorter:true
  },
  {
    title: "Name",
    dataIndex: "name",
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
    dataIndex: "connectionState",
    width:100,
    render: (state: boolean) =><div style={{display:"flex",justifyContent:"center"}}>
      <Tag color={state ? "green" : "red"}> <PoweroffOutlined /> { state ? "Online" : "Offline" } </Tag>
    </div>,

    
  },

];
