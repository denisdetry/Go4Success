import { Dimensions, ScaledSize, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import Colors from "@/constants/Colors";

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

    form: {
        flex: 1,
        gap: 15,
        justifyContent: "center",
    },

    inputField: {
        flex: 1,
        shadowRadius: 2,
        shadowColor: "#000",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },

    input: {
        flex: 1,
        color: "#333",
        fontSize: 16,
        borderColor: "#777",
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
    containerDatePicker: {
        flex: 1,
        backgroundColor: "#F5FCFF",
    },
    picker: {
        height: 50,
        width: "100%",
        backgroundColor: "#fafafa",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
    },
    inputLittle: {
        height: 50,
        width: "100%",
        backgroundColor: "#fafafa",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        padding: 10,
    },
});
