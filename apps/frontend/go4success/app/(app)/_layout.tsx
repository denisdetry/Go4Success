import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";
import Colors from "@/constants/Colors";
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from "@react-navigation/drawer";
import { Image, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function customDrawerContent(props: any) {
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
                        source={require("@/assets/images/adaptive-icon.png")}
                        style={{
                            width: 100,
                            height: 100,
                            resizeMode: "contain",
                            alignSelf: "center",
                        }}
                    />
                </TouchableOpacity>
                <DrawerItemList {...props} />
                <DrawerItem label={t("translationMenu.disconnect")} onPress={signOut} />
            </DrawerContentScrollView>
            <LanguageSwitcher />
        </>
    );
}

export default function Layout() {
    const router = useRouter();
    const { t } = useTranslation();
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={customDrawerContent}
                screenOptions={{
                    drawerHideStatusBarOnOpen: true,
                    drawerActiveBackgroundColor: Colors.primaryColor,
                    drawerActiveTintColor: "#fff",
                    drawerLabelStyle: { marginLeft: -20 },
                    headerStyle: {
                        backgroundColor: Colors.primaryColor,
                    },
                    headerTintColor: "#fff",
                    headerRight: () => (
                        <>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 15,
                                    marginRight: 20,
                                    alignItems: "center",
                                }}
                            >
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
                                        console.log("Open Calendar");
                                        router.push("/calendar");
                                    }}
                                >
                                    <Ionicons name="calendar" size={24} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        console.log("Open profile");
                                        router.push("/profile");
                                    }}
                                >
                                    <Image
                                        source={require("@/assets/images/adaptive-icon.png")}
                                        style={{
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
                            <Ionicons name="home-outline" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="profile"
                    options={{
                        drawerLabel: t("translationMenu.profil"),
                        headerTitle: t("translationMenu.profil"),
                        drawerIcon: ({ size, color }) => (
                            <FontAwesome name="user-circle" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="calendar"
                    options={{
                        drawerLabel: t("translationMenu.calendar"),
                        headerTitle: t("translationMenu.calendar"),
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="calendar" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    
                    name="Gestion des rôles"
                    options={{
                        drawerLabel: "Gestion des rôles",
                        headerTitle: "Gestion des rôles",
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="Gestions des rôles" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
