import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import styles from "@/styles/global";
import { useAuth } from "@/context/auth";
import ChangeUserDataFields from "@/components/ChangeUserDataFields";

export default function profile() {
    const { user } = useAuth();
    const [editable, setEditable] = useState(false);
    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Mon profil</Text>
            </View>
            <View style={styles.container}>
                <View style={{ gap: 10 }}>
                    <ChangeUserDataFields
                        label={"Nom d'utilisateur"}
                        data={user.username}
                        query={""}
                    />
                    <ChangeUserDataFields
                        label={"Adresse mail"}
                        data={user.email}
                        query={""}
                    />
                    <ChangeUserDataFields
                        label={"Nom de famille"}
                        data={user.last_name}
                        query={""}
                    />
                    <ChangeUserDataFields
                        label={"Prénom"}
                        data={user.first_name}
                        query={""}
                    />
                    <ChangeUserDataFields label={"Noma"} data={user.noma} query={""} />
                </View>
            </View>
        </ScrollView>
    );
}
