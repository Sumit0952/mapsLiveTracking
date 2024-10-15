import GetLocation from 'react-native-get-location';

// Helper function to get the current location
export const getCurrentLocation = () => {
  return GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
  })
    .then(location => {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,  // Zoom level
        longitudeDelta: 0.01, // Zoom level
      };
    })
    .catch(error => {
      console.error('Location Error:', error.message);
      return null;
    });
};
