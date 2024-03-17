import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}
