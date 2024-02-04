import {View, Text, Button, TextInput, Alert, StyleSheet, Pressable} from 'react-native';
import {useState, useContext} from "react";
import React from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, StatusBar} from 'react-native';
import { loginUser} from '../services/Account';
import AuthContext from "../contexts/AuthContext";
import Header from "../components/Header";
import {DismissableNotification} from '../components/Notifications';
import {Colors} from "../themes/Colors";
import { WebView } from 'react-native-webview';




function PrivacyPolicyScreen({navigation}) 
{
    const PrivacyURL = 'https://firebasestorage.googleapis.com/v0/b/supernova-4abff.appspot.com/o/privacy_notice.html?alt=media&token=5c2c6d66-074c-436a-94e5-7b35a93fe532';


    return (
        <SafeAreaView style={{flex: 1}}>
        <Header title={"Privacy Policy"} navigation={navigation} />
        <WebView source={{ uri: PrivacyURL}} style={styles.webView} scalesPageToFit={true} />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({

    webView: {
        flex:1,
        borderWidth: 5,
    },
});



export default PrivacyPolicyScreen;


