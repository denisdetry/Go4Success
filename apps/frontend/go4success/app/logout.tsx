import { View, Button, Platform, Alert } from "react-native";
import React from "react";
import styles from "../styles/global";
import axios from "axios";
import { useRouter } from "expo-router";

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function logout() {
  const router = useRouter();
  const handleLogout = async () => {
    axios
      .post("http://localhost:8000/api/logout/")
      .then((res) => {
        if (Platform.OS === "web") {
          alert("Logout successful");
        } else {
          Alert.alert("Logout successful");
        }
        router.push("/");
      })
      .catch((error) => {
        const msg = error.message;
        if (Platform.OS === "web") {
          alert("Error : " + msg);
          console.log(error);
        } else {
          Alert.alert("Error : " + msg);
        }
      });
  };
  return (
    <View style={styles.mainContainer}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
