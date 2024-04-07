import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/ConfigApp";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useCsrfToken() {
    const { data } = useQuery({
        queryKey: ["csrf_token"],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/` + "auth/csrf_token/", {
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
    });
    console.log(data?.useCsrfToken);
    if (data !== undefined) {
        void AsyncStorage.setItem("csrf_token", data.useCsrfToken);
    }
}
