import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {useState} from "react";
import Header from "../components/Header";
import {FlashList} from "@shopify/flash-list";
import Footer, {FooterWithoutAdd} from "../components/Footer";
import {requestPersonalData} from "../services/Account";
import {Colors} from "../themes/Colors";


const PersonalDataScreen = ({navigation}) => {

    const [myData, setData] = useState<Record<string, object[]>>({});

    const whenDataRequested = (loadedData) => {
        setData(loadedData);
    }

    return (
        <View style={{height: "100%"}}>
            <Header title="Personal Data" navigation={navigation} />
            <View>
                <Pressable style={styles.button} onPress= {() => requestPersonalData(whenDataRequested)}>
                    <Text style={styles.textStyle}>Load data</Text>
                </Pressable>
                <ScrollView style={{height: "77%"}}>
                    {Object.keys(myData).map((key) => (
                        <View key={key}>
                            <Text style={styles.headerTextStyle}>{key}</Text>
                            {myData[key].map((item, index) => (
                                <ScrollView style={styles.scrollView} key={index} horizontal={true}>
                                    <View key={index}>
                                        {Object.keys(item).map((property) => (
                                            <Text key={property}>{property}: {JSON.stringify(item[property])}</Text>
                                        ))}
                                    </View>
                                </ScrollView>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>
            <FooterWithoutAdd/>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        padding: 5,
        elevation: 5,
        margin: 10,
        height: 40,
    },
    container: {
        height: "100%",
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerTextStyle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 25,
        textAlign: "center"
    },
    scrollView: {
        backgroundColor: Colors.whiteGrey,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.fg,
        padding: 10
    }
});

export default PersonalDataScreen