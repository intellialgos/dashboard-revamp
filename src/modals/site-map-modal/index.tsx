import { Drawer, Form, Input, Space, Switch, Typography } from "antd";
import { type FC,useContext, useState } from "react";

import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { ProcessStatus } from "@/types/device-event";

import Search from "antd/es/input/Search";
import { ThemeContext } from "@/theme";
import { BaseSelect } from "@/components/base-select";
import { getMultipleSelectProps } from "@/utils/form-helpers/get-multiple-select-props";
import styles from './index.module.css'
import { SiteMapTable } from "@/components/site-map-table";
import { OrganisationSite } from "@/types/organisation";

type Props = {
  dataTestId?: string;
  collapse: boolean;
  sites: OrganisationSite[];
  onClick: (collapsed: boolean) => void;
};

type Fields = {
  processStatus: ProcessStatus;
  remarks: string;
  caseNumber: string;
};



const { Item } = Form;


export const SiteInfoModal: FC<Props> = ({ sites, dataTestId, collapse, onClick }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<Fields>();
  const show = collapse;
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [showOnlyDisconnected, setShowOnlyDisconnected] = useState(false);

  const handleClose = () => {
    onClick(!collapse);
  };

  return (
    <>
      <Drawer
        open={show}
        width={640}
        title="Site Map"
        destroyOnClose={true}
        onClose={handleClose}
        data-testid={dataTestId}
        // style={{ background: " #0C183B" }}
        className={`${darkTheme ? "modal_bg_dark" : ""}`}
      > 
        <Form

        >
          <Form.Item
            name={'search'}
            rules={[ { required: true, message: "Enter search query" } ]}
          >
            <Input.Search
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              role="search"
              size="large"
              placeholder="Search"
              allowClear={true}
              title="Enter the keyword and press Enter"
              maxLength={255}
              className={`${darkTheme ? "search_input_site" : "search_input_light"}`}
            />
          </Form.Item>
        </Form>
        <div  className={styles.switch}>
          <Typography>Show only Disconnected Sites</Typography>
          <Switch defaultChecked={showOnlyDisconnected} onChange={setShowOnlyDisconnected} className={styles.switchbtn} />
        </div>
        <SiteMapTable
          sites={showOnlyDisconnected ? sites.filter(item => item.connectionState == false) : sites}
          className={`${darkTheme ? "alerts_table" : ""}`}
        />
      </Drawer>
    </>
  );
};
