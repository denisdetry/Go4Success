import * as React from "react";
import axios from "axios";
import { useAuth } from "@/context/auth";
import { API_BASE_URL } from "../constants/ConfigApp";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AttendsAndActivitiesContext = React.createContext<any>(null);

export function useAttendsAndActivities() {
    return React.useContext(AttendsAndActivitiesContext);
}

export function AttendsAndActivitiesProvider({
    children,
    filters,
}: React.PropsWithChildren & { filters: any }) {
    const [attends, setAttends] = React.useState([]);
    const [activities, setActivities] = React.useState([]);

    const { user } = useAuth();

    const refreshAttendsAndActivities = (filters: any) => {
        getAttends(setAttends, filters);
        getActivities(setActivities, filters);
    };

    const getAttends = (setRegisteredActivities: any, filters: any) => {
        const url = new URL(`${API_BASE_URL}/workshops/attends/`);
        if (filters) {
            Object.keys(filters).forEach((key) =>
                url.searchParams.append(key, filters[key]),
            );
        }
        axios
            .get(url.toString())
            .then((res) => {
                setRegisteredActivities(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getActivities = (setAllActivities: any, filters: any) => {
        const url = new URL(`${API_BASE_URL}/workshops/activity/`);
        if (filters) {
            Object.keys(filters).forEach((key) =>
                url.searchParams.append(key, filters[key]),
            );
        }
        axios
            .get(url.toString())
            .then((res) => {
                setAllActivities(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    React.useEffect(() => {
        refreshAttendsAndActivities(filters);
    }, [user, filters]);

    const providerValue = React.useMemo(
        () => ({
            registeredActivities: attends,
            allActivities: activities,
            refreshAttendsAndActivities: refreshAttendsAndActivities,
        }),
        [attends, activities, refreshAttendsAndActivities],
    );

    return (
        <AttendsAndActivitiesContext.Provider value={providerValue}>
            {children}
        </AttendsAndActivitiesContext.Provider>
    );
}
