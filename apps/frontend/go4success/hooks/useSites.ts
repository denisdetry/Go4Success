import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/components/SelectSearch";
import { fetchBackend } from "@/utils/fetchBackend";

export type Site = {
    id: string;
    name: string;
};

export function useSites(siteId?: string) {
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    const {
        isPending,
        data: sites,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["getSites", siteId ?? ""],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "GET",
                url: "activities/sites/" + (siteId ? `site/${siteId}/` : ""),
            });

            if (typeof data === "object" && "error" in data) {
                throw new Error(data.error);
            }

            if (error) {
                throw new Error(error);
            }

            return data.map((site: { name: any; id: any }) => ({
                label: site.name,
                value: site.id,
            }));
        },
    });

    return { isPending, sites: sites ?? [], error };
}
