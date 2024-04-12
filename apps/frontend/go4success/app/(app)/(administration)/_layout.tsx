import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";


export default function adminLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="rolemanagement" options={{
                title: t("translationMenu.rolemanagement"),
                tabBarIcon: ({ size, color }) => (
                    <Ionicons name="people" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="test" options={{
                title: "Test",
                tabBarIcon: ({ size, color }) => (
                    <Ionicons name="cloud" size={size} color={color} />
                ),
            }} />
        </Tabs>
    );
}