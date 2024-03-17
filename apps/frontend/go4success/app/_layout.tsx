import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";

export default function Layout() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}
