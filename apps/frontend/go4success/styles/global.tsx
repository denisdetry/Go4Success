import { Dimensions, StyleSheet } from "react-native";
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
        flex: 1,
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
