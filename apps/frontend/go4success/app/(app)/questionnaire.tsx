import React, { useEffect, useState } from "react";
import { useCourses, postQuestionnaire } from "@/hooks/useQuestionnaire";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
function App() {
    const { isPending, sites, error } = useCourses();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        language: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("FormData", formData);
    };

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1>Select a Course</h1>
            <ul>
                {sites.map((site) => (
                    <li key={site.id}>{site.name}</li>
                ))}
            </ul>
            <h2>Create Questionnaire</h2>
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title of the questionnaire"
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
            />
            <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
            />
            <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
            />
            <select name="language" value={formData.language} onChange={handleChange}>
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="French">French</option>
            </select>
            <button onClick={handleSubmit}>Next</button>
        </div>
    );
}

export default App;
const styles = StyleSheet.create({
    container: {
        width: "80%", // Width needs to be a string when using percentage
        alignSelf: "center", // 'margin: auto' is not directly supported, use 'alignSelf' for centering in React Native
        padding: 20,
    },
    input: {
        width: "100%",
        padding: 10,
        marginTop: 10,
    },
    textarea: {
        width: "100%",
        padding: 10,
        marginTop: 10,
    },
    select: {
        width: "100%",
        padding: 10,
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#0066cc",
        color: "white",
        borderRadius: 5,
        marginTop: 20,
    },
});
