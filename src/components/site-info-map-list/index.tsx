import { type FC, useMemo } from "react";

import { DescriptionList, DescriptionListItem } from "../../description-list";
import { DeviceEvent } from "../../types/device-event";
import { Card, Space, Tag } from "antd";
import {
  CheckCircleOutlined,
  ContactsOutlined,
  MailOutlined,
} from "@ant-design/icons";

type Props = {
  site: DeviceEvent["site"];
  className?: string;
  dataTestId?: string;
};

export const SiteInfoListMap: FC<Props> = ({
  site,
  className,
  dataTestId,
  data,
}) => {
  // TODO: Get rest info from BE
  const items = useMemo<DescriptionListItem[]>(
    () => [
      {
        label: "Site Status",
        value: (
          <Space size="small">
            {/* {event.obj.key} */}
            <Tag className="site-info-tag" icon={<CheckCircleOutlined />}>
              Connected
            </Tag>
          </Space>
        ),
      },
      {
        label: "Subscription Status",
        value: (
          <Space size="small">
            {/* {event.obj.key} */}
            <Tag>Active</Tag>
          </Space>
        ),
      },
      { label: "Site ID", value: "01900040" },
      { label: "Site Name", value: "Dubai Mall" },
      { label: "Site Address", value: "Downtown Dubai - Dubai" },
      { label: "Reclear", value: "N/A" },
      { label: "Start Date and Time", value: "23 Aug 2023 12:00 PM" },
      { label: "End Date and Time", value: "06 Sep 2023 12:00 AM" },
    ],
    [],
  );
  return (
    <>
      <DescriptionList
        className={className}
        title="Site Info"
        items={items}
        dataTestId={dataTestId}
      />

      <ContactCard index={1} />

      <ContactCard index={2} />
    </>
  );
};

const ContactCard = ({ index }: { index: number }) => {
  return (
    <>
      <p style={{ color: `rgba(255, 255, 255, 0.45)`, margin: 0 }}>
        Contact {index}
      </p>
      <Card className="contact_card">
        <p>Samvel Nazaryan</p>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <ContactsOutlined />
          +971 58 1000 000
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <MailOutlined />
          s.nazaryan@convergint.com
        </div>
      </Card>
    </>
  );
};
