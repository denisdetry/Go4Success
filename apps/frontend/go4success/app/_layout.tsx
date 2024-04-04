import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../locales/i18n";

export default function Layout() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RootSiblingParent>
                    <Slot />
                </RootSiblingParent>
            </AuthProvider>
        </QueryClientProvider>
    );
}
