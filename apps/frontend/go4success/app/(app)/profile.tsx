import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import stylesGlobal from "@/styles/global";
import { useAuth } from "@/context/auth";
import ChangeUserDataFields from "@/components/userProfile/ChangeUserDataFields";
import Button from "@/components/ButtonComponent";

import profilePicture from "@/assets/images/profile-picture.jpg";
import { ChangeUserPasswordFields } from "@/components/userProfile/ChangeUserPasswordFields";
import { Divider } from "@rneui/themed";
import { isMobile, isTablet, isTabletMini } from "@/constants/screensWidth";

const UserProfileFieldsTitle = ({ title }: { readonly title: string }) => {
    return (
        <>
            <Text style={[stylesGlobal.title, { textAlign: "center" }]}>{title}</Text>
            <Divider />
        </>
    );
};
export default function profile() {
    const { user } = useAuth();

    return (
        <ScrollView contentContainerStyle={stylesGlobal.mainContainer}>
            <View style={stylesGlobal.container}>
                <Text
                    style={[stylesGlobal.title, { fontSize: 30, textAlign: "center" }]}
                >
                    Mon profil
                </Text>

                <View style={styles.userProfileContainer}>
                    {/* User profile picture */}
                    <View style={styles.userProfileFields}>
                        <UserProfileFieldsTitle title={"Photo de profil"} />
                        <Image
                            source={profilePicture}
                            style={styles.userProfilePicture}
                        />
                        <Button
                            text={"Changer votre photo de profil"}
                            onPress={() => {}}
                            buttonType={"primary"}
                        />
                    </View>

                    {/* Change User data fields */}
                    <View style={styles.userProfileFields}>
                        <UserProfileFieldsTitle title={"Informations personnelles"} />
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
                    <View style={styles.userProfileFields}>
                        <UserProfileFieldsTitle title={"Mot de passe"} />
                        <ChangeUserPasswordFields />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    userProfileContainer: {
        flexDirection:
            Platform.OS !== "web" || isMobile || isTablet || isTabletMini
                ? "column"
                : "row",
        alignItems: "flex-start",
        justifyContent: "space-evenly",
        width: "80%",
        paddingTop: 40,
        gap: 40,
        flexWrap: "wrap",
    },
    userProfilePicture: {
        borderRadius: 200,
        borderWidth: 0.5,
        width: 200,
        height: 200,
        resizeMode: "contain",
        alignSelf: "center",
    },

    userProfileFields: {
        gap: 10,
    },
});
