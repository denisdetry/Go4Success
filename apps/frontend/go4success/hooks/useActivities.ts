import { Room } from "./useRooms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
    const backend_url = process.env.EXPO_PUBLIC_API_URL;

    return useQuery<Activity[]>({
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
            const response = await axios.get(`${backend_url}/activities/${endpoint}/`, {
                params: {
                    name: searchName,
                    room: selectedRoom,
                    site: selectedSite,
                    // eslint-disable-next-line camelcase
                    date_start: startDateISO,
                    // eslint-disable-next-line camelcase
                    date_end: endDateISO,
                },
            });

            return response.data;
        },
    });
}
