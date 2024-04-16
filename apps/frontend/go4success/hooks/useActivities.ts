import { Room } from "./useRooms";
import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "@/utils/fetchBackend";

export interface Activity {
    id: string;
    name: string;
    room: Room;
    date_start: string;
    date_end: string;
    type: string;
    description: string;
}

export function useActivities(
    endpoint: string,
    searchName: string,
    selectedRoom: string | undefined,
    selectedSite: string | undefined,
    startDateISO: string | null,
    endDateISO: string | null,
) {
    const { isPending, data, error } = useQuery<Activity[]>({
        queryKey: [
            "activities",
            endpoint,
            searchName,
            selectedRoom,
            selectedSite,
            startDateISO,
            endDateISO,
        ],
        queryFn: async () => {
            const { data } = await fetchBackend({
                type: "GET",
                url: `activities/${endpoint}/`,
                params: {
                    name: searchName,
                    room: selectedRoom,
                    site: selectedSite,
                    // eslint-disable-next-line camelcase
                    start_date: startDateISO,
                    // eslint-disable-next-line camelcase
                    end_date: endDateISO,
                },
            });
            return data;
        },
    });
    return { isPending, data: data ?? [], error };
}
