import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primaryColor,
            }}
        >
            <Tabs.Screen
                name="login"
                options={{
                    title: "Connexion",
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome5 name="users" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="register"
                options={{
                    title: "Inscription",
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome6 name="pen-fancy" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
