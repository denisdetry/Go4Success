import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type ButtonComponentProps = {
    readonly icon?: any;
    readonly text?: string;
    readonly onPress: () => void;
    readonly buttonType:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "close"
        | "clear"
        | "filter"
        | "littlePrimary";
    readonly style?: any;
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
    icon,
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
        littlePrimary: {
            backgroundColor: Colors.primaryColor,
            borderRadius: 10,
            padding: 5,
            margin: 2,
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
            {icon && <Ionicons name={icon} size={35} color="white" />}
            <Text style={styles.common}>{text}</Text>
        </TouchableOpacity>
    );
};

export default ButtonComponent;
