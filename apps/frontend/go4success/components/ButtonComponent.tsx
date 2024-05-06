import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

type ButtonComponentProps = {
    readonly text: string;
    readonly onPress: () => void;
    readonly buttonType:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "close"
        | "clear"
        | "filter";
    readonly style?: any;
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
    text,
    onPress,
    buttonType,
    style = {},
}) => {
    const styles = StyleSheet.create({
        common: {
            borderRadius: 15,
            padding: 8,
            margin: 4,
            fontWeight: "500",
            textAlign: "center",
            color: "white",
            fontSize: 16,
        },
        primary: {
            backgroundColor: Colors.primaryColor,
        },
        secondary: {
            backgroundColor: Colors.secondaryColor,
        },
        close: {
            backgroundColor: Colors.importantColor,
        },
        success: {
            backgroundColor: Colors.appointmentColor,
        },
        danger: {
            backgroundColor: Colors.importantColor,
        },
        filter: {
            backgroundColor: Colors.primaryColor,
            borderRadius: 15,
            padding: 4,
            margin: 4,
            marginLeft: 0,
            width: 160,
        },
        clear: {
            backgroundColor: Colors.primaryColor,
            borderRadius: 15,
            padding: 4,
            margin: 10,
            marginTop: -25,
        },
    });

    return (
        <TouchableOpacity
            style={[styles.common, styles[buttonType], style]}
            onPress={onPress}
        >
            <Text style={styles.common}>{text}</Text>
        </TouchableOpacity>
    );
};

export default ButtonComponent;
