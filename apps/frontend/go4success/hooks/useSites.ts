import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/components/SelectSearch";
import axios from "axios";
import { API_BASE_URL } from "@/constants/ConfigApp";

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
        queryKey: ["allSites"],
        queryFn: async () => {
            const response = await axios.get<Site[]>(
                `${API_BASE_URL}/activities/sites/`,
                {
                    params: { id: siteId },
                },
            );
            return response.data.map((site) => ({
                key: site.id,
                value: site.name,
            }));
        },
    });

    return { isPending, sites: sites ?? [], error };
}
