import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

export default StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalView: {
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
});