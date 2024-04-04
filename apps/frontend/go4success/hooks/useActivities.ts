import { Room } from "./useRooms";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/ConfigApp";
import axios from "axios";

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
    // const [allActivities, setAllActivities] = useState<Activity[]>([]);
    // const [allRegisteredActivities, setAllRegisteredActivities] = useState<Activity[]>(
    //     [],
    // );

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

    // const { data, error, isPending } = useQuery<Activity[]>({
    //     queryKey: [
    //         "activities",
    //         endpoint,
    //         searchName,
    //         selectedRoom,
    //         selectedSite,
    //         startDateISO,
    //         endDateISO,
    //     ],
    //     queryFn: async () => {
    //         const response = await axios.get(
    //             `${API_BASE_URL}/activities/${endpoint}/`,
    //             {
    //                 params: {
    //                     name: searchName,
    //                     room: selectedRoom,
    //                     site: selectedSite,
    //                     // eslint-disable-next-line camelcase
    //                     date_start: startDateISO,
    //                     // eslint-disable-next-line camelcase
    //                     date_end: endDateISO,
    //                 },
    //             },
    //         );
    //         // return response.data;
    //         if (endpoint === "activity") {
    //             setAllActivities(response.data);
    //         }
    //         if (endpoint === "attends") {
    //             setAllRegisteredActivities(response.data);
    //         }
    //         return response.data;
    //     },
    //     refetchOnMount: true,
    //     refetchOnReconnect: true,
    //     refetchOnWindowFocus: false,
    // });
    //
    // return { allActivities, allRegisteredActivities, data, isPending, error };
}
