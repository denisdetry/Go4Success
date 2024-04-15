import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/components/SelectSearch";
import axios from "axios";

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
        queryKey: ["allSites"],
        queryFn: async () => {
            const response = await axios.get<Site[]>(
                `${backend_url}/activities/sites/`,
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
