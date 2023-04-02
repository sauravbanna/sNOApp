import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, PermissionsAndroid, Dimensions, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import { Menu, SubmittedMenu } from './components/Menu/Menu'
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FONT_SIZE } from "./constants"
import MapViewDirections from 'react-native-maps-directions'
import { getDistance } from 'geolib';

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

    const [submitted, setSubmitted] = useState(false);

    const [plows, setPlows] = useState([]);
    const [chosenPlow, setChosenPlow] = useState({latitude: 0, longitude: 0, plowID: -1});
    const [pin, setPin] = useState({latitude: 0, longitude: 0});

    useEffect(() => {
        getPlows();
    }, []);

    const getPlows = async () => {
        await fetch("http://localhost:1337/api/plows", {
            method: 'GET'
        })
         .then(res => {
             return res.json();
         })
         .then(res => {
             setPlows(res.data.map(plow => plow.attributes));
             var newChosenPlow = res.data.find(elem => elem.attributes.plowID == chosenPlow.plowID);
             if (newChosenPlow) {
                setChosenPlow(newChosenPlow);
             }

         });

        setTimeout(getPlows, 2000);
    }


    const addPin = (event) => {
        if (!submitted) {
            latlng = event.nativeEvent.coordinate;
            setPin(latlng);
        }
    }

    const [timeTaken, setTimeTaken] = useState(0);

    const submitStuck = async () => {
        if (!(pin["latitude"] == 0 && pin["longitude"] == 0)) {
            await fetch("http://localhost:1337/api/pins", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    "data": {
                        "coords": pin,
                        "dateAdded": Date.now()
                    }
                })
            });
            var sortedPlows = plows.sort((attr1, attr2) => {
                if (getDistance(attr1.coords, pin) < getDistance(attr2.coords, pin)) {
                    return -1;
                } else {
                    return 1;
                }
            });
            setChosenPlow(sortedPlows[0]);
            setSubmitted(true);
            return true;
        } else {
            ToastAndroid.show("Please select a Location", ToastAndroid.LONG);
            return false;
        }
    }

  const getPlowColor = (attr) => {
    if (chosenPlow) {
        if (chosenPlow.plowID) {
            return attr.plowID == chosenPlow.plowID ? "red" : "black";
        }
    }
  }

  return (
    <View style={styles.container}>
        <MapView
            onPress={addPin}
            ref={mapRef}
            style={styles.map}

        >
            {
                submitted
                ? <MapViewDirections
                    origin={pin}
                    destination={chosenPlow ? chosenPlow.coords : pin}
                    apikey={"AIzaSyDvC3Xiojsqt3_-ydLyHmsCvLupHEsgeyI"}
                    strokeWidth={4}
                    strokeColor="red"
                    onReady={result => {
                        setTimeTaken(result.duration);
                    }}
                  />
                : null
            }
            <Marker coordinate={pin}>
                <Entypo name="pin" size={Dimensions.get('window').height * FONT_SIZE} color="black" />
            </Marker>
            {plows.map((attr, index) => {
                return (
                    <Marker key={`plow_${index}`} coordinate={attr.coords}>
                        <FontAwesome5  name="snowplow" size={Dimensions.get('window').height * FONT_SIZE} color={getPlowColor(attr)} />
                    </Marker>
                );
            })}
        </MapView>
        {
            submitted
            ? <SubmittedMenu timeTaken={timeTaken} submitStuck={() => setSubmitted(false)} />
            : <Menu submitStuck={submitStuck} />
        }
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
  },
  logo: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: "absolute",
    backgroundColor: "white"
  }
});
