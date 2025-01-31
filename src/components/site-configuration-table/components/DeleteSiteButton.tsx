import { useDeleteSiteMutation, useDeleteUserMutation } from "@/services";
import { User } from "@/types/user";
import { DeleteOutlined } from "@ant-design/icons";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/query";
import { Button, Popconfirm, PopconfirmProps } from "antd";
import useMessage from "antd/es/message/useMessage";

const DeleteSiteButton = ({id, refetch}: {id: string, refetch: MutationTrigger<MutationDefinition<any, any, any, any, any>>}) => {
    
    const [ messageApi, messageContext ] = useMessage();
    const [ deleteSite, { isLoading } ] = useDeleteSiteMutation();
    const confirmDelete: PopconfirmProps['onConfirm'] = async (e) => {
      const response = await deleteSite({siteId: id});
      if ( response && !response?.error ) {
        messageApi.success('Site has been deleted !');
        refetch({});
      }
    };

    return (
      <>
      {messageContext}
      
      <Popconfirm
      title="Delete Site"
      description="Are you sure to delete this site?"
      onConfirm={confirmDelete}
      okText="Yes"
      cancelText="No"
    >
      <Button size="small" type="primary" loading={isLoading} danger><DeleteOutlined /></Button>
    </Popconfirm>
    </>
  )
}

export default DeleteSiteButton;