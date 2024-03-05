import { View, Text, Platform, Alert, Button } from "react-native";
import React from "react";
import styles from "../styles/global";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRetype, setPasswordRetype] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRetype, setShowPasswordRetype] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== passwordRetype) {
      if (Platform.OS === "web") {
        alert("Password and Password Retype must be the same");
      } else {
        Alert.alert("Password and Password Retype must be the same");
      }
      return;
    }
    axios
      .post("http://localhost:8000/api/register/", {
        email,
        username,
        password,
      })
      .then((res) => {
        if (Platform.OS === "web") {
          alert("Register successful");
        } else {
          Alert.alert("Register successful");
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

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />

        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="black"
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Retype Password"
          onChangeText={setPasswordRetype}
          secureTextEntry={!showPasswordRetype}
        />
        <MaterialCommunityIcons
          name={showPasswordRetype ? "eye-off" : "eye"}
          size={24}
          color="black"
          onPress={() => setShowPasswordRetype(!showPasswordRetype)}
        />
      </View>
      <Button title="Submit" onPress={handleRegister} />
    </View>
  );
}
