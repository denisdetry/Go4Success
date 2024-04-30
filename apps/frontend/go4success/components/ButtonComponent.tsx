import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
    icon,
    text,
    onPress,
    buttonType,
}) => {
    const styles = StyleSheet.create({
        common: {
            borderRadius: 20,
            padding: 8,
            margin: 5,
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
            borderRadius: 0,
            padding: 2,
            margin: 4,
            width: 160,
        },
        clear: {
            backgroundColor: Colors.primaryColor,
            borderRadius: 0,
            padding: 0,
            margin: 10,
            marginTop: -25,
        },
    });

    return (
        <TouchableOpacity style={[styles.common, styles[buttonType]]} onPress={onPress}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icon && <Ionicons name={icon} size={35} color="white" />}
                <Text style={styles.common}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ButtonComponent;
