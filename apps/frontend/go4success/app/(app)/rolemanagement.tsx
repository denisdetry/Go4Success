import {View,Text} from 'react-native';
import React from "react";
import styles from "@/styles/global";


export default function profile() {
    return (
        <View style={[styles.mainContainer, { justifyContent: "center" }]}>
            <Text style={styles.title}>gestion des roles</Text>
        </View>
    );
}

