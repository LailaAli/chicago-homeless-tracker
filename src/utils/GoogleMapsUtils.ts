// This script will check to see if the Google Maps script has been downloaded by our app.
export const loadMapApi = () => {
  const mapsURL = `https://maps.googleapis.com/maps/api/js?key=${ process.env.REACT_APP_GOOGLE_MAPS_API_KEY }&libraries=places&languages=en&v=quarterly`;

  // Create script to refer to URL above
  // Collect all scripts into a variable
  const scripts = document.getElementsByTagName( 'script' );

  // Loop through scripts
  // If this case is met then Google Map URL was already loaded
  for ( let i = 0; i < scripts.length; i++ ) {
    if ( scripts[ i ].src.indexOf( mapsURL ) === 0 ) {
      return scripts[ i ];
    }
  }

  // If the loop above does not return, then create and load the script
  const googleMapScript = document.createElement( 'script' );
  googleMapScript.src = mapsURL;
  // Required by Google Maps docs
  googleMapScript.async = true;
  googleMapScript.defer = true;
  // Load script into DOM
  window.document.body.appendChild( googleMapScript );

  return googleMapScript;
}