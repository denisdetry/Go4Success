import { Platform, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { isMobile, isTablet, isTabletMini } from "@/constants/screensWidth";

export default StyleSheet.create({
    mainContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
    },
    titleContainer: {
        width: "90%",
        alignContent: "flex-start",
        marginHorizontal: 20,
        marginTop: 20,
        padding: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "500",
        paddingBottom: 10,
    },
    titleNoPadding: {
        fontSize: 28,
        fontWeight: "500",
    },
    text: {
        fontSize: 16,
        fontWeight: "200",
        color: "black",
    },
    containerCard: {
        width: "100%",
        maxWidth:
            Platform.OS === "web"
                ? isMobile
                    ? 360
                    : isTabletMini
                      ? 360
                      : isTablet
                        ? 710
                        : 1435
                : 1435, // isDesktop for the last one
        paddingBottom: 20,
    },
    container: {
        width: "90%",
        borderRadius: 10,
        shadowRadius: 3,
        shadowColor: "lightgray",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "flex-start",
        paddingVertical: Platform.OS === "web" ? 30 : 20,
        paddingHorizontal: 20,
        margin: 20,
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
