// import Button from "@/components/Button";
import { Text, View } from "react-native";
import Button from "@/components/Button";
import React from "react";
import styles from "@/styles/global";
import { useAuth } from "@/context/auth";

export default function register() {
    const { signIn } = useAuth();

    return (
        <View style={[styles.mainContainer, { justifyContent: "center" }]}>
            <View style={styles.container}>
                <Text style={styles.title}>Inscription</Text>
                {/* add forms */}
                <Button text="S'inscrire" onPress={signIn} buttonType={"primary"} />
            </View>
        </View>
    );
}
