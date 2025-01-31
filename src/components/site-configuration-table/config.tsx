import { Button, Space, Tag } from "antd";
import type { ColumnType } from "antd/es/table";

import type { OrganisationSite } from "@/types/organisation";
import { DeleteOutlined, FolderFilled, HomeFilled, PoweroffOutlined, VideoCameraFilled } from "@ant-design/icons";
import DeleteSiteButton from "./components/DeleteSiteButton";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setGroupObject, setOrgObject, setSelectedSite, setShowEditGroupDrawer, setShowEditOrgDrawer, setShowEditSiteDrawer } from "@/store/slices/sites";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/query";

type ColumnParams = {
  onDelete: ({id, name, type}: {id: string, name: string, type: "organization"|"site"}) => void;
  onEdit: (event: any) => void;
  record: any;
  refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>>
};

const SitesActions: React.FC<any> = ({
  onEdit,
  onDelete,
  refetch,
  record
}: ColumnParams) => {

  const dispatch = useAppDispatch();

  const editSite = (record: any) => {
    dispatch(setShowEditSiteDrawer(true));
    dispatch(setSelectedSite(record.id));
  }

  const editOrg = (record: any) => {
    dispatch(setShowEditOrgDrawer(true));
    dispatch(setOrgObject(record));
  }
  const editGroup = (record: any) => {
    dispatch(setShowEditGroupDrawer(true));
    dispatch(setGroupObject(record));
  }

  if ( record?.isSite ) {
    return <Space>
    <Button
      size="small"
      onClick={() => editSite(record)}
    >Edit Site</Button>
    <DeleteSiteButton refetch={refetch} id={record.id} />
  </Space>
  } else if ( record?.isGroup ) {
    return <Space>
    <Button
      size="small"
      onClick={() => editGroup(record)}
    >Edit Group</Button>
    {
      !record?.children &&
      <Button
        type="primary"
        size="small"
        danger
        onClick={() => onDelete}
      ><DeleteOutlined /></Button>
    }
  </Space>
  } else if ( record?.isOrganisation ) {
    return <Space>
    <Button
      size="small"
      onClick={() => editOrg(record)}
    >Edit Organizatiom</Button>
    {
      !record?.children &&
      <Button
        type="primary"
        size="small"
        danger
        onClick={() => onDelete}
      ><DeleteOutlined /></Button>
    }
  </Space>
  }
}

const Icon: React.FC<any> = ({record}: {record: any}) => {
  if ( record?.isSite ) {
    return <VideoCameraFilled style={{color: record?.status ? "#49aa19" : "#dc4446"}} />
  } else if (record?.isGroup) {
    return <FolderFilled />;
  } else if (record?.isOrganisation) {
    return <HomeFilled />
  }
}

export const generateColumns = ({
  onDelete,
  onEdit,
  refetch
}: ColumnParams): ColumnType<OrganisationSite>[] => [
  {
    title: "Name",
    dataIndex: "name",
    width: 300,
    render: (value, record) => <Space><Icon record={record} /> {value}</Space>
  },
  {
    title: "Id",
    dataIndex: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (value, record) => (record?.isSite) && <Tag color={value ? "green-inverse" : "error"}> <PoweroffOutlined /> { value ? "Online" : "Offline" } </Tag>
  },
  {
    title: "Box Type",
    dataIndex: "boxType",
    render: (value, record) => record?.isSite && <Tag color={(value == 1) ? "orange" : "cyan"}> { (value == 1) ? "Lite Version" : "Standard Version" } </Tag>
  },
  {
    title: "Actions",
    dataIndex: "",
    fixed: "right",
    render: (_, record) => <SitesActions refetch={refetch} record={record} />
  },
];
