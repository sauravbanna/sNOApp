import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import Menu from './components/Menu/Menu'

import * as Location from 'expo-location';

export default function App() {
    const [location, setLocation] = useState({});

    const requestLocation = async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return false;
          }

          return true;

    }

    useEffect(() => {
        const result = requestLocation();

        result.then(async res => {
            if (res) {
                Location.watchPositionAsync(
                { accuracy: Location.Accuracy.Highest, timeInterval: 2000, distanceInterval: 1 },
                position => {
                    setLocation({
                        "lg": position.coords.longitude,
                        "lt": position.coords.latitude
                    })
                })
            }
        })
    }, [])

    useEffect(() => {
        const r = {
            latitude: location["lt"],
            longitude: location["lg"],
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
        };
        mapRef.current.animateToRegion(r);
    }, [location])


    const mapRef = useRef();

  return (
    <View style={styles.container}>

        <MapView
            ref={mapRef}
            style={styles.map}

        />
        <Menu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%"
  },
  map: {
    flex: 1
  }
});
