import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import stylesGlobal from "@/styles/global";
import { useAuth } from "@/context/Auth";
import ChangeUserDataFields from "@/components/userProfile/ChangeUserDataFields";
import Button from "@/components/ButtonComponent";

import profilePicture from "@/assets/images/profile-picture.jpg";
import { ChangeUserPasswordFields } from "@/components/userProfile/ChangeUserPasswordFields";
import { Divider } from "@rneui/themed";
import { isMobile, isTablet, isTabletMini } from "@/constants/screensWidth";
import { useTranslation } from "react-i18next";
import { DeleteUserAccount } from "@/components/userProfile/DeleteUserAccount";

const UserProfileFieldsTitle = ({ title }: { readonly title: string }) => {
    return (
        <>
            <Text style={[stylesGlobal.titleNoPadding, { textAlign: "center" }]}>
                {title}
            </Text>
            <Divider />
        </>
    );
};

export default function Profile() {
    const { user } = useAuth();
    const { t } = useTranslation();
    return (
        <ScrollView contentContainerStyle={stylesGlobal.mainContainer}>
            <View style={stylesGlobal.container}>
                <Text
                    style={[stylesGlobal.title, { fontSize: 30, textAlign: "center" }]}
                >
                    {t("translationProfile.title")}
                </Text>

                <View style={styles.userProfileContainer}>
                    {/* User profile picture */}
                    <View style={styles.userProfileFields}>
                        <UserProfileFieldsTitle
                            title={t("translationProfile.profilePictureTitle")}
                        />
                        <Image
                            source={profilePicture}
                            style={styles.userProfilePicture}
                        />
                        <Button
                            text={t("translationProfile.changeProfilePictureButton")}
                            onPress={() => {}}
                            buttonType={"primary"}
                        />
                    </View>

                    {/* Change User data fields */}
                    <View style={styles.userProfileFields}>
                        <UserProfileFieldsTitle
                            title={t("translationProfile.userInfoTitle")}
                        />
                        <ChangeUserDataFields
                            label={t("translationProfile.username")}
                            dataKey={"username"}
                            data={user.username}
                        />
                        <ChangeUserDataFields
                            label={t("translationProfile.email")}
                            dataKey={"email"}
                            data={user.email}
                        />
                        <ChangeUserDataFields
                            label={t("translationProfile.lastName")}
                            dataKey={"last_name"}
                            data={user.last_name}
                        />
                        <ChangeUserDataFields
                            label={t("translationProfile.firstName")}
                            dataKey={"first_name"}
                            data={user.first_name}
                        />
                        <ChangeUserDataFields
                            label={t("translationProfile.noma")}
                            dataKey={"noma"}
                            data={user.noma}
                        />
                    </View>

                    {/* Change user password fields */}
                    <View style={styles.userProfileFields}>
                        <UserProfileFieldsTitle
                            title={t("translationProfile.passwordTitle")}
                        />
                        <ChangeUserPasswordFields />
                    </View>

                    {/* Delete user container */}
                    <View style={styles.userProfileFields}>
                        <UserProfileFieldsTitle
                            title={t("translationProfile.deleteUserTitle")}
                        />

                        <DeleteUserAccount />
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
        alignContent: "center",
        justifyContent: "space-evenly",
        width: "100%",
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
        alignSelf: Platform.OS === "web" ? "auto" : "center",
        gap: 10,
    },
});
