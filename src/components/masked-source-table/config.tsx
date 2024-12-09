import { Typography } from "antd";
import type { ColumnType } from "antd/es/table";

import type { AlarmLevel, DeviceEvent } from "../../types/device-event";
import { getFormattedDateTime } from "../../utils/get-formatted-date-time";
import { AlarmLevelTag } from "../alarm-level-tag";

const { Link } = Typography;

type ColumnParams = {
  onProcess: (event: DeviceEvent) => void;
};

export const generateColumns = ({
  onProcess,
}: ColumnParams): ColumnType<DeviceEvent>[] => [
  {
    title: "Site",
    dataIndex: ["site", "name"],
  },
  {
    title: "Contact 1",
    dataIndex: "contact1",
  },
  {
    title: "Contact 2",
    dataIndex: "contact1",
  },
  {
    title: "Key",
    sorter: true,
    dataIndex: ["obj", "key"],
    render: (text) => (
      <span style={{ color: `rgba(92, 219, 29, 1)` }}>{text}</span>
    ),
  },

  {
    title: "Device",
    sorter: true,
    dataIndex: ["obj", "name"],
  },

  {
    title: "Actions",
    dataIndex: "eventId",
    sorter: false,
    width: 130,
    fixed: "right",
    render(_, event) {
      return <Link onClick={() => onProcess(event)}>Recovery</Link>;
    },
  },
];
