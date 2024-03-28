import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { AttendsAndActivitiesProvider } from "@/context/AttendsAndActivities";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RootSiblingParent>
                    <AttendsAndActivitiesProvider>
                        <Slot />
                    </AttendsAndActivitiesProvider>
                </RootSiblingParent>
            </AuthProvider>
        </QueryClientProvider>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RootSiblingParent>
                    <AttendsAndActivitiesProvider>
                        <Slot />
                    </AttendsAndActivitiesProvider>
                </RootSiblingParent>
            </AuthProvider>
        </QueryClientProvider>
    );
}
