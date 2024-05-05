import { ScrollView, Text } from "react-native";
import React from "react";
import styles from "@/styles/global";

export default function Calendar() {
    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <Text style={styles.title}>Mon calendrier</Text>
        </ScrollView>
    );
}
