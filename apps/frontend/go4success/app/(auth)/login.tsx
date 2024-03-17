import { View, Text } from "react-native";
import React from "react";
import styles from "@/styles/global";
// import Button from "@/components/Button";
import { Button } from "react-native";
import { useAuth } from "@/context/auth";
import Colors from "@/constants/Colors";

export default function login() {
    const { signIn } = useAuth();

    return (
        <View style={[styles.mainContainer, { justifyContent: "center" }]}>
            <View style={styles.container}>
                <Text style={styles.title}>Connexion</Text>
                {/* add forms */}
                <Button
                    title="Se connecter"
                    color={Colors.primaryColor}
                    onPress={signIn}
                />
            </View>
        </View>
    );
}
