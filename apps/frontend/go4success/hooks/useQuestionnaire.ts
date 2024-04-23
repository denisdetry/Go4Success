import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export type Courses = {
    id: string;
    code: string;
    name: string;
};

export function useCourses() {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const {
        isPending,
        data: sites,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["getSites"],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "GET",
                url: "postquestionnaire/viewcourse",
            });

            if (typeof data === "object" && "error" in data) {
                throw new Error(data.error);
            }

            if (error) {
                throw new Error(error);
            }

            return data.map((site: { name: any; id: any }) => ({
                id: site.id,
                code: site.code,
                name: site.name,
            }));
        },
    });

    return { isPending, sites: sites ?? [], error };
}
