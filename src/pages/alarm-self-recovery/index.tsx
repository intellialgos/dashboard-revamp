import { Button, Col, Row } from "antd";
import { type FC,useContext } from "react";
import { Breadcrumbs } from "@/breadcrumbs";
import styles from "./index.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import { APP_DATE_TIME_FORMAT } from "@/const/common";
import { AlarmSelfRecoveryTable } from "@/components/alarm-self-recovery-table";
import { ThemeContext } from "@/theme";

export const AlarmSelfRecovery: FC = () => {
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Breadcrumbs />
      </Col>
      <Col span={24}><AlarmSelfRecoveryTable className={`${darkTheme ? "alerts_table":""}`}/></Col>
    </Row>
  );
};
