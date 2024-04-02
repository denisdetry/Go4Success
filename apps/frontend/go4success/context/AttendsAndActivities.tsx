import * as React from "react";
import axios from "axios";
import { useAuth } from "@/context/auth";

const AttendsAndActivitiesContext = React.createContext<any>(null);

export function useAttendsAndActivities() {
    return React.useContext(AttendsAndActivitiesContext);
}

export function AttendsAndActivitiesProvider({ children }: React.PropsWithChildren) {
    const [attends, setAttends] = React.useState([]);
    const [activities, setActivities] = React.useState([]);

    const { user } = useAuth();

    const refreshAttendsAndActivities = () => {
        getAttends(setAttends);
        getActivities(setActivities);
    };

    const getAttends = (setRegisteredActivities: any) => {
        axios
            .get("http://localhost:8000/api/attends/")
            .then((res) => {
                setRegisteredActivities(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getActivities = (setAllActivities: any) => {
        axios
            .get("http://localhost:8000/api/activity/")
            .then((res) => {
                setAllActivities(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    React.useEffect(() => {
        refreshAttendsAndActivities();
    }, [user.id]);

    return (
        <AttendsAndActivitiesContext.Provider
            value={{
                registeredActivities: attends,
                allActivities: activities,
                refreshAttendsAndActivities: refreshAttendsAndActivities,
            }}
        >
            {children}
        </AttendsAndActivitiesContext.Provider>
    );
}
