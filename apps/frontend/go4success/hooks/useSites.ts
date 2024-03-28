import { useQuery } from "@tanstack/react-query";
import { SelectItem } from "@/components/SelectSearch";
import axios from "axios";

type Site = {
    id: string;
    name: string;
};

export function useSites() {
    const {
        isPending,
        data: sites,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["allSites"],
        queryFn: async () => {
            const response = await axios.get<Site[]>(
                "http://localhost:8000/workshops/sites/",
            );
            return response.data.map((site) => ({
                label: site.name,
                value: site.id,
            }));
        },
    });

    return { isPending, sites, error };
}