import { ScrollView, Text } from "react-native";
import React from "react";
import styles from "@/styles/global";

export default function feedbackdetails() {
    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <Text style={styles.title}>feedback details</Text>
        </ScrollView>
    );
}
