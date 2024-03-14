import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

type ButtonProps = {
    readonly text: string;
    readonly onPress: () => void;
    readonly buttonType:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "close";
};

const Button: React.FC<ButtonProps> = ({ text, onPress, buttonType }) => {
    const styles = StyleSheet.create({
        common: {
            borderRadius: 20,
            padding: 8,
            margin: 5,
            fontWeight: "bold",
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
    });

    return (
        <TouchableOpacity
            style={[styles.common, styles[buttonType]]}
            onPress={onPress}
        >
            <Text style={styles.common}>{text}</Text>
        </TouchableOpacity>
    );
};

export default Button;
