import { useState, useEffect, type FC, useContext } from "react";
import { Col, Row } from "antd";

// ICONS
import SuccessRate from '@/assets/successRate.svg?react';
import OpenTickets from '@/assets/openTickets.svg?react';
import ClosedTickets from '@/assets/closedTickets.svg?react';

import { AlertsByMonth } from "@/widgets/alerts-by-month";
import { AlertsByPriority } from "@/widgets/alerts-by-priority";
import { AlertsByType, TopAlertsByType } from "@/widgets/alerts-by-type";
import { TopAlertsBySite } from "@/widgets/top-alerts-by-site";

import styles from "./index.module.css";
import { useGetAssetsStatisticsMutation, useQueryEventsMutation } from "@/services";
import {
  formatDate,
  getCurrentYear,
  getLastWeekDate,
} from "@/utils/general-helpers";
import { DeviceEvent } from "@/types/device-event";
import {
  HorizontalBarGraphDataType,
  PieGraphDataType,
} from "@/types/graph-data";
import {
  dangerChartColors,
  priorityChartColors,
  siteChartBarColor,
  systemChartColors,
  weeklyAlertChartBarColor,
} from "@/utils/constants";
import { ThemeContext } from "@/theme";
import { AlertsMockData } from "@/utils/mock";
import { StatisticCard } from "@/widgets/statistic-card";
import { BaseAreaChart } from "@/charts/area-chart";
import { getAlarmLevelName } from "@/utils/get-alarm-level-name";
import { setAllEvents } from "@/store/slices/events";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { Form } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store";
import { setFilters } from "@/store/slices/filters";

export const AlarmRecordCharts: FC = () => {
  const dispatch = useAppDispatch();
  const [weeklyAlertsbyPriority, setWeeklyAlertsbyPriority] = useState<
    PieGraphDataType[]
  >([]);
  const [weeklyAlertsbySystem, setWeeklyAlertsbySystem] = useState<
    PieGraphDataType[]
  >([]);
  const [weeklyTopAlertsBySite, setWeeklyTopAlertsBySite] = useState<
    HorizontalBarGraphDataType[]
  >([]);
  const [allWeeklyAlerts, setAllWeeklyAlerts] = useState<
    HorizontalBarGraphDataType[]
  >([]);

  const [totalWeeklyAlerts, setTotalWeeklyAlerts] = useState<Number>(0);

  const [ selectedSite, setSelectedSite ] = useState<string|null>(null);
  const [ startDate, setStartDate ] = useState<string|null>();
  const [ endDate, setEndDate ] = useState<string|null>();

  const [getAssetsStatistics, { data: dashboardStatistics, isLoading: dashboardLoading }] = useGetAssetsStatisticsMutation();

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const setDataIntoStates = (data: DeviceEvent[]) => {
    setTotalWeeklyAlerts(data.length);
    let count = {
      low: 0,
      medium: 0,
      high: 0,
    };
    let vendors: PieGraphDataType[] = [];
    let sites: HorizontalBarGraphDataType[] = [];
    let weeklyAlerts: HorizontalBarGraphDataType[] = [];

    data.forEach((ev: DeviceEvent) => {

      // Priority
      const alarmLevel = getAlarmLevelName(ev.level);
      count[alarmLevel]++;

      // Vendors
      const findVendor = vendors.find((item) => item.name === ev.vendor);
      if (!findVendor) {
        vendors.push({ name: ev.vendor, value: 1 });
      } else {
        let newVendors = vendors.filter((item) => item.name !== ev.vendor);
        vendors = [
          ...newVendors,
          { name: ev.vendor, value: findVendor.value + 1 },
        ];
      }

      // Sites
      const findSite = sites.find((item) => item.name === ev.site.name);
      if (!findSite) {
        sites.push({ name: ev.site.name, count: 1 });
      } else {
        let newsites = sites.filter((item) => item.name !== ev.site.name);
        sites = [
          ...newsites,
          { name: ev.site.name, count: findSite.count + 1 },
        ];
      }

      const findAlert = weeklyAlerts.find((item) => item.name === ev.obj.key);
      if (!findAlert) {
        weeklyAlerts.push({ name: ev.obj.key, count: 1 });
      } else {
        let newweeklyAlerts = weeklyAlerts.filter(
          (item) => item.name !== ev.obj.key,
        );
        weeklyAlerts = [
          ...newweeklyAlerts,
          { name: ev.obj.key, count: findAlert.count + 1 },
        ];
      }
    });
    setWeeklyAlertsbyPriority([
      { name: "Low", value: count.low },
      { name: "Medium", value: count.medium },
      { name: "High", value: count.high },
    ]);
    setWeeklyAlertsbySystem(vendors);
    setWeeklyTopAlertsBySite(
      sites.map((item, ind) => ({
        ...item,
        xAxisValue: Math.ceil((1000 / sites.length) * (ind + 1)),
      })).sort((a, b) => b.count - a.count)
    );
    setAllWeeklyAlerts(
      weeklyAlerts.map((item, ind) => ({
        ...item,
        xAxisValue: Math.ceil((1000 / weeklyAlerts.length) * (ind + 1)),
      })).sort((a, b) => b.count - a.count),
    );
    dispatch(setAllEvents(data));
  };
  
  const filters = useSelector((state: RootState) => state.filters);

  useEffect(() => {
    (async () => {
      await getAssetsStatistics({
        ...filters,
        ...{startTime: formatDate(getLastWeekDate(new Date()))},
        ...{endTime: formatDate(new Date())},
        ...( selectedSite ? {sites: [selectedSite]} : {} ),
      });
    })()
  }, [selectedSite, filters]
  )

  useEffect(() => {
    dispatch(setFilters({
      ...filters,
      startTime: formatDate(getLastWeekDate(new Date())),
      endTime: formatDate(new Date())
    }));
  }, []);
  
  useEffect(() => {
    if ( dashboardStatistics ) {
      setDataIntoStates(dashboardStatistics?.allAlerts);
    }
  }, [dashboardStatistics]);

  const successRateColor = (rate: number) => {
    if ( rate <= 40 ) {
      return "red";
    } else if ( rate > 40 && rate <= 75 ) {
      return "orange";
    } else {
      return "green";
    }
  }

  return (
    <Row gutter={[24, 24]}>
      {/* Statistic Cards */}
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <StatisticCard
              title="Open Tickets"
              loading={dashboardLoading}
              icon={<OpenTickets />}
              value={dashboardStatistics?.openAlarmsCount ? dashboardStatistics?.openAlarmsCount : 0}
            />
          </Col>
          <Col span={8}>
            <StatisticCard
              title="Closed Tickets"
              loading={dashboardLoading}
              icon={<ClosedTickets />}
              value={dashboardStatistics?.closedAlarmsCount ? dashboardStatistics?.closedAlarmsCount : 0}
            />
          </Col>
          <Col span={8}>
            <StatisticCard
              title="Success Rate"
              loading={dashboardLoading}
              icon={<SuccessRate />}
              value={`${(dashboardStatistics?.successRate) ? dashboardStatistics?.successRate.toFixed(2)+"%" : 0}`}
              color={successRateColor(dashboardStatistics?.successRate)}
            />
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <AlertsByPriority
              title="Total Assets"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={dashboardStatistics?.totalAssets.length}
              data={dashboardStatistics?.totalAssets.map((item:any) => ({ value: item.count, name: item.name })) || []}
              isLoading={dashboardLoading}
              legend={false}
              colors={priorityChartColors}
            />
          </Col>  
          <Col span={8}>
            <BaseAreaChart
              stroke="#52C41A"
              fill="#52C41A"
              title="Top 10 Response Time"
              data={dashboardStatistics?.response_time}
            />
          </Col>  
          <Col span={8}>
            <BaseAreaChart
              stroke="#40A9FF"
              fill="#40A9FF"
              title="Top 10 Recification Time"
              data={dashboardStatistics?.rectifications}
            />
          </Col>  
        </Row>
      </Col>

      {/* Offline Assets */}
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <AlertsByPriority
              title="Offline Assets In the past 90 Days"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={dashboardStatistics?.notResponding90DaysAgo.length.toString()}
              data={dashboardStatistics?.notResponding90DaysAgo.map((item:any) => ({ value: item.count, name: item.name })) || []}
              isLoading={dashboardLoading}
              legend={false}
              colors={dangerChartColors}
            />
          </Col>
          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 30 Days"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={dashboardStatistics?.notResponding30DaysAgo.length}
              data={dashboardStatistics?.notResponding30DaysAgo.map((item:any) => ({ value: item.count, name: item.name })) || []}
              isLoading={dashboardLoading}
              legend={false}
              colors={dangerChartColors}
            />
          </Col>
          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 7 Days"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={dashboardStatistics?.notResponding7DaysAgo.length.toString()}
              data={dashboardStatistics?.notResponding7DaysAgo.map((item:any) => ({ value: item.count, name: item.name })) || []}
              isLoading={dashboardLoading}
              legend={false}
              colors={dangerChartColors}
            />
          </Col> 
          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 24 Hours"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={dashboardStatistics?.notResponding24HourAgo.length.toString()}
              data={dashboardStatistics?.notResponding24HourAgo.map((item:any) => ({ value: item.count, name: item.name })) || []}
              isLoading={dashboardLoading}
              legend={false}
              colors={dangerChartColors}
            />
          </Col>
        </Row>
      </Col>

      <Col span={8}>
        <TopAlertsBySite
          title="Weekly Alerts By Event Type"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="all-weekly-alerts"
          color={weeklyAlertChartBarColor}
          data={allWeeklyAlerts}
          isLoading={dashboardLoading}
        />
      </Col>
      <Col span={8}>
        <AlertsByPriority
          title="Weekly Alerts by Priority"
          // tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-priority-alerts-chart"
          centerText={totalWeeklyAlerts.toString()}
          data={weeklyAlertsbyPriority}
          isLoading={dashboardLoading}
          colors={priorityChartColors}
        />
      </Col>
      
      <Col span={8}>
        <AlertsByMonth
          title="Alerts by Month"
          // tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-alerts-by-month"
          data={dashboardStatistics?.allAlertsByMonths}
          isLoading={dashboardLoading}
        />
        {/* <AlertsByPriority
          title="Weekly Alerts by System"
          // tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-alerts-by-system"
          centerText={totalWeeklyAlerts.toString()}
          data={weeklyAlertsbySystem}
          isLoading={dashboardLoading}
          colors={
            weeklyAlertsbySystem.length <= systemChartColors.length
              ? systemChartColors
              : systemChartColors
          }
        /> */}
      </Col>
      <Col span={24}>
        <TopAlertsBySite
          title="Top 10 Weekly Alerts by Site"
          // tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="top-10-alerts-by-site-chart"
          color={siteChartBarColor}
          data={weeklyTopAlertsBySite}
          isLoading={dashboardLoading}
        />
      </Col>
      {/* <Col span={24}>
      <AlertsByMonth
          title="Alerts by Devices"
          // tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-alerts-by-devices"
          data={allWeeklyAlerts}
          isLoading={dashboardLoading}
        />
      </Col> */}
    </Row>
  );
};
