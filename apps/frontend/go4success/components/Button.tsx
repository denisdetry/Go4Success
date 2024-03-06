import React from "react";
import Colors from "../constants/Colors";

type ButtonProps = {
    text: string;
    onClick: () => void;
    buttonType: "primary" | "secondary" | "success" | "danger" | "close";
};

const Button: React.FC<ButtonProps> = ({ text, onClick, buttonType }) => {
    const commonStyles = {
        borderRadius: 20,
        elevation: 2,
        padding: 20,
        paddingHorizontal: 40,
        margin: 5,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
        fontSize: 16,
        border: "none",
        outline: "none",
        cursor: "pointer",
    };

    const buttonStyles = {
        primary: {
            ...commonStyles,
            backgroundColor: Colors.primaryColor,
        },
        secondary: {
            ...commonStyles,
            backgroundColor: Colors.secondaryColor,
        },
        close: {
            ...commonStyles,
            backgroundColor: Colors.importantColor,
        },
        success: {
            ...commonStyles,
            backgroundColor: Colors.appointmentColor,
        },
        danger: {
            ...commonStyles,
            backgroundColor: Colors.importantColor,
        },
    };

    return (
        <button
            className={`button button-${buttonType}`}
            onClick={onClick}
            style={buttonStyles[buttonType] as React.CSSProperties}
        >
            {text}
        </button>
    );
};

export default Button;
