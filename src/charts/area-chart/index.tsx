import { useContext, type FC } from "react";
import { theme, Typography } from "antd";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieProps, ReferenceDot } from 'recharts';
import { mockAreaChartData } from "./mockData";
import { ChartContainer } from "../chart-container";
import { ThemeContext } from "../../theme";
import styles from "./index.module.css"

export type BasePieChartProps = Pick<PieProps, "data" | "dataKey"> & {
    colors: string[];
    width?: number;
    height?: number;
    centerText?: string;
    title: string;
    stroke: string;
    fill: string;
};

export const BaseAreaChart: FC<BasePieChartProps> = ({
    title,
    colors = [],
    data = [],
    dataKey,
    width,
    height,
    centerText,
    stroke,
    fill
  }) => {
    const { appTheme } = useContext(ThemeContext);
    const darkTheme = appTheme === "dark";

    return (
    <ChartContainer
        className={`${darkTheme ? styles.darkBg : styles.lightBg}`}
        title={title}
        // tooltipText={tooltipText}
        // dataTestId={dataTestId}
        extraAddon={<Typography.Text>00:20:78</Typography.Text>}
    >
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={width}
          height={height}
          data={mockAreaChartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis/>
            <Tooltip />
            <Area
                type="linear"
                dot={true}
                dataKey="uv"
                stroke={stroke}
                fill={fill}
            />
        </AreaChart>
      </ResponsiveContainer>
      </ChartContainer>
    )
}