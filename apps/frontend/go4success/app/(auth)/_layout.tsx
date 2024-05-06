import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "@/context/Auth";

export default function Layout() {
    const { t } = useTranslation();
    return (
        <AuthProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors.primaryColor,
                }}
            >
                <Tabs.Screen
                    name="login"
                    options={{
                        title: t("translateLogin.title"),
                        tabBarIcon: ({ size, color }) => (
                            <FontAwesome5
                                name="users"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="register"
                    options={{
                        title: t("translateRegister.title"),
                        tabBarIcon: ({ size, color }) => (
                            <FontAwesome6
                                name="pen-fancy"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </AuthProvider>
    );
}
