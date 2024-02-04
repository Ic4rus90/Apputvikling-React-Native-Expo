import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {Colors, colorBetween} from "../themes/Colors";
import {DateTimeToBeautiful, SecondsBetween, EpochNow} from "../utils/DateTimeFormatter"
import {easeIn} from "../utils/ExtraMath";
import {MaterialIcons} from "@expo/vector-icons";

const ParentTaskPresentation = ({notes, deadline}) => {

    const Notes = () => {
        if (!notes) return null;

        return (
            <View style={styles.notesWrapper}>
                <MaterialIcons style={styles.icon} name={"sticky-note-2"} size={24}/>
                <View>
                    <Text style={styles.label}>Notes</Text>
                    <Text>{notes}</Text>
                </View>
            </View>
        )
    }

    const Deadline = () => {
        if (!deadline) return null;

        // As the deadline is past 24 hours, start changing the color to red
        const colorStart = Colors.fg;
        const colorEnd = Colors.red;
        const secondsBetween = SecondsBetween(deadline.toDate(), EpochNow());
        const percentage = Math.max(Math.min(1 - secondsBetween/60/60/24, 1), 0);
        const color = colorBetween(colorStart, colorEnd, easeIn(percentage, 0.5));
        let text : string;
        if (percentage >= 1)
            text = "OVERDUE " + DateTimeToBeautiful(deadline.toDate());
        else
            text = "Due in " + DateTimeToBeautiful(deadline.toDate());


        return (
            <View style={styles.deadlineWrapper}>
                <MaterialIcons style={styles.icon} name={"calendar-today"} size={24}/>
                <View>
                    <Text style={styles.label}>Deadline</Text>
                    <Text style={{color: color}}>{text}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {Deadline()}
            {Notes()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-evenly",
        padding: 10,
    },
    deadlineWrapper: {
        backgroundColor: Colors.whiteGrey,
        borderRadius: 10,
        padding: 10,
        marginBottom: 4,
        flexDirection: "row"
    },
    notesWrapper: {
        backgroundColor: Colors.whiteGrey,
        borderRadius: 10,
        padding: 10,
        width: "99%",
        position: "relative",
        flexDirection: "row"
    },
    label: {
        color: Colors.grey
    },
    icon: {
        alignSelf: "center",
        marginRight: 5,
        color: Colors.grey
    }
});

export default ParentTaskPresentation;