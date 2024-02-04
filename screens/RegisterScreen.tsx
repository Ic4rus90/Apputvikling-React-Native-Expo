import {
    View,
    Text,
    Button,
    TextInput,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from 'react-native';
import {useState} from "react";
import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { auth } from "../firebaseConfig";
import React from 'react';
import {isValidEmail} from '../utils/DataValidation';
import Header from "../components/Header";
import {Colors} from "../themes/Colors";

function RegisterScreen ({navigation}) {


      const registerNotification = "A verification email has been sent to your email address. Please check your inbox.";
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");

        const registerUser = () => {
            if (!isValidEmail(email)) {
                Alert.alert('Invalid email format', 'Please enter a valid email address');

                return;
            }
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                sendEmailVerification(user);
                navigation.navigate('Login', {notificationMessage: registerNotification, notificationVisibility: true});
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setEmail("");
                setPassword("");

                if (errorCode === 'auth/email-already-in-use') {
                    Alert.alert('Error', 'The email address is already in use.');
                } 
                else if (errorCode === 'auth/weak-password')
                {
                    Alert.alert('Error', 'Your password needs to be at least six characters long.');
                }
                else if (errorCode === 'auth/missing-password'){
                    Alert.alert('Error', 'Please enter a password.');
                }
                else {
                    Alert.alert('Error', errorMessage);
                }
            });

    }
  return (
    // KeyboardAvoidingView is used to move items, such as text fields, up when the keyboard is opened.

        <View style={styles.screen}>
        <Header title={"Register"} navigation={navigation} />
        <View style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Text style={styles.title}>Create a new account</Text>
            <TextInput placeholder={"Email"} autoCapitalize={'none'} inputMode={'email'} value={email} onChangeText={text => setEmail(text)} style={styles.textInput}></TextInput>
            <TextInput placeholder={"Password"} onChangeText={text => setPassword(text)} value={password} autoCapitalize={'none'} secureTextEntry={true} style={styles.textInput}></TextInput>
            <Pressable
                onPress={registerUser}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Register</Text>
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

export default RegisterScreen;