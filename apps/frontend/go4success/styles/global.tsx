import { Dimensions, Platform, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

const { width, height } = Dimensions.get("screen");
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
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
        padding: 15,
    },
    container: {
        width: "90%",
        borderRadius: 10,
        shadowRadius: 5,
        shadowColor: "lightgray",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        padding: 50,
        margin: 30,
    },

    form: {
        gap: 10,
        justifyContent: "center",
    },

    inputField: {
        borderWidth: 0.5,
        borderColor: Colors.primaryColor,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        minWidth: 300,
    },

    input: {
        flex: 1,
        color: "#333",
        fontSize: 16,
        borderColor: "#777",
        padding: 10,
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
