import { API_BASE_URL } from "@/constants/ConfigApp";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function fetchBackend(
    type: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    url: string,
    data?: any,
): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/` + url, {
            method: type,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": await AsyncStorage.getItem("csrf_token"),
            },
            ...(data && { body: JSON.stringify(data) }),
        });

        if (response.ok) {
            const responseData = await response.json();

            if (responseData !== undefined) {
                return { data: responseData };
            } else {
                return { data: "success" };
            }
        } else {
            return { error: response };
        }
    } catch (error) {
        return { error: "Something went wrong!" };
    }
}
