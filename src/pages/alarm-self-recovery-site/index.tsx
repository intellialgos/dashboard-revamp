import { Button, Col, Row ,DatePicker} from "antd";
import  {type FC,useContext, useState } from "react";
import { Breadcrumbs } from "@/breadcrumbs";
import { AllAlertsMap } from "@/components/all-alert-map";
import { AlarmSelfRecoverySiteTable } from "@/components/alarm-self-recovery-site-table";
import { ThemeContext } from "@/theme";
import { SearchOutlined } from "@ant-design/icons";
import { APP_DATE_TIME_FORMAT } from "@/const/common";
import styles from './index.module.css'
import { useQueryEventsMutation } from "@/services";

const { RangePicker } = DatePicker;


export const AlarmSelfRecoverySite: FC = () => {
  const { appTheme } = useContext(ThemeContext);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const handlePageChange = (page: number, pageSize: number) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  const darkTheme = appTheme === "dark";
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Breadcrumbs />
      </Col>
      <Col span={24}>
        <AlarmSelfRecoverySiteTable
          className={`${darkTheme ? "alerts_table" :"" }`}
          pageIndex={pageIndex}
          pageSize={pageSize}
          handlePageChange={handlePageChange}
        />
      </Col>
    </Row>
  );
};
