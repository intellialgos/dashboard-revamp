import { type FC, useState, useEffect, useMemo, useContext } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircleOutlined,
  FilterOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";

import { AlertsSearchFilterDrawer } from "@/modals/alerts-search-filter-drawer";
import {
  clearAllEvents,
  setAllEvents,
  setEvents,
  setGlobalPageSize,
  setSelectedEventsId,
  setShowEventsFilterModal,
  setTotalAlertsGlobal,
} from "@/store/slices/events";

import { AllAlertsTable } from "../all-alerts-table";
import {
  formatDate,
  getLastWeekDate,
  getTodayDate,
} from "@/utils/general-helpers";

import styles from "./index.module.css";

import { DeviceEvent, ReqDeviceEvent } from "@/types/device-event";

import {
  useQueryEventsMutation,
  useProcessEventMutation,
  api,
  useGetAssetsStatisticsMutation,
} from "@/services";
import debouce from "lodash.debounce";
import { useAppSelector } from "@/hooks/use-app-selector";
import {
  getEvents,
  getGlobalPageSize,
  getSelectedRowIds,
  getTotalAlerts,
} from "@/store/selectors/events";
import { ThemeContext } from "@/theme";
import { RootState } from "@/types/store";
import { getFiltersState } from "@/store/selectors/filters";

type Fields = {
  search: string;
};

const initialValues: Fields = {
  search: "",
};

const { Title } = Typography;
const { Item } = Form;
const { Search } = Input;

export const AllAlerts: FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<Fields>();
  const [getAllEvents, { isLoading }] = useQueryEventsMutation();
  const [handleProcessEvents, {}] = useProcessEventMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const [filter, setFilter] = useState<string | "">(""); //search handler state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [clearAll, setClearAll] = useState<boolean>(false);

  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [itemLevels, setItemLevels] = useState<any[]>([]);
  const [render, setRender] = useState<boolean>(false);
  const selectedIds = useAppSelector(getSelectedRowIds);

  useEffect(() => {
    if (selectedIds.length !== 0) {
      setClearAll(true);
    } else {
      setClearAll(false);
    }
  }, [selectedIds]);

  const handleFilterClick = () => {
    dispatch(setShowEventsFilterModal(true));
  };

  const handlePageFilterDate = (
    startD: string,
    endD: string,
    data: number[],
    // sites?: string[]
  ) => {
    setRender(true);
    if (startD !== undefined) {
      setStartDate(startD);
    }
    if (endD !== undefined) {
      setEndDate(endD);
    }
    if (data.length !== 0 && data !== undefined) {
      const finalResult = {
        ...itemLevels,
        ...data,
      };
      const FilteredData = finalResult;
      const allSelectedItems = [].concat(...Object.values(FilteredData));
      setItemLevels(allSelectedItems);
      console.log("allSelectedItems", allSelectedItems);
    } else {
      setItemLevels([]);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };
  const handleChange = (e: any) => {
    setRender(true);
    if (
      e.target.value !== null ||
      e.target.value !== undefined ||
      e.target.value !== ""
    ) {
      setFilter(e.target.value);
    } else {
      setFilter("");
    }
  };
  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300);
  }, []);
  
  const filters = useSelector((state: RootState) => state.filters);
  const { totalAlerts } = useSelector((state: RootState) => state.events);
  const [getAssetsStatistics, { data: dashboardStatistics, isLoading: dashboardLoading }] = useGetAssetsStatisticsMutation();
  
    useEffect(() => {
      (async () => {
        await getAssetsStatistics({
          ...filters,
        });
      })()
  }, [filters]);

  const ClearAllEvents = async () => {
      const event: Array<number> = selectedIds;
      const body: any = {
        event,
        processStatus: 2,
      };
      if ( selectedIds.length > 0 ) {
        const res = await handleProcessEvents(body);
        if (res) {
          if (res.data) {
            getAssetsStatistics({
              ...filters,
            });
            messageApi.open({
              type: "success",
              content: "Process status updated",
            });
          } else {
            messageApi.open({
              type: "error",
              content: "Process status update failed",
            });
          }
        }
      } else {
        messageApi.open({
          type: "error",
          content: "Check the alarms you want to clear first",
        });
      }
    };
    
  const setDataIntoStates = (data: DeviceEvent[]) => {
      dispatch(setAllEvents(data));
    };

  useEffect(() => {
    if ( dashboardStatistics ) {
      setDataIntoStates(dashboardStatistics?.allAlerts);
    }
    if ( dashboardStatistics ) {
      console.log(dashboardStatistics);
    }
  }, [dashboardStatistics]);

  return (
    <>
      {contextHolder}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <header className={styles.header}>
            <Title level={4}>All Alerts — {totalAlerts}</Title>

            <Space size="middle" align="center">
              {/* <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                name="all-alerts-search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-testid="all-alerts-search-form"
              >
                <Item<Fields> name="search" noStyle={true}>
                  <Search
                    placeholder="Search"
                    allowClear={true}
                    onChange={debouncedResults}
                    className={`${
                      darkTheme ? "search_input" : "search_input_light"
                    }`}
                  />
                </Item>
              </Form> */}

              <Button
                className={`filter_btn ${darkTheme ? "filter_btn_bg":""}`}
                icon={<FilterOutlined />}
                onClick={handleFilterClick}
              >
                Filter
              </Button>
              <Button
                className={`filter_btn ${darkTheme ? "filter_btn_bg":""}`}

                
                icon={<CheckCircleOutlined />}
                disabled={!clearAll || isLoading}
                onClick={() => ClearAllEvents()}
              >
                Clear All
              </Button>
            </Space>
          </header>
        </Col>

        <Col span={24}>
          <AllAlertsTable
            refetch={getAssetsStatistics}
            dataTestId="all-alerts-table"
            pageIndex={pageIndex}
            pageSize={pageSize}
            handlePageChange={handlePageChange}
            loading={dashboardLoading}
            className={`${darkTheme ? "alerts_table" :"" }`}
          />
        </Col>
      </Row>

      <AlertsSearchFilterDrawer
        darkTheme={darkTheme}
        dataTestId="all-alerts-search-filter"
        handlePageFilterDate={handlePageFilterDate}
      />
    </>
  );
};
