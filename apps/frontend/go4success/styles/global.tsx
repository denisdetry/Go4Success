import { Dimensions, ScaledSize, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

const windowDimensions = Dimensions.get("window");
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        height: windowDimensions.height,
        width: windowDimensions.width,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: "200",
        color: "black",
    },
    containerCard: {
        flex: 1,
        width: windowDimensions.width - windowDimensions.width * 0.13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 20,
    },
    container: {
        width: windowDimensions.width - windowDimensions.width * 0.1,
        padding: 50,
        margin: 30,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        shadowRadius: 5,
        borderRadius: 10,
        shadowColor: "lightgray",
        backgroundColor: "white",
    },
    input: {
        flex: 1,
        color: "#333",
        paddingVertical: 10,
        paddingRight: 10,
        fontSize: 16,
        borderColor: "#777",
        padding: 8,
        margin: 10,
    },

    errorMsg: {
        color: "red",
        fontSize: 14,
    },

    icon: {
        marginLeft: 10,
    },
    heading: {
        alignItems: "center",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
});
