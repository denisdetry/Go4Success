import React from "react";
import { Text, View } from "react-native";
import axios from "axios";
import styles from "@/styles/global";

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function test() {

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Test</Text>
        </View>
    );
}

