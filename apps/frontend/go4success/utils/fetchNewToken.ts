import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "i18next";
import { fetchError } from "./fetchError";

export async function fetchNewToken() {
    const backendUrl = process.env.EXPO_PUBLIC_API_URL;
    const token = await AsyncStorage.getItem("refreshToken");
    const response = await fetch(`${backendUrl}/auth/refresh_token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: token }),
    });

    if (response.ok) {
        const responseData = await response.json();
        await AsyncStorage.setItem("accessToken", responseData.access);
    } else {
        throw new fetchError(
            t("translationProfile.defaultErrorMessage"),
            response,
        );
    }
}
