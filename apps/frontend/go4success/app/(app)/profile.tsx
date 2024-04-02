import { ScrollView, Text, View } from "react-native";
import React from "react";
import styles from "@/styles/global";
import { useAuth } from "@/context/auth";
import ChangeUserDataFields from "@/components/ChangeUserDataFields";

export default function profile() {
    const { user } = useAuth();

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Mon profil</Text>
            </View>
            <View style={styles.container}>
                <View style={{ gap: 10 }}>
                    <ChangeUserDataFields
                        label={"Nom d'utilisateur"}
                        dataKey={"username"}
                        data={user.username}
                    />
                    <ChangeUserDataFields
                        label={"Adresse mail"}
                        dataKey={"email"}
                        data={user.email}
                    />
                    <ChangeUserDataFields
                        label={"Nom de famille"}
                        dataKey={"last_name"}
                        data={user.last_name}
                    />
                    <ChangeUserDataFields
                        label={"Prénom"}
                        dataKey={"first_name"}
                        data={user.first_name}
                    />
                    <ChangeUserDataFields
                        label={"Noma"}
                        dataKey={"noma"}
                        data={user.noma}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
