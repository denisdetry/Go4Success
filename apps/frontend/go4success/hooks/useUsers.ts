import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    noma: string;
}

export function useUsers() {
    const { isPending, data, error } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: "auth/user_profile",
            });
            console.log("resp:", data);
            return data;
        },
    });
    return { isPending, users: data ?? [], error };
}
