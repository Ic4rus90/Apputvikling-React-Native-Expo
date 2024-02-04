import React from 'react';
import {Alert, Text} from 'react-native';


const PasswordStrengthChecker = ({password}) => {
    //Check if password is between 8 and 64 characters
    if (password.length < 8 || password.length > 64) {
        Alert.alert("Password must be between 8 and 64 characters");
        return false;
    }



}