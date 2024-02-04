import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import {useState, useContext} from "react";
import React from 'react';
import {KeyboardAvoidingView, Platform, Alert} from 'react-native';
import { loginUser} from '../services/Account';
import AuthContext from "../contexts/AuthContext";
import Header from "../components/Header";
import {DismissableNotification} from '../components/Notifications';
import {Colors} from "../themes/Colors";
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { navigate } from '../modules/RootNavigation';
import { isValidEmail } from '../utils/DataValidation';


const resetPassword = async (email) => {
    
    try {
        await sendPasswordResetEmail(auth, email);
        }

    catch(error){
        console.log(error);
    }


}


const handleResetPassword = async (email, navigation, setEmail) => 
{
    if (!isValidEmail(email)) 
    {
        Alert.alert("Invalid email", "Please enter a valid email address.");
        setEmail(''); // Empty email field
    }
    else 
    {
        resetPassword(email);
        navigation.navigate("Login", {notificationMessage: "If an account with this email address exists, we will send a password reset email. Please check your inbox.", notificationVisibility: true})
    }
    
}

function ResetPasswordScreen ({navigation, route})
{

    const [email, setEmail] = useState("");

    return (
        <View style={styles.screen}>
            <Header title={"Reset password"} navigation={navigation} />

            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Text style={styles.title}>Enter email to reset password</Text>
                    <TextInput placeholder={"Email"} onChangeText={setEmail} value={email} inputMode={'email'} autoCapitalize={'none'} style={styles.textInput}></TextInput>
                    <Pressable style={styles.button}
                                 onPress={() => {handleResetPassword(email, navigation, setEmail);}}
                    >
                        <Text style={styles.buttonText}>Reset password</Text>
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
    keyboard: 
    {
        justifyContent:'center',
        alignItems: 'center',
        width: '100%',
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

export default ResetPasswordScreen;