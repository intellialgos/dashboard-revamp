/* eslint-disable */
import { useEffect, type FC, useState, useContext } from "react";
import { Col, Row } from "antd";

// ICONS
import SuccessRate from '../../assets/successRate.svg?react';
import OpenTickets from '../../assets/openTickets.svg?react';
import ClosedTickets from '../../assets/closedTickets.svg?react';

import { AllAlerts } from "../../components/all-alerts";
import { AlertsByPriority } from "../../widgets/alerts-by-priority";
import { AlertsByType } from "../../widgets/alerts-by-type";
import { AlertsByVendor } from "../../widgets/alerts-by-vendor";
import { AlertsMap } from "../../widgets/alerts-map";
import { TopAlertsBySite } from "../../widgets/top-alerts-by-site";

import styles from "./index.module.css";
import { useGetAllEventsMutation } from "../../services";
import { formatDate, getLastWeekDate } from "../../utils/general-helpers";
import {
  HorizontalBarGraphDataType,
  PieGraphDataType,
} from "../../types/graph-data";
import { DeviceEvent } from "../../types/device-event";
import {
  priorityChartColors,
  siteChartBarColor,
  systemChartColors,
  weeklyAlertChartBarColor,
} from "../../utils/constants";
import { ThemeContext } from "../../theme";
import { AlertsMockData } from "../../utils/mock";
import { StatisticCard } from "../../widgets/statistic-card";
import { BaseAreaChart } from "../../charts/area-chart";

export const Dashboard: FC = () => {
  const [getAllEvents, { isLoading }] = useGetAllEventsMutation();
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
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";

  const date = new Date();

  const setDataIntoStates = (data: DeviceEvent[]) => {
    setTotalWeeklyAlerts(data.length);
    let count = { low: 0, medium: 0, high: 0 };
    let vendors: PieGraphDataType[] = [];
    let sites: HorizontalBarGraphDataType[] = [];
    let weeklyAlerts: HorizontalBarGraphDataType[] = [];

    data.forEach((ev: DeviceEvent) => {
      if (ev.level > 3) {
        count.high = count.high + 1;
      } else if (ev.level < 3) {
        count.low = count.low + 1;
      } else {
        count.medium = count.medium + 1;
      }

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

      const findAlert = weeklyAlerts.find((item) => item.name === ev.obj.value);
      if (!findAlert) {
        weeklyAlerts.push({ name: ev.obj.value, count: 1 });
      } else {
        let newweeklyAlerts = weeklyAlerts.filter(
          (item) => item.name !== ev.obj.value,
        );
        weeklyAlerts = [
          ...newweeklyAlerts,
          { name: ev.obj.value, count: findAlert.count + 1 },
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
      })),
    );
    setAllWeeklyAlerts(
      weeklyAlerts.map((item, ind) => ({
        ...item,
        xAxisValue: Math.ceil((1000 / weeklyAlerts.length) * (ind + 1)),
      })),
    );
  };

  useEffect(() => {
    const body = {
      startTime: formatDate(getLastWeekDate(date)),
      endTime: formatDate(date),
    };
    setDataIntoStates(AlertsMockData);
    (async () => {
      const res = await getAllEvents(body);
      setDataIntoStates(res?.data?.data.event);
    })();
  }, []);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <AlertsMap dataTestId="alerts-map" />
      </Col>

      {/* Statistic Cards */}
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <StatisticCard
              title="Open Tickets"
              icon={<OpenTickets />}
              value={40}
            />
          </Col>
          <Col span={8}>
            <StatisticCard
              title="Closed Tickets"
              icon={<ClosedTickets />}
              value={40}
            />
          </Col>
          <Col span={8}>
            <StatisticCard
              title="Success Rate"
              icon={<SuccessRate />}
              value={'50%'}
            />
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <AlertsByPriority
              title="Total Assets"
              tooltipText="TODO: Add tooltip text"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={totalWeeklyAlerts.toString()}
              data={weeklyAlertsbyPriority}
              isLoading={isLoading}
              colors={priorityChartColors}
            />
          </Col>  
          <Col span={8}>
            <BaseAreaChart
              stroke="#52C41A"
              fill="#52C41A"
              title="Response Time"
            />
          </Col>  
          <Col span={8}>
            <BaseAreaChart
              stroke="#40A9FF"
              fill="#40A9FF"
              title="Recification Time"
            />
          </Col>  
        </Row>
      </Col>

      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <AlertsByPriority
              title="Offline Assets"
              tooltipText="TODO: Add tooltip text"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={totalWeeklyAlerts.toString()}
              data={weeklyAlertsbyPriority}
              isLoading={isLoading}
              colors={priorityChartColors}
            />
          </Col>  
          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 24 Hours"
              tooltipText="TODO: Add tooltip text"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={totalWeeklyAlerts.toString()}
              data={weeklyAlertsbyPriority}
              isLoading={isLoading}
              colors={priorityChartColors}
            />
          </Col>  
          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 7 Days"
              tooltipText="TODO: Add tooltip text"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={totalWeeklyAlerts.toString()}
              data={weeklyAlertsbyPriority}
              isLoading={isLoading}
              colors={priorityChartColors}
            />
          </Col>  
          <Col span={6}>
            <AlertsByPriority
              title="Offline In the past 30 Days"
              tooltipText="TODO: Add tooltip text"
              className={`${styles.widget} ${
                darkTheme ? styles.widget_bg : styles.widget_bg_light
              }`}
              dataTestId="weekly-priority-alerts-chart"
              centerText={totalWeeklyAlerts.toString()}
              data={weeklyAlertsbyPriority}
              isLoading={isLoading}
              colors={priorityChartColors}
            />
          </Col>  
        </Row>
      </Col>

      <Col span={6}>
        <TopAlertsBySite
          title="All Weekly Alerts"
          tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="all-weekly-alerts"
          color={weeklyAlertChartBarColor}
          data={allWeeklyAlerts}
          isLoading={isLoading}
        />
      </Col>
      <Col span={6}>
        <AlertsByPriority
          title="Weekly Alerts by Priority"
          tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-priority-alerts-chart"
          centerText={totalWeeklyAlerts.toString()}
          data={weeklyAlertsbyPriority}
          isLoading={isLoading}
          colors={priorityChartColors}
        />
      </Col>
      <Col span={6}>
        <AlertsByPriority
          title="Weekly Alerts by System"
          tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="weekly-alerts-by-system"
          centerText={totalWeeklyAlerts.toString()}
          data={weeklyAlertsbySystem}
          isLoading={isLoading}
          colors={
            weeklyAlertsbySystem.length <= systemChartColors.length
              ? systemChartColors
              : systemChartColors
          }
        />
        {/* <AlertsByVendor
          title="Weekly Alerts by Vendor"
          tooltipText="TODO: Add tooltip text"
          className={styles.widget}
          dataTestId="weekly-alerts-by-vendor"
        /> */}
      </Col>
      <Col span={6}>
        <TopAlertsBySite
          title="Top 10 Weekly Alerts by Site"
          tooltipText="TODO: Add tooltip text"
          className={`${styles.widget} ${
            darkTheme ? styles.widget_bg : styles.widget_bg_light
          }`}
          dataTestId="top-10-alerts-by-site-chart"
          color={siteChartBarColor}
          data={weeklyTopAlertsBySite}
          isLoading={isLoading}
        />
      </Col>

      <Col span={24}>
        <AllAlerts />
      </Col>
    </Row>
  );
};
