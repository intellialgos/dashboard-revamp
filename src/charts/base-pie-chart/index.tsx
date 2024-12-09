import { type FC } from "react";
import { theme } from "antd";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  type PieProps,
  Tooltip,
  Label,
} from "recharts";

import { CustomLegend } from "../custom-legend";
import { CustomTooltip } from "../custom-tooltip";

export type BasePieChartProps = Pick<PieProps, "data" | "dataKey"> & {
  colors: string[];
  width?: number;
  height?: number;
  centerText?: string;
};

export const BasePieChart: FC<BasePieChartProps> = ({
  colors = [],
  data = [],
  dataKey,
  width,
  height,
  centerText,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        dataKey={dataKey}
        stroke={colorBgContainer}
        cornerRadius={5}
        startAngle={90}
        endAngle={480}
        innerRadius={55}
      >
        <>
          <Label
            value={centerText}
            position="center"
            fontSize={30}
            fill="white"
            fontWeight="500"
          />
          {data.map((_entry, index) => {
            const key = `cell-${index}`;

            return <Cell key={key} fill={colors[index % colors.length]} />;
          })}
        </>
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend align="center" content={<CustomLegend />} />
    </PieChart>
  );
};
