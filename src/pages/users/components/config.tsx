import { Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { AlarmLevel, DeviceEvent } from "../../../types/device-event";
import { getFormattedDateTime } from "../../../utils/get-formatted-date-time";
import { AlarmLevelTag } from "../../../components/alarm-level-tag";

const { Link } = Typography;

type ColumnParams = {
  onProcess: (event: DeviceEvent) => void;
};

export const generateColumns = ({
  onProcess,
}: ColumnParams): ColumnType<DeviceEvent>[] => [
  {
    title: "Username",
    sorter: true,
    dataIndex: "username",
    width: 130
  },
  {
    title: "Nick Name",
     sorter: true,
    dataIndex: "nickname",
  },
  {
    title: "Account Type",
    sorter: true,
    dataIndex: "accountType",
    sorter: true,
    width: 192,
  },
  {
    title: "Permission",
    sorter: false,
    dataIndex: "permissions",
  },
  {
    title: "Actions",
    dataIndex: "eventId",
    sorter: false,
    width: 130,
    fixed: "right",
    render(_, event) {
      return <Link onClick={() => onProcess(event)}>Acknowledge</Link>;
    },
  },
];
