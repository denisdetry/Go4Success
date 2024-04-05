import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";
import "../locales/i18n";
import axiosConfig from "@/constants/axiosConfig";

axiosConfig();
export const queryClient = new QueryClient();

export default function Layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Slot />
                <Toast visibilityTime={2000} config={toastConfig} />
            </AuthProvider>
        </QueryClientProvider>
    );
}
