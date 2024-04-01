import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";
import { AttendsAndActivitiesProvider } from "@/context/AttendsAndActivities";
import * as React from "react";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";

export default function Layout() {
    return (
        <AuthProvider>
            <AttendsAndActivitiesProvider>
                <Slot />
                <Toast config={toastConfig} />
            </AttendsAndActivitiesProvider>
        </AuthProvider>
    );
}
