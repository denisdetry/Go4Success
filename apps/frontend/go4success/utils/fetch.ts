import { API_BASE_URL } from "@/constants/ConfigApp";
import AsyncStorage from "@react-native-async-storage/async-storage";

function constructPath(params: string[]): string {
    return params.join("/") + "/";
}

export async function fetchBackend<T extends any>(
    type: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    url: string,
    data?: any,
) {
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
            return (await response.json()) as Promise<T>;
        } else {
            return { error: "Something went wrong once!" };
        }
    } catch (error) {
        return { error: "Something went wrong twice!" };
    }
}
