import { View, Text, TouchableWithoutFeedback, ToastAndroid, Dimensions, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Entypo } from '@expo/vector-icons';


const PinView = () => {
    const [pins, setPins] = useState([]);

    const addPin = (event) => {
        xCoord = event.nativeEvent.locationX;
        yCoord = event.nativeEvent.locationY;
        ToastAndroid.show("bruh", ToastAndroid.SHORT);
        setPins(prev => {
            return [
                ...prev,
                {
                    "x": xCoord,
                    "y": yCoord
                }
            ]
        })
    }

    return (
        <TouchableWithoutFeedback onPress={addPin}>
            <View style={styles.container}>
               {pins.map((coords, index) => {
                    return (
                        <Entypo
                            key={`pin_${index}`}
                            name="pin"
                            size={Dimensions.get('window').height * FONT_SIZE}
                            color="black"
                            style={
                                {
                                    position: "absolute",
                                    top: coords["y"],
                                    left: coords["x"]
                                }
                            }
                         />
                    );
               })}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
   container: {
      position: "absolute",
      top: 0,
      left: 0,
      minWidth: Dimensions.get('window').width,
      minHeight: Dimensions.get('window').height,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "red",
   }
});

export default PinView