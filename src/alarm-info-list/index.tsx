import { type FC, useMemo } from "react";
import { Space, Tag } from "antd";

import { AlarmLevelTag } from "../components/alarm-level-tag";
import { DescriptionList, type DescriptionListItem } from "../description-list";
import type { DeviceEvent } from "../types/device-event";
import { getFormattedDateTime } from "../utils/get-formatted-date-time";

type Props = {
  event: DeviceEvent;
  className?: string;
  dataTestId?: string;
};

export const AlarmInfoList: FC<Props> = ({ event, className, dataTestId }) => {
  const items = useMemo<DescriptionListItem[]>(
    () => [
      { label: "System", value: event.vendor },
      { label: "Event ID", value: event.eventId },
      { label: "Object", value: event.obj.name },
      { label: "Priority", value: <AlarmLevelTag level={event.level} /> },
      {
        label: "Type",
        value: (
          <Space size="small">
            {event.obj.key}
            <Tag>Mask</Tag>
          </Space>
        ),
      },
      { label: "Value", value: event.obj.value },
      { label: "Event Time", value: getFormattedDateTime(event.timeEvent) },
      { label: "Server Time", value: getFormattedDateTime(event.timeServer) },
      { label: "Description", value: event.obj.desc || "N/A" },
    ],
    [event],
  );

  return (
    <DescriptionList
      className={className}
      title="Alarm Info"
      items={items}
      dataTestId={dataTestId}
    />
  );
};
