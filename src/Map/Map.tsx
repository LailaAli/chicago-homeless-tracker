import React, { useEffect, useRef, useState } from "react";
import css from "./Map.module.scss";

// Interfaces/Types
interface IMap {
   mapType: google.maps.MapTypeId;
   mapTypeControl?: boolean;
   mapContainerStyle?: google.maps.MapOptions;
}

interface IMarker {
   address: string;
   latitude: number;
   longitude: number;
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;

const mapStyles: object[] = [
   {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
         {
            saturation: "1",
         },
         {
            lightness: "-100",
         },
         {
            hue: "#ff0000",
         },
      ],
   },
   {
      featureType: "landscape",
      elementType: "all",
      stylers: [
         {
            hue: "#ff0000",
         },
         {
            lightness: "-2",
         },
         {
            saturation: "-70",
         },
      ],
   },
   {
      featureType: "landscape.natural",
      elementType: "all",
      stylers: [
         {
            visibility: "simplified",
         },
         {
            saturation: "-100",
         },
         {
            hue: "#ff0000",
         },
         {
            lightness: "100",
         },
      ],
   },
   {
      featureType: "poi",
      elementType: "all",
      stylers: [
         {
            visibility: "simplified",
         },
         {
            saturation: "-100",
         },
         {
            lightness: "10",
         },
      ],
   },
   {
      featureType: "poi",
      elementType: "labels",
      stylers: [
         {
            visibility: "off",
         },
         {
            saturation: "-100",
         },
         {
            lightness: "-20",
         },
      ],
   },
   {
      featureType: "road",
      elementType: "all",
      stylers: [
         {
            saturation: "-50",
         },
         {
            lightness: "1",
         },
         {
            hue: "#ff0000",
         },
         {
            visibility: "simplified",
         },
      ],
   },
   {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
         {
            visibility: "on",
         },
      ],
   },
   {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [
         {
            visibility: "off",
         },
      ],
   },
   {
      featureType: "transit",
      elementType: "all",
      stylers: [
         {
            visibility: "off",
         },
      ],
   },
   {
      featureType: "water",
      elementType: "all",
      stylers: [
         {
            color: "#43494e",
         },
         {
            visibility: "on",
         },
      ],
   },
   {
      featureType: "water",
      elementType: "labels",
      stylers: [
         {
            visibility: "simplified",
         },
         {
            lightness: "20",
         },
      ],
   },
];

const markerIcon = { url: "../assets/hat.svg" };

const Map: React.FC<IMap> = (props) => {
   const { mapType, mapTypeControl = false } = props;

   // Hooks
   const ref = useRef<HTMLDivElement>(null);
   const [map, setMap] = useState<GoogleMap>();
   const [marker, setMarker] = useState<IMarker>();

   // Methods
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

   // API call
   const coordinateToAddress = async (coordinate: GoogleLatLng) => {
      const geocoder = new google.maps.Geocoder();
      await geocoder.geocode(
         { location: coordinate },
         function (results, status) {
            if (status === "OK") {
               console.log(results[0].formatted_address);
               setMarker({
                  address: results[0].formatted_address,
                  latitude: coordinate.lat(),
                  longitude: coordinate.lng(),
               });
            } else {
               // Do something
            }
         }
      );
   };

   // Listen for clicks for the markers
   const initEventListener = (): void => {
      if (map) {
         google.maps.event.addListener(map, "click", function (e) {
            console.log(e);
            coordinateToAddress(e.latLng);
         });
      }
   };

   const addMarker = (location: GoogleLatLng): void => {
      const marker: GoogleMarker = new google.maps.Marker({
         position: location,
         map: map,
         icon: getIconAttributes("#f7ca05"),
      });
   };

   const getIconAttributes = (iconColor: string) => {
      return {
         path: google.maps.SymbolPath.CIRCLE,
         // path: markerIcon,
         scale: 10,
         strokeWeight: 3,
         // fillColor: "#f7ca05",
         iconColor: iconColor,
      };
   };

   const addSingleMarker = (): void => {
      if (marker) {
         addMarker(new google.maps.LatLng(marker.latitude, marker.longitude));
      }
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
               rotateControl: false,
               scaleControl: false,
               zoomControl: true,
               gestureHandling: "cooperative",
               draggableCursor: mapType,
               mapTypeId: mapType,
               styles: mapStyles,
            })
         );
      }
   };

   // useEffects
   useEffect(startMap, [map]);
   useEffect(initEventListener, [map]);
   useEffect(addSingleMarker, [marker]);

   return (
      <div className={css.mapContainer}>
         <div ref={ref} className={css.map}></div>
      </div>
   );
};

export default Map;
