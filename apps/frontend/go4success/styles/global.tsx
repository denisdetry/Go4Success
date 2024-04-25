import { Platform, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { isMobile, isTablet, isTabletMini, width } from "@/constants/screensWidth";

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
    titleH2NoPadding: {
        fontSize: 22,
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

    inputLargeField: {
        borderWidth: 0.5,
        borderColor: Colors.primaryColor,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        minWidth: Platform.select({ ios: 300, android: 300, default: 600 }),
    },
    inputLargeFieldWithoutBorder: {
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 0,
        minWidth: Platform.select({ ios: 300, android: 300, default: 600 }),
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
    modalViewTitle: {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        width: "100%",
        padding: 10,
    },
    centeredViewModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalView: {
        backgroundColor: Colors.workshopLightColor,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        padding: 20,
        width: "100%",
    },
    modalData: {
        padding: 20,
        width: "100%",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    buttonContainer: {
        paddingTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    closeButtonText: {
        color: "white",
        fontSize: 20,
    },
    separator: {
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    card: {
        borderRadius: 10,
        padding: 12,
        height: 180,
        width: Platform.OS === "web" ? (isMobile ? 280 : 350) : width - 80,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
