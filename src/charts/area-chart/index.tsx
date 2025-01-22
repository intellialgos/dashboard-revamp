import { useContext, useEffect, useState, type FC } from "react";
import { theme, Typography } from "antd";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieProps, ReferenceDot } from 'recharts';
import { mockAreaChartData } from "./mockData";
import { ChartContainer } from "../chart-container";
import { ThemeContext } from "@/theme";
import styles from "./index.module.css"
import { CustomTooltip } from "../custom-tooltip";

type Rectification = {
  name: string;
  rectification_time: string;
}

export type BasePieChartProps = Pick<PieProps, "data" | "dataKey"> & {
    colors: string[];
    width?: number;
    height?: number;
    centerText?: string;
    title: string;
    stroke: string;
    fill: string;
    data: Rectification[];
};

const formatTime = (seconds:number) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const findWithLeastSeconds = (data:any) => {
  if ( data.length > 0 ){
    return data.reduce((minObj, currentObj) => {
      return currentObj.seconds < minObj.seconds ? currentObj : minObj;
    });
  } else {
    return [];
  }
};

export const BaseAreaChart: FC<BasePieChartProps> = ({
    title,
    colors = [],
    dataKey,
    width,
    height,
    centerText,
    stroke,
    fill,
    data
  }) => {
    const { appTheme } = useContext(ThemeContext);
    const darkTheme = appTheme === "dark";
    const filtered_data = data ? data.filter(item => item.seconds > 0 && item.seconds <= 100) : [];

    // useEffect(() => {
    // if ( data ) {
    //     console.log("RECT DATA: ", data.filter(item => item.seconds > 100));
    //   }
    // }, [data])
    return (
    <ChartContainer
        className={`${darkTheme ? styles.darkBg : styles.lightBg}`}
        title={title}
        // tooltipText={tooltipText}
        // dataTestId={dataTestId}
        extraAddon={<Typography.Text type="success" style={{fontWeight: 'bolder'}}>{ filtered_data && findWithLeastSeconds(filtered_data).rectification_time }</Typography.Text>}
    >
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={width}
          height={height}
          data={filtered_data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={"nameSmall"} />
            <YAxis tickFormatter={formatTime} />
            <Tooltip content={<CustomTooltip />} />
            <Area
                type="linear"
                dot={false}
                dataKey="seconds"
                stroke={stroke}
                fill={fill}
            />
        </AreaChart>
      </ResponsiveContainer>
      </ChartContainer>
    )
}