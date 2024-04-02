import {
    ErrorToast,
    InfoToast,
    SuccessToast,
    ToastConfigParams,
} from "react-native-toast-message";
import { Dimensions, Platform, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { isMobile, isTablet, isTabletMini } from "@/constants/screensWidth";

const styles = StyleSheet.create({
    main: {
        marginTop: Platform.OS === "web" ? 30 : 65,
        maxWidth: Dimensions.get("screen").width,
        width:
            Platform.OS === "web"
                ? isMobile
                    ? "80%"
                    : isTablet
                      ? "70%"
                      : isTabletMini
                        ? "50%"
                        : "30%"
                : "80%", // real Mobile IOS and Android
    },
    success: {
        borderLeftColor: Colors.appointmentColor,
    },
    error: {
        borderLeftColor: Colors.importantColor,
    },
    info: {
        borderLeftColor: Colors.warningColor,
    },
    text1: {
        fontSize: 18,
        fontWeight: "400",
    },
    text2: {
        fontSize: 14,
        fontWeight: "200",
    },
});

export const toastConfig = {
    /*
      Overwrite 'success' type,
    */
    success: (props: ToastConfigParams<any>) => (
        <SuccessToast
            {...props}
            style={[styles.main, styles.success]}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
        />
    ),
    /*
      Overwrite 'error' type,
    */
    error: (props: ToastConfigParams<any>) => (
        <ErrorToast
            {...props}
            style={[styles.main, styles.error]}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
        />
    ),
    /*
        Overwrite 'info' type,
    */
    info: (props: ToastConfigParams<any>) => (
        <InfoToast
            {...props}
            style={[styles.main, styles.info]}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
        />
    ),
};
