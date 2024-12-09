import { AimOutlined } from "@ant-design/icons";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Input } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import clsx from "clsx";
import { useCallback, useContext, useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleMapControl } from "../../components/google-map-control";
import { GOOGLE_MAP_API_KEY } from "../../const/google-maps";
import { useQueryeventsiteMutation } from "../../services";
import { clearAllSelectEvents, setShowEventsFilterModal } from "../../store/slices/events";
import { ThemeContext } from "../../theme";
import { formatDate, getLastWeekDate } from "../../utils/general-helpers";
import { ALERTS_MAP_CONFIG } from "./config";
import brownMarker from '../../assets/brownmarker.svg'
import orangeMarker from '../../assets/orangemarker.svg'
import styles from "./index.module.css";

type Props = {
  className?: string;
  dataTestId?: string;
};

const { Search } = Input;

export const SiteMapComp: FC<Props> = ({ className, dataTestId }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appTheme } = useContext(ThemeContext);
  const darkTheme = appTheme === "dark";
  const [map, setMap] = useState<google.maps.Map | null>(null);
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
  const onMarkerClick=()=>{
    dispatch(setShowEventsFilterModal(true))
  }
  const coOrdinates = [
    {
      lat: 23.4241,
      lng: 53.8478,
      status:1
    },
    {
      lat: 23.1000,
      lng: 53.2568,
      status:1
    },
    {
      lat: 23.4000,
      lng: 53.8000,
      status:2
    },
    {
      lat: 23.4000,
      lng: 53.7000,
      status:2
    },
   
  ];
  return (
    <div className={clsx(className, styles.container)} data-testid={dataTestId}>
      <ErrorBoundary>
        {isLoaded && (
          <GoogleMap
            mapContainerClassName={styles.map}
            options={ALERTS_MAP_CONFIG}
            onLoad={handleMapLoad}
            onUnmount={handleMapUnmount}
          >
            {coOrdinates.map((item) => (
              <Marker position={{ lat: item.lat, lng: item.lng }} onClick={()=>onMarkerClick()} icon={item.status === 1 ? brownMarker : orangeMarker} />
            ))}

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
