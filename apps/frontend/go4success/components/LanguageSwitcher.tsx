import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import images from "@/assets";

function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const switchLanguage = (lng: string | undefined) => {
        void i18n.changeLanguage(lng);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => switchLanguage("en")}
            >
                <Image source={images.enFlag} style={styles.flag} />
                <Text style={styles.buttonText}>En </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => switchLanguage("fr")}
            >
                <Image source={images.frFlag} style={styles.flag} />
                <Text style={styles.buttonText}>Fr</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 10,
    },
    buttonText: {
        marginLeft: 10,
    },
    flag: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
});

export default LanguageSwitcher;
