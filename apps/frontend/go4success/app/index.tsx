import { Text, ScrollView } from "react-native";
import React from "react";
import styles from "../styles/global";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { FlatList } from "react-native-gesture-handler";
import FilterActivity from "../components/FilterActivity";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface Activity {
    activity_id: string;
    activity_name: string;
    activity_room: string;
    activity_date_start: string;
    activity_type: string;
    activity_description: string;
}

interface Attend {
    activity: Activity;
    student_id: string;
}

type ActivityOrAttend = Activity | Attend;

export default function index() {
    const [allActivities, setAllActivities] = useState([]);
    const [registeredActivities, setRegisteredActivities] = useState([]);
    const [error, setError] = useState("");

    const [selectedLocation, setSelectedLocation] = useState("");
    const [locations, setLocations] = useState([]);

    const [selectedType, setSelectedType] = useState("");
    const [types, setTypes] = useState<string[]>([]);

    useEffect(() => {
        // LOCATION
        axios
            .get("http://localhost:8000/api/locations/")
            .then((res) => {
                setLocations(
                    res.data
                        .map((location: any) => location.site_name)
                        .filter(
                            (value: string, index: number, self: string[]) =>
                                self.indexOf(value) === index,
                        ),
                );
            })
            .catch((err: Error) => {
                console.error(err.message);
            });

        // ATTENDS
        axios
            .get("http://localhost:8000/api/attends/")
            .then((res) => {
                setRegisteredActivities(res.data);
                res.data.map(
                    (attend: { activity: { activity_name: string } }) =>
                        console.log(
                            "Activity Name: " + attend.activity.activity_name,
                        ),
                );
            })
            .catch((err) => {
                setError(err.message);
            });

        // ACTIVITY
        axios
            .get("http://localhost:8000/api/activity/")
            .then((res) => {
                setAllActivities(res.data);
                setTypes(
                    res.data
                        .map((activity: any) => activity.activity_type)
                        .filter(
                            (value: string, index: number, self: string[]) =>
                                self.indexOf(value) === index,
                        ),
                );
                console.log("All Activity" + res.data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        let activity: Activity;

        if ("activity" in item) {
            activity = item.activity;
        } else {
            activity = item;
        }

        return (
            <Card
                id={activity.activity_id}
                title={activity.activity_name}
                location={activity.activity_room}
                date={activity.activity_date_start}
                type={activity.activity_type}
                description={activity.activity_description}
            />
        );
    };
    const filteredRegisteredActivities = registeredActivities.filter(
        (item: ActivityOrAttend) => {
            if ("activity" in item) {
                const city = item.activity.activity_room.split(" - ")[0];
                return (
                    (selectedLocation === "" || city === selectedLocation) &&
                    (selectedType === "" ||
                        item.activity.activity_type === selectedType)
                );
            }
            return false;
        },
    );

    const filteredAllActivities = allActivities.filter((activity: Activity) => {
        const city = activity.activity_room.split(" - ")[0];
        return (
            (selectedLocation === "" || city === selectedLocation) &&
            (selectedType === "" || activity.activity_type === selectedType)
        );
    });
    return (
        <ScrollView contentContainerStyle={styles.containerCard}>
            <FilterActivity
                types={types}
                locations={locations}
                selectedType={selectedType}
                selectedLocation={selectedLocation}
                onTypeChange={(itemValue) => setSelectedType(itemValue)}
                onLocationChange={(itemValue) => setSelectedLocation(itemValue)}
            />
            <Text style={styles.heading2}>Registered Workshops</Text>
            {filteredRegisteredActivities.length > 0 ? (
                <FlatList
                    data={filteredRegisteredActivities}
                    renderItem={renderCards}
                />
            ) : (
                <Text>No registered workshops available with this filter.</Text>
            )}
            <Text style={styles.heading2}>Available Workshops</Text>
            {filteredAllActivities.length > 0 ? (
                <FlatList
                    data={filteredAllActivities}
                    renderItem={renderCards}
                />
            ) : (
                <Text>No available workshops with this filter.</Text>
            )}
        </ScrollView>
    );
}
