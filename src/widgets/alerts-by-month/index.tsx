import type { FC } from "react";
import { Bar, Legend, Tooltip, XAxis, YAxis } from "recharts";

import { BaseBarChart } from "@/charts/base-bar-chart";
import {
  ChartContainer,
  ChartContainerProps,
} from "@/charts/chart-container";
import { Empty, Spin, theme } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import { CustomTooltip } from "@/charts/custom-tooltip";


type Props = Pick<
  ChartContainerProps,
  "title" | "tooltipText" | "className" | "dataTestId"
> & {
  centerText?: string;
  data?: any[];
  isLoading?: boolean;
  colors?: string[];
};

const COLORS = ["#5CDB1D", "#FBB62D", "#F63A44"];

export const AlertsByMonth: FC<Props> = ({
  className,
  title,
  tooltipText,
  dataTestId,
  data,
  isLoading,
}) => {

  const {
    token: { colorBgElevated, boxShadowSecondary, borderRadiusSM, paddingXS },
  } = theme.useToken();

  return (
    <ChartContainer
      className={className}
      title={title}
      tooltipText={tooltipText}
      dataTestId={dataTestId}
    >
      {(!isLoading && data?.length) === 0 ? (
        <div className={styles.loaderDiv}>
          {" "}
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : isLoading ? (
        <div className={styles.loaderDiv}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin={true} />}
          />
        </div>
      ) : (
        <BaseBarChart
          data={data}
          barSize={20}
        >
          <XAxis
            // interval={0}
            dataKey="name"
            // angle={0}
            // minTickGap={-300}
            // axisLine={false}
          />
          <YAxis />
          <Legend
            formatter={(value) => {
              // const total = data.reduce((sum, item) => sum + (item[value] || 0), 0);
              return `${value}`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colorBgElevated,
              border: 0,
              padding: paddingXS,
              boxShadow: boxShadowSecondary,
              borderRadius: borderRadiusSM,
            }}
            formatter={(value, name) => [`${value}`, name]}
          />

          <Bar dataKey="low" stackId="a" fill={COLORS[0]} />
          <Bar dataKey="medium" stackId="a" fill={COLORS[1]} />
          <Bar dataKey="high" stackId="a" fill={COLORS[2]} />
        </BaseBarChart>
      )}
    </ChartContainer>
  );
};
