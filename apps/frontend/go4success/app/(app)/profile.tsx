import { Image, Platform, ScrollView, Text, View } from "react-native";
import React from "react";
import styles from "@/styles/global";
import { useAuth } from "@/context/auth";
import ChangeUserDataFields from "@/components/ChangeUserDataFields";
import Button from "@/components/ButtonComponent";

import profilePicture from "@/assets/images/profile-picture.jpg";

export default function profile() {
    const { user } = useAuth();

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={[styles.container]}>
                <Text style={[styles.title, { textAlign: "center" }]}>Mon profil</Text>
                <View
                    style={{
                        flexDirection: Platform.OS === "web" ? "row" : "column",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        width: "80%",
                        paddingTop: 40,
                    }}
                >
                    <View>
                        <Image
                            source={profilePicture}
                            style={{
                                borderRadius: 200,
                                borderWidth: 0.5,
                                width: 200,
                                height: 200,
                                resizeMode: "contain",
                                alignSelf: "center",
                            }}
                        />
                        <Button
                            text={"Changer votre photo de profil"}
                            onPress={() => {}}
                            buttonType={"primary"}
                        />
                    </View>

                    {/* Change User data fields */}
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
                    {/* Change user password fields */}
                </View>
            </View>
        </ScrollView>
    );
}
