import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export default function useAllExpoTokens() {
    const { isPending, data: allExpoTokens } = useQuery({
        queryKey: ["all_expo_tokens"],
        queryFn: async () => {
            try {
                const { data: response } = await fetchBackend({
                    type: "GET",
                    url: "auth/expo_token/",
                });
                return response;
            } catch (err) {
                return null;
            }
        },
    });
    return { isPending, allExpoTokens };
}
