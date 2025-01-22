import { Col, Row } from "antd";
import  { type FC,useContext } from "react";
import { ThemeContext } from "@/theme";
import { DisconnectedSitesTable } from "@/components/disconnected-sites-table";


export const DisconnectedSites: FC = () => {
    const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <DisconnectedSitesTable className={`${darkTheme ? "alerts_table" :"" }`}/>
      </Col>
    </Row>
  );
};