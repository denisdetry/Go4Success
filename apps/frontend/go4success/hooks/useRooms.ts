import { SelectItem } from "@/components/SelectSearch";
import { API_BASE_URL } from "@/constants/ConfigApp";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Site } from "@/hooks/useSites";

export type Room = {
    id: string;
    name: string;
    site: Site;
};

export function useRooms(siteId: string | undefined, sites: SelectItem[]) {
    const {
        isPending,
        data: rooms,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["rooms", siteId],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/activities/rooms/` + (siteId ? `site/${siteId}/` : ""),
            );
            if (siteId === undefined) {
                return response.data.map((room: Room) => ({
                    key: room.id,
                    value: room.name + " - " + room.site,
                }));
            }

            return response.data.map((room: Room) => ({
                key: room.id,
                value: room.name + " - " + room.site.name,
                //sites.find((site) => site.value === room.site.name)?.value,
            }));
        },
        enabled: sites.length > 0,
    });

    return { isPending, rooms: rooms ?? [], error };
}
