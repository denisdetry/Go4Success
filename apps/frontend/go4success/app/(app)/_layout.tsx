import React from "react";
import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
    DrawerToggleButton,
} from "@react-navigation/drawer";

function customDrawerContent(props: any) {
    const router = useRouter();
    const { signOut } = useAuth();
    return (
        <DrawerContentScrollView {...props} scrollEnabled={false}>
            <DrawerItemList {...props} />
            <DrawerItem label={"Se déconnecter"} onPress={signOut} />
        </DrawerContentScrollView>
    );
}

export default function Layout() {
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
            </Drawer>
        </GestureHandlerRootView>
    );
}
