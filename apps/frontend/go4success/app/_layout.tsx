import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { AttendsAndActivitiesProvider } from "@/context/AttendsAndActivities";
import "../i18n";
import { useTranslation } from "react-i18next";

export default function Layout() {
    return (
        <AuthProvider>
            <RootSiblingParent>
                <AttendsAndActivitiesProvider>
                    <Slot />
                </AttendsAndActivitiesProvider>
            </RootSiblingParent>
        </AuthProvider>
    );
}
