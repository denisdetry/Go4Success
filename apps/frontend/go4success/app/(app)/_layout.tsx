import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "@/context/Auth";
import Colors from "@/constants/Colors";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Image, Platform, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import profilePicture from "@/assets/images/profile-picture.jpg";
import useUser from "@/hooks/useUser";

function CustomDrawerContent(props: any) {
    const router = useRouter();
    const { t } = useTranslation();
    const { signOut } = useAuth();

    return (
        <>
            <DrawerContentScrollView {...props} scrollEnabled={false}>
                <TouchableOpacity
                    style={{ padding: 20 }}
                    onPress={() => router.push("/profile")}
                >
                    <Image
                        source={profilePicture}
                        style={{
                            borderRadius: 100,
                            borderWidth: 0.5,
                            width: 100,
                            height: 100,
                            resizeMode: "contain",
                            alignSelf: "center",
                        }}
                    />
                </TouchableOpacity>
                <DrawerItemList {...props} />
                <DrawerItem
                    label={t("translationMenu.disconnect")}
                    onPress={signOut}
                />
            </DrawerContentScrollView>
            {Platform.OS === "web" && <LanguageSwitcher />}
        </>
    );
}

export default function Layout() {
    const router = useRouter();

    const { user } = useUser();

    const { t } = useTranslation();
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <Drawer
                    drawerContent={CustomDrawerContent}
                    screenOptions={{
                        drawerHideStatusBarOnOpen: true,
                        drawerActiveBackgroundColor: Colors.primaryColor,
                        drawerActiveTintColor: "#fff",
                        drawerLabelStyle: { marginLeft: -20 },
                        headerStyle: {
                            backgroundColor: Colors.primaryColor,
                        },
                        headerTintColor: "#fff",
                        headerTitleStyle: {
                            display: "none",
                        },
                        headerRight: () => (
                            <>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        gap: 5,
                                        marginRight: 20,
                                        alignItems: "center",
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            router.push("/");
                                        }}
                                    >
                                        <Ionicons
                                            name="home"
                                            size={24}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log("Open notifications");
                                        }}
                                    >
                                        <Ionicons
                                            name="notifications"
                                            size={24}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            router.push("/calendar");
                                        }}
                                    >
                                        <Ionicons
                                            name="calendar"
                                            size={24}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            router.push("/profile");
                                        }}
                                    >
                                        <Image
                                            source={profilePicture}
                                            style={{
                                                borderRadius: 50,
                                                marginLeft: 10,
                                                width: 50,
                                                height: 50,
                                                resizeMode: "contain",
                                                alignSelf: "center",
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </>
                        ),
                    }}
                >
                    <Drawer.Screen
                        name="index"
                        options={{
                            drawerLabel: t("translationMenu.home"),
                            headerTitle: "Go4success",
                            drawerIcon: ({ size, color }) => (
                                <Ionicons
                                    name="home-outline"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="profile"
                        options={{
                            drawerLabel: t("translationMenu.profile"),
                            headerTitle: t("translationMenu.profile"),
                            drawerIcon: ({ size, color }) => (
                                <FontAwesome
                                    name="user-circle"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="calendar"
                        options={{
                            drawerLabel: t("translationMenu.calendar"),
                            headerTitle: t("translationMenu.calendar"),
                            drawerIcon: ({ size, color }) => (
                                <Ionicons
                                    name="calendar"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="rolemanagement"
                        options={{
                            drawerItemStyle: {
                                display: user?.is_superuser ? "flex" : "none",
                            },
                            drawerLabel: t("translationMenu.roleManagement"),
                            headerTitle: t("translationMenu.roleManagement"),
                            drawerIcon: ({ size, color }) => (
                                <Ionicons
                                    name="people"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="activities/add"
                        options={{
                            drawerItemStyle: {
                                display:
                                    user?.is_superuser || user?.isStaff
                                        ? "flex"
                                        : "none",
                            },
                            drawerLabel: t(
                                "translationMenu.activityManagement",
                            ),
                            headerTitle: t(
                                "translationMenu.activityManagement",
                            ),
                            drawerIcon: ({ size, color }) => (
                                <Ionicons
                                    name="school"
                                    size={size}
                                    color={color}
                                />
                            ),
                        }}
                    />
                </Drawer>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
