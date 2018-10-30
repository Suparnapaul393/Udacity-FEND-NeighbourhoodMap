import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

const MapComponent = withScriptjs(
  withGoogleMap(props => {
    const { filteredPlaces, onInfoWindowClose, onPlaceSelected } = props;
    let defaultCenter = {};
    if (filteredPlaces[0]) {
      defaultCenter = {
        lat: filteredPlaces[0].latitude,
        lng: filteredPlaces[0].longitude
      };
    }

    return (
      <GoogleMap
        defaultZoom={12}
        defaultCenter={defaultCenter}
      >
        {filteredPlaces.map((place, id) => (
          <Marker 
            key={id} 
            position={{ lat: place.latitude, lng: place.longitude }}
            title={place.title} 
            animation={place.title === props.selectedPlace.title ? 2 : 0}
            onClick={e => onPlaceSelected(place)}
            >
            {place.title === props.selectedPlace.title && (
              <InfoWindow onCloseClick={onInfoWindowClose}>
                <React.Fragment>
                  <h4>{place.title}</h4>
                  <p>{place.description}<br />
                  {place.formattedAddress}</p>
                </React.Fragment>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    );
  }),
);

export default MapComponent;
