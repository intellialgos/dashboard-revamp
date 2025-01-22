import { AimOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Badge, Button, Empty, Input, Spin, Typography } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import clsx from "clsx";
import { useCallback, useContext, useEffect, useState, type FC } from "react";
import { ActionList } from "@/components/action-list";
import { GoogleMapControl } from "@/components/google-map-control";
import { Widget } from "@/components/widget";
import { GOOGLE_MAP_API_KEY } from "@/const/google-maps";
import { ALERTS_MAP_CONFIG } from "./config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useQueryEventsMutation } from "@/services";
import { clearAllSelectEvents } from "@/store/slices/events";
import { ThemeContext } from "@/theme";
// import { formatDate, getLastWeekDate } from "@/utils/general-helpers";
import styles from "./index.module.css";
// import { alerts } from './mock';
// import { DeviceEvent } from "@/types/device-event";
// import { useAppSelector } from "@/hooks/use-app-selector";
// import { getEvents } from "@/store/selectors/events";
import circleMarker from '@/assets/orangemarker.svg'

type Props = {
  className?: string;
  dataTestId?: string;
  data: [];
  isLoading: boolean;
  selectedSite: string|null;
  setSelectedSite: React.Dispatch<React.SetStateAction<string|null>>;
};

const { Search } = Input;

export const AlertsMap: FC<Props> = ({ className, dataTestId, data, isLoading, selectedSite, setSelectedSite }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });

  // const events = useAppSelector(getEvents);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlertData, setFilteredAlertData] = useState([]);

  useEffect(() => {
    const filteredData = data.filter((alert) =>
      alert?.site_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredAlertData(filteredData);
  }, [data, searchQuery]);


  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    if ( filteredAlertData.length > 0 ) {
      setMap(mapInstance);
    }
  }, [filteredAlertData]);

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
  const handleNavigate = async (id: string) => {
    // dispatch(clearAllSelectEvents());
    // navigate(`/alert-map?siteId=${id}&&title=${name}`);
    if ( selectedSite == id ) {
      setSelectedSite(null);
    } else {
      setSelectedSite(id);
    }
  };

  return (
    <div className={clsx(className, styles.container)} data-testid={dataTestId}>
      <Widget
        title="Alerts By Site"
        className={ `${styles.alerts} ${darkTheme ? styles.alerts_bg : styles.alert_light}`}
        contentClassName={styles.content}
        round={false}
        extraAddon={selectedSite && <Button
          onClick={() => { setSelectedSite(null) }}
          size="small"
          danger
          type="link"
        >
          Remove Filter <CloseCircleOutlined />
        </Button>}
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
              {filteredAlertData?.map(({ site_id, site_name, count }) => (
                <ActionList.Item
                  key={site_id}
                  extra={<Typography.Text type={(selectedSite == site_id) ? "success" : "secondary"}>{count}</Typography.Text>}
                  onClick={() => handleNavigate(site_id)}
                >
                  <Badge status="success" /> <Typography.Text type={(selectedSite == site_id) ? "success" : "secondary"}>{site_name}</Typography.Text>
                </ActionList.Item>
              ))}
            </>
          )}
        </ActionList>
      </Widget>

      <ErrorBoundary>
        {isLoaded && (
          <GoogleMap
            key={'sds'}
            mapContainerClassName={styles.map}
            options={ALERTS_MAP_CONFIG}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
          >
            
            {filteredAlertData.map(({ site_id, lat, lng, count }) => (
              <Marker
                key={site_id}
                position={{ lat: lat, lng: lng }}
                options={{
                  icon: window.google.maps.Icon
                }}
                icon={circleMarker}
                label={String(count)}
                />
            ))}
            <GoogleMapControl
              position={window.google.maps.ControlPosition.RIGHT_BOTTOM}
            >
              <button
                type="button"
                className={styles.mapButton}
                style={{ marginInlineEnd: "6px" }}
                // onClick={handleMapCenterClick}
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
