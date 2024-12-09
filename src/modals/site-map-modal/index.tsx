import { Drawer, Form, Input, Space, Switch, Typography } from "antd";
import { type FC,useContext } from "react";

import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { ProcessStatus } from "../../types/device-event";

import Search from "antd/es/input/Search";
import { ThemeContext } from "../../theme";
import { BaseSelect } from "../../components/base-select";
import { getMultipleSelectProps } from "../../utils/form-helpers/get-multiple-select-props";
import styles from './index.module.css'
import { SiteMapTable } from "../../components/site-map-table";

type Props = {
  dataTestId?: string;
  collapse: boolean;
  onClick: (collapsed: boolean) => void;
};

type Fields = {
  processStatus: ProcessStatus;
  remarks: string;
  caseNumber: string;
};



const { Item } = Form;


export const SiteInfoModal: FC<Props> = ({ dataTestId, collapse, onClick }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<Fields>();
  const show = collapse;
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const handleClose = () => {
    // dispatch(setShowSiteInfoModal(false));
    // dispatch(setSelectedEvents([]));

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
        <Item
          // label="Device"
          name="device"
          getValueProps={getMultipleSelectProps}
          // className="select_site"
          className={`${darkTheme ? "select_site" : ""}`}
        >
          <BaseSelect
            mode="multiple"
            placeholder="Select Site"
            allowClear={true}
            // className="select_input"
            className={`${darkTheme ? "select_input" : ""}`}
            
            // style={{height:"32px"}}
          />
        </Item>
        
        <Search
          role="search"
          size="large"
          placeholder="Search"
          allowClear={true}
          title="Enter the keyword and press Enter"
          maxLength={255}
          // onSearch={debouncedResults}
          // onChange={debouncedResults}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          // defaultValue={initialValue}
          className={`${darkTheme ? "search_input_site" : "search_input_light"}`}
        />
        <div  className={styles.switch}>
          <Typography>Show only Disconnected Sites</Typography>
          <Switch defaultChecked className={styles.switchbtn} />
        </div>
        <SiteMapTable className={`${darkTheme ? "alerts_table" : ""}`}/>
      </Drawer>
    </>
  );
};
