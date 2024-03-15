import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Drawer>
                <Drawer.Screen
                    name="index"
                    options={
                        {
                            drawerLabel: "Home",
                            title: "Home",
                        }
                    }
                />
                <Drawer.Screen
                    name="workshops"
                    options={
                        {
                            drawerLabel: "Workshops",
                            title: "Workshops",
                        }
                    }
                />
                <Drawer.Screen
                    name="Page"
                    options={
                        {
                            drawerLabel: "Profile",
                            title: "Profile",
                            drawerItemStyle: { display: "none" },
                        }
                    }
                />
            </Drawer>
        </GestureHandlerRootView>
    )
}
