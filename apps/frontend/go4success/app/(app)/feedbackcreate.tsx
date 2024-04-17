import React, { useState } from "react";
import { ScrollView, Text, TextInput, Button, Picker } from "react-native";
import styles from "@/styles/global";
import { Attend, useActivities } from "@/hooks/useActivities";
import { fetchBackend } from "@/utils/fetchBackend";
import { Feedback } from "@/types/Feedback";

export default function FeedbackCreate() {
    const [activity, setActivity] = useState("");
    const [number, setNumber] = useState("");
    const [positivePoint, setPositivePoint] = useState("");
    const [negativePoint, setNegativePoint] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [additionalComment, setAdditionnalComment] = useState("");

    const allActivities = useActivities("attends", "", "", "", null, null);

    const handleSendFeedback = async () => {
        const feedbackData = {
            student_id: "1",
            activity_id: activity,
            evaluation: 5,
            positive_point: positivePoint,
            negative_point: negativePoint,
            suggestion: suggestion,
            additional_comment: additionalComment,
            date_submitted: new Date().toISOString(),
        };
        console.log("feedbackData " + JSON.stringify(feedbackData));

        try {
            const response = await fetchBackend({
                type: "POST",
                url: "feedback/newfeedback/",
                data: feedbackData,
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <Text style={styles.title}>Feedback Create</Text>

            <Picker
                selectedValue={activity}
                onValueChange={(itemValue: React.SetStateAction<string>) =>
                    setActivity(itemValue)
                }
            >
                {allActivities.data.map((attend: Attend) => (
                    <Picker.Item
                        key={attend.activity.id}
                        label={attend.activity.name}
                        value={attend.activity.id.toString()}
                    />
                ))}
            </Picker>

            <TextInput
                onChangeText={setNumber}
                value={number}
                placeholder="Enter a number"
                keyboardType="numeric"
            />

            <TextInput
                onChangeText={setPositivePoint}
                value={positivePoint}
                placeholder="positive_point"
            />

            <TextInput
                onChangeText={setNegativePoint}
                value={negativePoint}
                placeholder="negative_point"
            />

            <TextInput
                onChangeText={setSuggestion}
                value={suggestion}
                placeholder="suggestion"
            />

            <TextInput
                onChangeText={setAdditionnalComment}
                value={additionalComment}
                placeholder="additional_comment"
            />

            <Button title="Send Feedback" onPress={handleSendFeedback} />
        </ScrollView>
    );
}
