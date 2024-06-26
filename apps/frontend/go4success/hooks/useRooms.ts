import { SelectItem } from "@/types/SelectItem";
import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";
import { Site } from "@/hooks/useSites";
import { useTranslation } from "react-i18next";

export type Room = {
    id: string;
    name: string;
    site: Site;
};

/**
 * Fetch rooms from the backend and return the response
 * @param siteId Site ID to fetch rooms from if not provided fetch all rooms from all sites
 * @param allValues Boolean to include a value for "all" rooms in the response (no key, and value is "All")
 */
export function useRooms(
    siteId: string | undefined,
    allValues: boolean = false,
) {
    const { t } = useTranslation();

    const {
        isPending,
        data: rooms,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["rooms", siteId],
        queryFn: async () => {
            const { data, error } = await fetchBackend({
                type: "GET",
                url: "activities/rooms/" + (siteId ? `site/${siteId}/` : ""),
            });

            if (error) {
                return [
                    {
                        key: "error",
                        value: "Error fetching rooms",
                    },
                ];
            }
            const roomsList = data.map((room: Room) => ({
                key: room.id,
                value: room.name + " - " + room.site.name,
            }));

            if (roomsList.length === 0) {
                return [
                    {
                        key: "empty",
                        value: t("translationHooks.NoRoomsFound"),
                    },
                ];
            }

            if (allValues) {
                return [
                    { key: "", value: t("translationHooks.AllValuesF") },
                    ...roomsList,
                ];
            } else {
                return roomsList;
            }
        },
    });

    return { isPending, rooms: rooms ?? [], error };
}
