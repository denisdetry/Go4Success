import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { User } from "@/types/User";

export type UserEdit = Omit<
    User,
    | "password"
    | "email"
    | "noma"
    | "dateJoin"
    | "lastLogin"
    | "groups"
    | "userPermissions"
>;

type UserImport = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
};

export function useUsers() {
    const { isPending, data, error } = useQuery<UserEdit[]>({
        queryKey: ["users"],
        queryFn: async () => {
            try {
                const { data } = await fetchBackend({
                    type: "GET",
                    url: "rolemanagement/users",
                });

                return data.map((user: UserImport) => ({
                    id: user.id,
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    isActive: user.is_active,
                    isStaff: user.is_staff,
                    isSuperuser: user.is_superuser,
                }));
            } catch (err) {
                return [];
            }
        },
    });
    return { isPending, users: data ?? [], error };
}
