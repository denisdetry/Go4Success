import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/components/SelectSearch";
import { fetchBackend } from "@/utils/fetch";

export type Site = {
    id: string;
    name: string;
};

export function useSites(siteId?: string) {
    const {
        isPending,
        data: sites,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["getSites", siteId ?? ""],
        queryFn: async () => {
            const response = await fetchBackend<Site[]>(
                "GET",
                "activities/sites/" + (siteId ? `site/${siteId}/` : ""),
            );

            if (typeof response === "object" && "error" in response) {
                throw new Error(response.error);
            }

            return response.map((site) => ({
                label: site.name,
                value: site.id,
            }));
        },
    });

    return { isPending, sites: sites ?? [], error };
}
