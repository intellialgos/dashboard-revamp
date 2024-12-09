import { Col, Row } from "antd";
import  { type FC,useContext } from "react";
import { MaskedSourceTable } from "../../components/masked-source-table";
import { ThemeContext } from "../../theme";


export const MaskedSource: FC = () => {
    const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <MaskedSourceTable className={`${darkTheme ? "alerts_table" :"" }`}/>
      </Col>
    </Row>
  );
};