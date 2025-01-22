import { AimOutlined, PoweroffOutlined } from "@ant-design/icons";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Input, Tag, Typography } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import clsx from "clsx";
import { useCallback, useContext, useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleMapControl } from "@/components/google-map-control";
import { GOOGLE_MAP_API_KEY } from "@/const/google-maps";
import { useGetSitesQuery, useQueryeventsiteMutation } from "@/services";
import { clearAllSelectEvents, setShowEventsFilterModal } from "@/store/slices/events";
import { ThemeContext } from "@/theme";
import { formatDate, getLastWeekDate } from "@/utils/general-helpers";
import { ALERTS_MAP_CONFIG } from "./config";
import brownMarker from '@/assets/brownmarker.svg'
import orangeMarker from '@/assets/orangemarker.svg'
import styles from "./index.module.css";
import { OrganisationSite } from "@/types/organisation";

type Props = {
  className?: string;
  dataTestId?: string;
  sites: OrganisationSite[]
};

const { Search } = Input;

export const SiteMapComp: FC<Props> = ({ className, dataTestId, sites }) => {
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
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const handleMarkerMouseOver = (siteId: string) => {
    setHoveredMarker(siteId);
  };
  const handleMarkerMouseOut = () => {
    setHoveredMarker(null);
  };

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
            {sites && sites.map((site: OrganisationSite) => (
              <Marker
                position={{ lat: site.latitude, lng: site.longitude }}
                onClick={()=>onMarkerClick()}
                icon={site.connectionState ? orangeMarker : brownMarker}
                onMouseOver={() => handleMarkerMouseOver(site.id)}
                onMouseOut={handleMarkerMouseOut}
              >
                {hoveredMarker === site.id && (
                  <InfoWindow>
                      <div style={{color: "#222"}}>
                      <h4>{site.name}</h4>
                      {/* <p><Tag color={site?.connectionState ? "green-inverse" : "red-inverse"}> <PoweroffOutlined /> { site?.connectionState ? "Online" : "Offline" } </Tag></p> */}
                      <p>Remark: {site.remark || "N/A"}</p>
                      </div>
                  </InfoWindow>
                )}
              </Marker>
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
