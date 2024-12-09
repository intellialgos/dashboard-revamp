import { Col, Row } from "antd";
import  { type FC,useContext } from "react";
import { ThemeContext } from "../../theme";
import { UsersTable } from "./components/UsersTable";


export const Users: FC = () => {
    const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <UsersTable className={`${darkTheme ? "alerts_table" :"" }`}/>
      </Col>
    </Row>
  );
};