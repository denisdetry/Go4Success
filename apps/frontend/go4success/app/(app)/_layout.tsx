import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";
import Colors from "@/constants/Colors";
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from "@react-navigation/drawer";
import { Image, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

function customDrawerContent(props: any) {
    const router = useRouter();
    const { signOut } = useAuth();
    return (
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
            <DrawerItem label={"Se déconnecter"} onPress={signOut} />
        </DrawerContentScrollView>
    );
}

export default function Layout() {
    const router = useRouter();
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={customDrawerContent}
                screenOptions={{
                    drawerHideStatusBarOnOpen: true,
                    drawerActiveBackgroundColor: Colors.primaryColor,
                    drawerActiveTintColor: "#fff",
                    drawerLabelStyle: { marginLeft: -20 },
                    headerStyle: { backgroundColor: Colors.primaryColor },
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
                        drawerLabel: "Accueil",
                        headerTitle: "Go4success",
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="home-outline" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="profile"
                    options={{
                        drawerLabel: "Mon profil",
                        headerTitle: "Mon profil",
                        drawerIcon: ({ size, color }) => (
                            <FontAwesome name="user-circle" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    name="calendar"
                    options={{
                        drawerLabel: "Mon calendrier",
                        headerTitle: "Mon calendrier",
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="calendar" size={size} color={color} />
                        ),
                    }}
                />

                <Drawer.Screen
                    
                    name="roleManagement"
                    options={{
                        drawerLabel: "Gestion des rôles",
                        headerTitle: "Gestion des rôles",
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="calendar" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
