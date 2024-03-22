import { AuthProvider } from "@/context/auth";
import { Slot } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";

export default function Layout() {
    return (
        <AuthProvider>
            <RootSiblingParent>
                <Slot />
            </RootSiblingParent>
        </AuthProvider>
    );
}
