import React, { useEffect, useRef, useState } from "react";
import css from "./Map.module.scss";
import hat from "../assets/hat.svg";
import db from "../firebase";

// Interfaces/Types
interface IMap {
   mapType: google.maps.MapTypeId;
   mapTypeControl?: boolean;
   mapContainerStyle?: google.maps.MapOptions;
}

interface IMarker {
   place_id: string;
   address: string;
   latitude: number;
   longitude: number;
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;

// Variables
const mapStyles: object[] = [
   {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
         {
            visibility: "on",
         },
      ],
   },
   {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
         {
            color: "#56331d",
         },
      ],
   },
   {
      featureType: "administrative.country",
      elementType: "geometry.fill",
      stylers: [
         {
            saturation: "13",
         },
         {
            lightness: "-4",
         },
         {
            visibility: "on",
         },
      ],
   },
   {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [
         {
            color: "#56331d",
         },
      ],
   },
   {
      featureType: "administrative.neighborhood",
      elementType: "labels.text",
      stylers: [
         {
            color: "#56331d",
         },
         {
            saturation: "0",
         },
      ],
   },
   {
      featureType: "administrative.neighborhood",
      elementType: "labels.text.fill",
      stylers: [
         {
            color: "#ab693f",
         },
         {
            saturation: "0",
         },
      ],
   },
   {
      featureType: "administrative.neighborhood",
      elementType: "labels.text.stroke",
      stylers: [
         {
            visibility: "off",
         },
      ],
   },
   {
      featureType: "landscape",
      elementType: "all",
      stylers: [
         {
            color: "#f2f2f2",
         },
      ],
   },
   {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
         {
            visibility: "on",
         },
         {
            color: "#ffffff",
         },
      ],
   },
   {
      featureType: "landscape",
      elementType: "geometry.stroke",
      stylers: [
         {
            weight: "0.62",
         },
         {
            color: "#ffd8b4",
         },
         {
            visibility: "on",
         },
      ],
   },
   {
      featureType: "landscape.natural.landcover",
      elementType: "geometry.fill",
      stylers: [
         {
            color: "#ff0000",
         },
         {
            visibility: "off",
         },
      ],
   },
   {
      featureType: "poi",
      elementType: "all",
      stylers: [
         {
            visibility: "off",
         },
      ],
   },
   {
      featureType: "road",
      elementType: "all",
      stylers: [
         {
            saturation: -100,
         },
         {
            lightness: 45,
         },
         {
            visibility: "on",
         },
      ],
   },
   {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
         {
            visibility: "simplified",
         },
      ],
   },
   {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
         {
            color: "#eccca8",
         },
         {
            visibility: "off",
         },
      ],
   },
   {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
         {
            color: "#713700",
         },
         {
            visibility: "off",
         },
      ],
   },
   {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
         {
            color: "#451e07",
         },
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
            color: "#fee2c8",
         },
         {
            visibility: "on",
         },
      ],
   },
];

const markers: IMarker[] = [];

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

   const initMap = (zoomLevel: number, address: GoogleLatLng): void => {
      if (ref.current) {
         // Return map object if ref is ready
         setMap(
            new google.maps.Map(ref.current, {
               zoom: zoomLevel,
               center: address,
               streetViewControl: false,
               rotateControl: false,
               scaleControl: false,
               zoomControl: true,
               gestureHandling: "cooperative",
               draggableCursor: mapType,
               mapTypeId: mapType,
               styles: mapStyles,
               disableDefaultUI: true,
               mapTypeControl: false,
            })
         );
      }
   };

   // Listen for clicks for the markers
   const initEventListener = (): void => {
      if (map) {
         google.maps.event.addListener(map, "click", function (e) {
            coordinateToAddress(e.latLng);
         });
      }
   };

   // API call - get coordinates/address of the click
   const coordinateToAddress = async (coordinate: GoogleLatLng) => {
      const geocoder = new google.maps.Geocoder();
      await geocoder.geocode(
         { location: coordinate },
         function (results, status) {
            if (status === "OK") {
               setMarker({
                  place_id: results[0].place_id,
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

   // Add new marker on click
   const addSingleMarker = (): void => {
      if (marker) {
         addMarker(new google.maps.LatLng(marker.latitude, marker.longitude));

         // Add marker to an array
         markers.push(marker);
         console.log("markers ", markers);

         // Add new marker to db
         // db.collection("markers").doc(marker.place_id).set(marker);

         // Attach click event handler to marker
      }
   };

   // Create marker
   const addMarker = (location: GoogleLatLng): void => {
      const marker: GoogleMarker = new google.maps.Marker({
         position: location,
         map: map,
         icon: getIconAttributes("#a8db01"),
         clickable: true,
      });
   };

   // Build marker icon
   const getIconAttributes = (iconColor: string) => {
      return {
         path:
            "M11.0639 15.3003L26.3642 2.47559e-05L41.6646 15.3003L26.3638 51.3639L11.0639 15.3003 M22,17.5a4.5,4.5 0 1,0 9,0a4.5,4.5 0 1,0 -9,0Z",
         fillColor: iconColor,
         fillOpacity: 0.8,
         strokeColor: "#4d3700",
         strokeWeight: 2,
         anchor: new google.maps.Point(30, 50),
      };
   };

   // TODO
   // Delete marker
   const deleteMarker = (): void => {
      if (map) {
         google.maps.event.addListener(map, "click", function (marker) {
            for (let i = 0; i < markers.length; i++) {
               if (markers[i].place_id === marker.place_id) {
                  console.log(markers[i].place_id);
               } else {
                  console.log("no match");
               }
            }
         });
      }

      // if (marker) {
      //    setMarker(undefined);
      //    db.collection("markers")
      //       .doc(marker.place_id)
      //       .delete()
      //       .then(() => {
      //          console.log("Document successfully deleted!");
      //       })
      //       .catch((error) => {
      //          console.error("Error removing document: ", error);
      //       });
      // }
   };

   // TODO
   const showExistingMarkers = (): void => {
      // otherwise loop through each and run the addSingleMarker()
      db.collection("markers").onSnapshot((snapshot) => {
         snapshot.docs.map((doc) => ({
            //    setMarker ( {
            //    place_id: doc.data().placeId,
            //    longitude: doc.data().longitude,
            //    latitude: doc.data().latitude,
            // } ),
            // snapshot.docs.map((doc) => console.log(doc.data()))
         }));
      });
   };

   // useEffects
   useEffect(startMap, [map]);
   useEffect(showExistingMarkers, []);
   useEffect(initEventListener, [map]);
   useEffect(addSingleMarker, [marker]);

   return (
      <div className={css.mapContainer}>
         <h1>
            <img className={css.hatLogo} src={hat} alt="logo" />
         </h1>
         <div ref={ref} className={css.map}></div>
      </div>
   );
};

export default Map;
