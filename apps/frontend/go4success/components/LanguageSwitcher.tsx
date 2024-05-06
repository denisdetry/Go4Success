import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import enFlag from "@/assets/images/flags/flag_en.png";
import frFlag from "@/assets/images/flags/flag_fr.png";

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
                <Image source={enFlag} style={styles.flag} />
                <Text style={styles.buttonText}>EN </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => switchLanguage("fr")}
            >
                <Image source={frFlag} style={styles.flag} />
                <Text style={styles.buttonText}>FR</Text>
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
        margin: 3,
    },
    buttonText: {
        marginLeft: 0,
    },
    flag: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
});

export default LanguageSwitcher;
