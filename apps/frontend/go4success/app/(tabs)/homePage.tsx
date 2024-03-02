import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Card from "../../components/Card";

const HomePage: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Page!</Text>
            <Card
                title="Title 1"
                location="Location 1"
                date="Date 1"
                type="Type1"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. "
            />
            <Card
                title="Title 2"
                location="Location 2"
                date="Date 2"
                type="Type2"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. "
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default HomePage;
