import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/ConfigApp";
import axios from "axios";
import { Room } from "./useRooms";

export interface Workshop {
    id: string;
    name: string;
    room: Room;
    date_start: string;
    type: string;
    description: string;
}

export function useWorkshops(
    endpoint: string,
    searchName: string,
    selectedRoom: string | undefined,
    selectedSite: string | undefined,
    startDateISO: string | null,
    endDateISO: string | null,
) {
    return useQuery<Workshop[]>({
        queryKey: [
            "workshops",
            endpoint,
            searchName,
            selectedRoom,
            selectedSite,
            startDateISO,
            endDateISO,
        ],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/workshops/${endpoint}/`,
                {
                    params: {
                        name: searchName,
                        room: selectedRoom,
                        site: selectedSite,
                        // eslint-disable-next-line camelcase
                        date_start: startDateISO,
                        // eslint-disable-next-line camelcase
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
