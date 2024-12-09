import { AimOutlined, LoadingOutlined } from "@ant-design/icons";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Badge, Empty, Input, Spin } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import clsx from "clsx";
import { useCallback, useContext, useEffect, useState, type FC } from "react";
import { ActionList } from "../../components/action-list";
import { GoogleMapControl } from "../../components/google-map-control";
import { Widget } from "../../components/widget";
import { GOOGLE_MAP_API_KEY } from "../../const/google-maps";
import { ALERTS_MAP_CONFIG } from "./config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryeventsiteMutation } from "../../services";
import { clearAllSelectEvents } from "../../store/slices/events";
import { ThemeContext } from "../../theme";
import { formatDate, getLastWeekDate } from "../../utils/general-helpers";
import styles from "./index.module.css";

type Props = {
  className?: string;
  dataTestId?: string;
};

const { Search } = Input;

export const AlertsMap: FC<Props> = ({ className, dataTestId }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [map, setMap] = useState<google.maps.Map | null>(null);
  useQueryeventsiteMutation;
  const [getAllEvents, { isLoading }] = useQueryeventsiteMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlertData, setFilteredAlertData] = useState([]);
  const [alertData, setAlertData] = useState<[]>([]);

  useEffect(() => {
    const filteredData = alertData.filter((alert) =>
      alert.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredAlertData(filteredData);
  }, [alertData, searchQuery]);

  const date = new Date();
  useEffect(() => {
    const body = {
      startTime: formatDate(getLastWeekDate(date)),
      endTime: formatDate(date),
    };
    (async () => {
      const res = await getAllEvents(body);
      setAlertData(res.data.data.site);
      console.log("Alerts Data", res);
    })();
  }, []);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapCenterClick = () => {
    if (map === null) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map.panTo(ALERTS_MAP_CONFIG.center!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map.setZoom(ALERTS_MAP_CONFIG.zoom!);
  };
  const handleNavigate = async (id: string, name: string) => {
    dispatch(clearAllSelectEvents());
    navigate(`/alert-map?siteId=${id}&&title=${name}`);
  };

  return (
    <div className={clsx(className, styles.container)} data-testid={dataTestId}>
      <Widget
        title="Alerts"
        className={ `${styles.alerts} ${darkTheme ? styles.alerts_bg : styles.alert_light}`}
        contentClassName={styles.content}
        round={false}
      >
        <Search
          placeholder="Search..."
          className={ `${darkTheme ? "serch_input_map" : "light_serch_input_map"}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ActionList className={`${styles.list} ${darkTheme ? styles. list_bg : ""}`}>
          {(!isLoading && filteredAlertData.length) === 0 ? (
            <div className="loader">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : isLoading ? (
            <div className="loaderContainer">
              <Spin
                indicator={
                  <LoadingOutlined style={{ fontSize: 24 }} spin={true} />
                }
              />
            </div>
          ) : (
            <>
              {filteredAlertData?.map(({ id, name, count }) => (
                <ActionList.Item
                  key={id}
                  extra={count}
                  onClick={() => handleNavigate(id, name)}
                >
                  <Badge status="success" /> {name}
                </ActionList.Item>
              ))}
            </>
          )}
        </ActionList>
      </Widget>

      <ErrorBoundary>
        {isLoaded && (
          <GoogleMap
            mapContainerClassName={styles.map}
            options={ALERTS_MAP_CONFIG}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
          >
            <GoogleMapControl
              position={window.google.maps.ControlPosition.RIGHT_BOTTOM}
            >
              <button
                type="button"
                className={styles.mapButton}
                style={{ marginInlineEnd: "6px" }}
                onClick={handleMapCenterClick}
                title="Re-center the map"
                aria-label="Re-center the map"
              >
                <AimOutlined />
              </button>
            </GoogleMapControl>
          </GoogleMap>
        )}
      </ErrorBoundary>
    </div>
  );
};
