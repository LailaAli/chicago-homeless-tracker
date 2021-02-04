import React, { useEffect, useRef, useState } from "react";
import css from "./Map.module.scss";

interface IMap {
   mapType: google.maps.MapTypeId;
   mapTypeControl?: boolean;
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;

const Map: React.FC<IMap> = (props) => {
   const { mapType, mapTypeControl = false } = props;

   const ref = useRef<HTMLDivElement>(null);
   const [map, setMap] = useState<GoogleMap>();

   const startMap = (): void => {
      if (!map) {
         defaultMapStart();
      }
   };

   // Create initial map w/initial zoom and address
   const defaultMapStart = (): void => {
      const defaultAddress = new google.maps.LatLng(41.892914, -87.63591);
      initMap(14, defaultAddress);
   };

   const initMap = (zoomLevel: number, address: GoogleLatLng): void => {
      if (ref.current) {
         // Return map object if ref is ready
         setMap(
            new google.maps.Map(ref.current, {
               zoom: zoomLevel,
               center: address,
               mapTypeControl: mapTypeControl,
               streetViewControl: false,
               zoomControl: true,
               mapTypeId: mapType,
            })
         );
      }
   };

   useEffect(startMap, [map]);

   return (
      <div className={css.mapContainer}>
         <div ref={ref} className={css.map}></div>
      </div>
   );
};

export default Map;
