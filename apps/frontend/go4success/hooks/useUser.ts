import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useUser() {

    const { isPending, data: user } = useQuery({
        queryKey: ["current_user"],
        queryFn: async () => {
            try {
                const { data: response } = await fetchBackend({
                    type: "GET",
                    url: "auth/current_user/",
                });
                return response;
            } catch (err) {
                await AsyncStorage.removeItem("accessToken");
                await AsyncStorage.removeItem("refreshToken");
                return null;
            }
        },
    });
    return { isPending, user };
}
