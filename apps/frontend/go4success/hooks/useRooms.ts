import { SelectItem } from "@/components/SelectSearch";
import { API_BASE_URL } from "@/constants/ConfigApp";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Room = {
    id: string;
    name: string;
    site: string;
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
            return response.data.map((room: Room) => ({
                label:
                    room.name +
                    " - " +
                    sites.find((site) => site.value === room.site)?.label,
                value: room.id,
            }));
        },
        enabled: sites.length > 0,
    });

    return { isPending, rooms: rooms ?? [], error };
}
