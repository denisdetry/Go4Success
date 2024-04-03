import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/ConfigApp";
import axios from "axios";
import { Room } from "./useRooms";

export interface Activity {
    id: string;
    name: string;
    room: Room;
    date_start: string;
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
            const response = await axios.get(
                `${API_BASE_URL}/activities/${endpoint}/`,
                {
                    params: {
                        name: searchName,
                        room: selectedRoom,
                        site: selectedSite,
                        date_start: startDateISO,
                        date_end: endDateISO,
                    },
                },
            );
            return response.data;
        },
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });
}
