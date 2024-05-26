import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchError } from "@/utils/fetchError";
import { t } from "i18next";

/**
 * Fetch data from the backend with the given options and return the response else throw an error
 * Also manage the token for the request if it exists in the AsyncStorage
 * @param options Options for the fetch request:
 * type: Type of the request (POST, GET, PUT, PATCH, DELETE, OPTIONS)
 * url: endpoint to fetch data from
 * params: query parameters for the request
 * data: data to send with the request
 */
export async function fetchBackend(options: {
    readonly type: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    url: string;
    readonly params?: any;
    readonly data?: any;
}): Promise<any> {
    const backendUrl = process.env.EXPO_PUBLIC_API_URL;
    const { type, params, data } = options;
    let { url } = options;

    const token = await AsyncStorage.getItem("accessToken");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    if (params && type === "GET") {
        url += "?";
        Object.keys(params).forEach((key, index) => {
            if (params[key] !== undefined) {
                url += `${key}=${params[key]}`;
                if (index < Object.keys(params).length - 1) {
                    url += "&";
                }
            }
        });
    }

    const response = await fetch(`${backendUrl}/` + url, {
        method: type,
        credentials: "include",
        headers,
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
        throw new fetchError(
            t("translationProfile.defaultErrorMessage"),
            response,
        );
    }
}
