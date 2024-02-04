import React from 'react';
import {Image, Pressable} from 'react-native';
import {View, Text, Button, StyleSheet, KeyboardAvoidingView,TouchableWithoutFeedback, Platform} from 'react-native';
import Header from "../components/Header";
import {Colors} from "../themes/Colors";

const logo = require('../assets/logo.png');

function LoginOrRegister({ navigation }) {
    return (

        <View style={styles.screen}>
            <Header title={"Welcome"} navigation={navigation} />
        <View style={styles.container}>
            <Image style={styles.logo} source={logo}/>
            <Text style={styles.title}>Please <Text style={{color: Colors.accent}}>sign</Text> in or <Text style={{color: Colors.accent}}>register</Text></Text>
            <View style={styles.buttonContainer}>
                <Pressable
                    testID="LoginScreenButton"
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Pressable
                    testID="RegisterScreenButton"
                    onPress={() => navigation.navigate('Register')}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
            </View>
            <Pressable style={styles.privacynotice}
                    onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                    <Text style={{color: Colors.fg}}>Privacy policy</Text>
                </Pressable>
        </View>

        </View>
    );
}

// Center buttons
const styles = StyleSheet.create({
    container: {
        margin: "auto",
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        paddingBottom: "30%"
    },
    privacynotice: {
        bottom: '5%',
        position:'absolute'
    },
    screen: {
        height: "100%"
    },
    logo: {
        height: "20%",
        resizeMode: "contain"
    },
    title: {
        fontSize: 24
    },
    buttonContainer: {
        flexDirection: "row"
    },
    button: {
        margin: 10,
        backgroundColor: Colors.fg,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: Colors.bg,
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
    }
});

export default LoginOrRegister;
