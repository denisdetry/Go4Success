import React from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import Card from "../components/Card";

const HomePage: React.FC = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Welcome to the Home Page!</Text>
            <Card
                title="Title 1 Lorem ipsum dolor sit amet, consectetur adipiscing"
                location="Charleroi"
                date="30-10-23"
                type="Normal"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. " id={""}            />
            <Card
                title="Title 2 Comment concilier l'étude et les loisirs et construire un bon planning hebdomadaire ?"
                location="Louvain-la-neuve - Local 115"
                date="30-10-23"
                type="Important"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. " id={""}            />
            <Card
                title="Title 3 Comment concilier l'étude et les loisirs et construire un bon planning hebdomadaire ?"
                location="Louvain-la-neuve - Local 115"
                date="30-10-23"
                type="Warning"
                description=". Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. " id={""}            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default HomePage;