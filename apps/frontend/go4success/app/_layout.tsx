import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";

import { AttendsAndActivitiesProvider } from "@/context/AttendsAndActivities";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../i18n";
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient();
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";


export default function Layout() {

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AttendsAndActivitiesProvider>
                    <Slot />
                    <Toast visibilityTime={2000} config={toastConfig} />
                </AttendsAndActivitiesProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
