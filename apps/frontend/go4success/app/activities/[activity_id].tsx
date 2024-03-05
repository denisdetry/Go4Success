import { View, Text, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

import styles from "../../styles/global";

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function test() {
  const [activity, setActivity] = useState([]);
  const { activity_id } = useLocalSearchParams();
  const user_id = "1";

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/activity/" + activity_id + "/")
      .then((response) => {
        setActivity(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }, []);

  const handleActivityRegister = async () => {
    axios
      .post("http://localhost:8000/api/register_activity/", {
        activity_id,
        user_id,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Error: " + error);
      });
  };
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>{activity["activity_type"]}</Text>
      <Text style={styles.title}>{activity["activity_name"]}</Text>
      <Button onPress={handleActivityRegister} title="S'inscrire"></Button>
    </View>
  );
}
