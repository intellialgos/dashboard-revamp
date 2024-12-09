import type { FC } from "react";

import { BasePieChart } from "../../charts/base-pie-chart";
import {
  ChartContainer,
  type ChartContainerProps,
} from "../../charts/chart-container";
import { PieGraphDataType } from "../../types/graph-data";
import { LoadingOutlined } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import styles from "./index.module.css";

type Props = Pick<
  ChartContainerProps,
  "title" | "tooltipText" | "className" | "dataTestId"
> & {
  centerText?: string;
  data?: PieGraphDataType[];
  isLoading?: boolean;
  colors?: string[];
};

export const AlertsByPriority: FC<Props> = ({
  className,
  title,
  tooltipText,
  dataTestId,
  centerText,
  data,
  isLoading,
  colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF"],
}) => {
  return (
    <ChartContainer
      className={className}
      title={title}
      tooltipText={tooltipText}
      dataTestId={dataTestId}
    >

      {(!isLoading && data?.length) === 0 ? (

        <div className={styles.loaderDiv}> <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
      ) : isLoading ? (
        <div className={styles.loaderDiv}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin={true} />}
          />
        </div>
      ) : (
        <BasePieChart
          data={data}
          centerText={centerText}
          colors={colors}
          dataKey="value"
        />
      )}
    </ChartContainer>
  );
};
