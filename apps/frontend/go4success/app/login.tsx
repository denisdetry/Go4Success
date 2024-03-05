import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import React from "react";
import styles from "../styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const router = useRouter();

export default function login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    axios
      .post("http://localhost:8000/api/login/", { username, password })
      .then((res) => {
        if (Platform.OS === "web") {
          alert("Login successful");
        } else {
          Alert.alert("Login successful");
        }
        router.push("/");
      })
      .catch((error) => {
        const msg = error.message;
        if (Platform.OS === "web") {
          alert("Error : " + msg);
        } else {
          Alert.alert("Error : " + msg);
        }
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Login Form</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="username"
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="password"
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="black"
          onPress={toggleShowPassword}
        />
      </View>
      <Button title="Submit" onPress={handleLogin} />
    </View>
  );
}
