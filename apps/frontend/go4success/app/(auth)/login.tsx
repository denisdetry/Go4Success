import { Text, View } from "react-native";
import React from "react";
import styles from "@/styles/global";
import Button from "@/components/Button";
import { useAuth } from "@/context/auth";

export default function login() {
    const { signIn } = useAuth();

    return (
        <View style={[styles.mainContainer, { justifyContent: "center" }]}>
            <View style={styles.container}>
                <Text style={styles.title}>Connexion</Text>
                {/* add forms */}
                <Button text="Se connecter" onPress={signIn} buttonType={"primary"} />
            </View>
        </View>
    );
}
