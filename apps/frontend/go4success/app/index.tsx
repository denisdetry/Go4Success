import { View, Text } from "react-native";
import React from "react";
import styles from "../styles/global";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { FlatList } from "react-native-gesture-handler";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function index() {
  const [allActivities, setAllActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/activity/")
      .then((res) => {
        setAllActivities(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const renderCards = ({ item }) => {
    return (
      <Card
        id={item["activity_id"]}
        title={item["activity_name"]}
        location={item["activity_room"]}
        date={item["activity_date_start"]}
        type={item["activity_type"]}
        description={item["activity_description"]}
      />
    );
  };
  return (
    <View style={styles.mainContainer}>
      <FlatList data={allActivities} renderItem={renderCards} />
    </View>
  );
}
