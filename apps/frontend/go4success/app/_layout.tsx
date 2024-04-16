import { Slot } from "expo-router";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";
import "../locales/i18n";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import axiosConfig from "@/constants/axiosConfig";
import { useCsrfToken } from "@/hooks/useCsrfToken";

axiosConfig();

export const queryClient = new QueryClient();

export default function Layout() {
    useCsrfToken();
    return (
        <QueryClientProvider client={queryClient}>
            <Slot />
            <Toast visibilityTime={2000} config={toastConfig} />
        </QueryClientProvider>
    );
}
