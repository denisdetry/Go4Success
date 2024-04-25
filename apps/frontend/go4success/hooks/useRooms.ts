import { SelectItem } from "@/components/SelectSearch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Site } from "@/hooks/useSites";

export type Room = {
    id: string;
    name: string;
    site: Site;
};

export function useRooms(siteId: string | undefined) {
    const backendUrl = process.env.EXPO_PUBLIC_API_URL;
    const {
        isPending,
        data: rooms,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["rooms", siteId],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/activities/rooms/` +
                        (siteId ? `site/${siteId}/` : ""),
                );

                return response.data.map((room: Room) => ({
                    key: room.id,
                    value: room.name + " - " + room.site.name,
                }));
            } catch (error) {
                return [
                    {
                        key: "error",
                        value: "Error fetching rooms",
                    },
                ];
            }
        },
    });

    return { isPending, rooms: rooms ?? [], error };
}
