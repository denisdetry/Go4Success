import { useQuery } from "@tanstack/react-query";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export function useCsrfToken() {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    if (Platform.OS === "web") {
        const csrfCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="));

        if (csrfCookie) {
            void AsyncStorage.setItem("csrf_token", csrfCookie.split("=")[1]);
        }
    }

    const { data } = useQuery({
        queryKey: ["csrf_token"],
        queryFn: async () => {
            const response = await fetch(`${backend_url}/` + "auth/csrf_token/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch CSRF token");
            }
        },
        enabled: Platform.OS !== "web",
    });

    if (data !== undefined) {
        void AsyncStorage.setItem("csrf_token", data["csrfToken"]);
    }
}
