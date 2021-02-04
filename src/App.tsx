import React, { useEffect, useState } from "react";
import "./App.css";
import {
   GoogleMap,
   useLoadScript,
   Marker,
   InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, {
   getGeocode,
   getLatLng,
} from "use-places-autocomplete";
import {
   Combobox,
   ComboboxInput,
   ComboboxPopover,
   ComboboxList,
   ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { loadMapApi } from "./utils/GoogleMapsUtils";
import Map from "./Map/Map";

const App: React.FC = () => {
   const [scriptLoaded, setScriptLoaded] = useState(false);

   // Check to see if script has been loaded
   useEffect(() => {
      const goolgeMapScript = loadMapApi();
      goolgeMapScript.addEventListener("load", function () {
         setScriptLoaded(true);
      });
   }, []);

   return (
      <div>
         {scriptLoaded && (
            <Map
               mapTypeControl={true}
               mapType={google.maps.MapTypeId.ROADMAP}
            ></Map>
         )}
      </div>
   );
};

export default App;
