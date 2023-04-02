import { StyleSheet, View, Dimensions, Button, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { useState } from 'react'

const FONT_SIZE = 0.04;

const TRANSPORT = ["Mode of Transport", "Car", "Bus"]

const Menu = () => {
    const [expanded, setExpanded] = useState(false);

    const [menuText, setMenuText] = useState("Mode of Transport");
    const [selected, setSelected] = useState(0);

    return (
        <View style={styles.menu}>
            <Octicons
                name="horizontal-rule"
                size={Dimensions.get('window').height * FONT_SIZE * 2}
                color="white"
            />
            <Text style={styles.title}>
                Where are you stuck?
            </Text>
            <View style={styles.dropdown}>

                <TouchableOpacity style={styles.dropdown_unit} onPress={() =>
                {
                    if (expanded) {
                        setMenuText(TRANSPORT[selected]);
                    } else {
                        setMenuText("Mode of Transport");
                    }
                    setExpanded(prev => !prev)
                }}>
                    <Text style={styles.text}>
                        {menuText}
                    </Text>
                    <Text style={styles.text}>
                        <Entypo
                            name={expanded ? "chevron-up" : "chevron-down"}
                            size={Dimensions.get('window').height * FONT_SIZE}
                            color="white"
                        />
                    </Text>
                </TouchableOpacity>
                <View style={expanded ? styles.visible : styles.hidden}>
                    <TouchableOpacity style={selected == 1 ? {...styles.dropdown_unit, ...styles.selected} : styles.dropdown_unit} onPress={() => setSelected(1)}>
                        <Text style={styles.text}>
                            Car
                        </Text>
                    </TouchableOpacity>
                     <TouchableOpacity style={selected == 2 ? {...styles.dropdown_unit, ...styles.selected} : styles.dropdown_unit} onPress={() => setSelected(2)}>
                        <Text style={styles.text}>
                            Bus
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={{...styles.dropdown_unit, ...styles.button}}>
                <Text style={{...styles.text, textAlign: "center"}}>
                     {"I'm Stuck!"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: "#435770",
    position: "absolute",
    bottom: 0,
    width: Dimensions.get('window').width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: Dimensions.get('window').height * 0.03,
    borderTopRightRadius: Dimensions.get('window').height * 0.03
  },
  button: {
    marginBottom: Dimensions.get('window').height * FONT_SIZE,
    width: Dimensions.get('window').width * 0.7,
    borderWidth: Dimensions.get('window').height * 0.004,
    borderRadius: Dimensions.get('window').height * 0.02,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "grey",
    padding: Dimensions.get('window').height * FONT_SIZE * 0.4,
  },
  title: {
    fontSize: Dimensions.get('window').height * FONT_SIZE,
    textAlign: 'center',
    marginTop: -Dimensions.get('window').height * FONT_SIZE * 0.5,
    marginBottom: Dimensions.get('window').height * FONT_SIZE,
    color: "white"
  },
  dropdown: {
    borderWidth: Dimensions.get('window').height * 0.004,
    borderRadius: Dimensions.get('window').height * 0.02,
    width: Dimensions.get('window').width * 0.75,
    padding: Dimensions.get('window').height * 0.02,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    marginBottom: Dimensions.get('window').height * FONT_SIZE,
  },
  text: {
    fontSize: Dimensions.get('window').height * FONT_SIZE * 0.75,
    color: "white"
  },
  dropdown_unit: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Dimensions.get('window').height * FONT_SIZE * 0.25,
    boxSizing: "border-box"
  },
  hidden: {
    display: "none"
  },
  visible: {
    display: "flex"
  },
  selected: {
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  }
});


export default Menu