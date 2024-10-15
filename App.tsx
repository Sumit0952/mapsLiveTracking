import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getCurrentLocation } from './src/utils/helperFunctions/GetCurrentLocation'; // Adjust the path as necessary
import axios from 'react-native-axios';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDPnTtoIyikfBoIHV93RAaeD8bdtYkjqWI'; // Replace with your Google Maps API key

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [startLocation, setStartLocation] = useState(null); // Starting point
  const [endLocation] = useState({ latitude: 18.6069, longitude: 73.8751 }); // End location
  const [isRequestingLocation, setIsRequestingLocation] = useState(false); // Flag for location requests

  // Function to update location
  const updateLocation = async () => {
    if (isRequestingLocation) return; // Prevent new request if one is already in progress

    setIsRequestingLocation(true); // Set flag to indicate request is in progress
    try {
      const loc = await getCurrentLocation(); // Get current location
      if (loc) {
        setLocation(loc);
        setErrorMsg(null); // Clear error message
        setStartLocation(loc); // Set starting location to current location
      } else {
        setErrorMsg('Unable to fetch location');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setErrorMsg('Error fetching location');
    } finally {
      setIsRequestingLocation(false); // Reset the requesting flag
    }
  };

  // Fetch initial location and set up interval
  useEffect(() => {
    updateLocation(); // Fetch initial location
    const interval = setInterval(updateLocation, 10000); // Update every 10 seconds
    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            ...location,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          region={location}
        >
          <Marker coordinate={location} title="Current Location" />
          {startLocation && <Marker coordinate={startLocation} title="Start Location" />}
          {endLocation && <Marker coordinate={endLocation} title="End Location" />}

          {startLocation && endLocation && (
            <MapViewDirections
              origin={startLocation}
              destination={endLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={6}
              strokeColor="blue"
              onReady={(result) => {
                console.log(result);
              }}
              onError={(errorMessage) => {
                console.error('Error fetching directions:', errorMessage);
              }}
            />
          )}
        </MapView>
      ) : (
        <Text>{errorMsg || 'Getting your location...'}</Text>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
