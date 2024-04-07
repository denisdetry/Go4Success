import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/components/SelectSearch";
import { API_BASE_URL } from "@/constants/ConfigApp";
import axios from "axios";

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
            const response = await axios.get<Site[]>(
                `${API_BASE_URL}/activities/sites/`,
                {
                    params: { id: siteId },
                },
            );
            return response.data.map((site) => ({
                label: site.name,
                value: site.id,
            }));
        },
    });

    return { isPending, sites: sites ?? [], error };
}
