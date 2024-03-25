import { ScrollView, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import styles from "@/styles/global";
import Button from "@/components/Button";
import { useAuth } from "@/context/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    username: yup.string().required("Entrez votre nom d'utilisateur"),
    password: yup.string().required("Entrez votre mot de passe"),
});

export default function login() {
    const { signIn } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            username: "allmaxou",
            password: "azerty",
        },
    });

    const onSubmit = (data: any) => {
        signIn(data.username, data.password);
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.mainContainer, { justifyContent: "center" }]}
        >
            <View style={[styles.container, { shadowRadius: 0, backgroundColor: "" }]}>
                <Text style={styles.title}>Connexion</Text>
                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={"Nom d'utilisateur"}
                                    onChangeText={onChange}
                                    value={value}
                                ></TextInput>
                            </View>
                        )}
                        name="username"
                        defaultValue=""
                    />

                    {errors.username && (
                        <Text style={styles.errorMsg}>{errors.username.message}</Text>
                    )}

                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={"Mot de passe"}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry={!showPassword}
                                />

                                <MaterialCommunityIcons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="black"
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            </View>
                        )}
                        name="password"
                        defaultValue=""
                    />

                    {errors.password && (
                        <Text style={styles.errorMsg}>{errors.password.message}</Text>
                    )}

                    <Button
                        text="Se connecter"
                        onPress={handleSubmit(onSubmit)}
                        buttonType={"primary"}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
