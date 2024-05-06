import { Platform, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

export default StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: Platform.OS === "web" ? "center" : undefined,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalView: {
        position: "relative",
        margin: "auto",
        backgroundColor: Colors.lightBackgroundColor,
        padding: 20,
        borderRadius: 10,
    },
    modalText: {
        gap: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
});