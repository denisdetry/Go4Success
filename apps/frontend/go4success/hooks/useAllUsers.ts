import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export default function useAllUsers() {
    const { isPending, data: allUsers } = useQuery({
        queryKey: ["all_users"],
        queryFn: async () => {
            try {
                const { data: response } = await fetchBackend({
                    type: "GET",
                    url: "auth/all_users/",
                });
                return response;
            } catch (err) {
                return null;
            }
        },
    });
    return { isPending, allUsers };
}
