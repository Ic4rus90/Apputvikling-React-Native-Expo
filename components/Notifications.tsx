import React, {useEffect} from 'react';
import {useState} from 'react';
import {Snackbar} from 'react-native-paper';
import {StyleSheet} from "react-native";


// Takes in the message to be shown, the initial (or subsequent) visibility, and the duration. 
// If no duration is given, the default is 4000ms (4 seconds).
const DismissableNotification = ({message, visibility, duration = 4000}) => 
{
    const [notificationVisibility, setNotificationVisibility] = useState(visibility);

    // This causes the notification to update its visibility when the visibility prop changes from the parent screen.
    // As the notification is its own component, re-rendering the parent screen does not have any effect. The notification itself has to be "rerendered".

    useEffect(() => 
    {
        setNotificationVisibility(visibility);
    }, [visibility]);


    const handleDismiss = () => 
    {
        setNotificationVisibility(false);
    }
    return (
        <Snackbar
            wrapperStyle={styles.snackbarWrapper}
            style={styles.snackbar}
            visible={notificationVisibility}
            onDismiss={handleDismiss}
            duration={duration}
            action={{
                label: 'Dismiss',
                onPress: handleDismiss
            }}
            >{message}</Snackbar>
    )
}

const styles = StyleSheet.create({
    snackbarWrapper: {
        bottom:0
    },
    snackbar: {
        backgroundColor: "#222d3a"
    }
});

export {DismissableNotification}