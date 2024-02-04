import {View, Text, Button, TextInput, Alert, StyleSheet, Pressable} from 'react-native';
import {useState, useContext} from "react";
import React from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import { loginUser} from '../services/Account';
import AuthContext from "../contexts/AuthContext";
import Header from "../components/Header";
import {DismissableNotification} from '../components/Notifications';
import {Colors} from "../themes/Colors";


function LoginScreen ({navigation, route}) 
{
    const notificationMessage = route?.params?.notificationMessage;
    const notificationVisibility = route?.params?.notificationVisibility;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {whenLoginSuccess} = useContext(AuthContext);

    const handleLogin = (email, password, whenLoginSuccess, setEmail, setPassword) => 
    {
        loginUser(email, password, whenLoginSuccess).catch((error) => 
        {
            setEmail("");
            setPassword("");
        });

    }


    return (
            <View style={styles.screen}>
                <Header title={"Log in"} navigation={navigation} />
            <View style={styles.container}>
                <DismissableNotification message={notificationMessage} duration={Infinity} visibility={notificationVisibility}></DismissableNotification>
                
                <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Text style={styles.title}>Sign in to your existing account</Text>
                <TextInput placeholder={"Email"} onChangeText={setEmail} value={email} inputMode={'email'} autoCapitalize={'none'} style={styles.textInput}></TextInput>
                <TextInput placeholder={"Password"} onChangeText={setPassword} value={password} autoCapitalize={'none'} secureTextEntry={true} style={styles.textInput}></TextInput>
                <Pressable style={styles.button}
                    onPress={() => handleLogin(email.trim(), password, whenLoginSuccess, setEmail, setPassword)}
                >
                    <Text style={styles.buttonText}>Log in</Text>
                </Pressable>
                <Pressable
                    onPress={() => navigation.navigate("ResetPassword")}
                >
                    <Text style={{color: Colors.fg}}>Forgot password?</Text>
                </Pressable>

                </KeyboardAvoidingView>
            </View>
            </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingBottom: "30%",
        margin: "auto",
        alignItems: "center",
    },
    screen: {
        height: "100%"
    },
    title: {
        marginBottom: 10,
        alignSelf: "center",
        fontSize: 36,
        textAlign: "center"
    },
    textInput: {
        fontSize: 20,
        padding: 10,
        backgroundColor: Colors.whiteGrey,
        marginBottom: 10,
        width: "80%"
    },
    keyboard: 
    {
        justifyContent:'center',
        alignItems: 'center',
        width: '100%',
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

export default LoginScreen;