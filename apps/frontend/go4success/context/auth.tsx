import * as React from "react";
import { useRouter, useSegments } from "expo-router";

const AuthContext = React.createContext<any>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
    const rootSegment = useSegments()[0];
    const router = useRouter();
    const [user, setUser] = React.useState<string | undefined>("Artak");

    React.useEffect(() => {
        if (user === undefined) return;

        if (!user && rootSegment !== "(auth)") {
            router.replace("/(auth)/login");
        } else if (user && rootSegment !== "(app)") {
            router.replace("/");
        }
    }, [user, rootSegment]);

    return (
        <AuthContext.Provider
            value={{
                user: user,
                signIn: () => {
                    setUser("Artak");
                },
                signOut: () => {
                    setUser("");
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
