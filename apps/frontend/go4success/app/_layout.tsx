import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";
import "../locales/i18n";

export const queryClient = new QueryClient();

export default function Layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RootSiblingParent>
                    <Slot />
                    <Toast visibilityTime={2000} config={toastConfig} />
                </RootSiblingParent>
            </AuthProvider>
        </QueryClientProvider>
    );
}
