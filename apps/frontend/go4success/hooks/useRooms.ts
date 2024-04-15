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

export function useRooms(siteId: string | undefined) {
    console.log("key", siteId);
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
                key: room.id,
                value: room.name + " - " + room.site.name,
            }));
        },
    });

    return { isPending, rooms: rooms ?? [], error };
}
