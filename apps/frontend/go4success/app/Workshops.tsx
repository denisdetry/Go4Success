import axios from "axios";
import { useEffect, useState } from "react";
import {
    View,
    ActivityIndicator,
    FlatList,
    Text,
    ScrollView,
} from "react-native";
import styles from "../styles/global";
import Card from "../components/Card";

type Workshop = {
    url: string;
    activity_type: string;
    activity_name: string;
    activity_description: string;
    activity_date_start: string;
    activity_date_end: string;
    activity_room: string;
    activity_course_code: string;
};

const Workshop = () => {
    const [isLoading, setLoading] = useState(true);
    const [Workshops, setWorkshops] = useState<Workshop[]>([]);

    const getWorkshops = async () => {
        try {
            const response = await axios.get("http://localhost:8000/workshop/");
            await setWorkshops(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWorkshops();
    }, []);

    const renderCards = ({ item }: { item: Workshop }) => {
        return (
            <Card
                id={item.activity_name}
                title={item.activity_name}
                location={item.activity_room}
                date={item.activity_date_start}
                type={item.activity_type}
                description={item.activity_description}
            />
        );
    };
    return (
        <ScrollView contentContainerStyle={styles.containerCard}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <FlatList data={Workshops} renderItem={renderCards} />
            )}
        </ScrollView>
    );
};

export default Workshop;
