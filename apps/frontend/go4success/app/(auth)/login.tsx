import { ScrollView, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import styles from "@/styles/global";
import Button from "@/components/ButtonComponent";
import { useAuth } from "@/context/Auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserLogin } from "@/types/UserLogin";
import { useTranslation } from "react-i18next";

export default function Login() {
    const { t } = useTranslation();

    const schema = yup.object().shape({
        username: yup.string().required(t("translateLogin.yupUsernameRequired")),
        password: yup.string().required(t("translateLogin.yupPasswordRequired")),
    });

    const { signIn } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            username: "artak",
            password: "Azerty123_",
        },
    });

    const onSubmit = (userData: UserLogin) => {
        signIn(userData);
    };

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={[styles.container, { shadowRadius: 0, backgroundColor: "" }]}>
                <Text style={styles.title}>{t("translateLogin.title")}</Text>
                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    autoCapitalize={"none"}
                                    style={styles.input}
                                    placeholder={t("translateLogin.username")}
                                    onChangeText={onChange}
                                    value={value}
                                />
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
                                    placeholder={t("translateLogin.password")}
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
                        text={t("translateLogin.loginButton")}
                        onPress={handleSubmit(onSubmit)}
                        buttonType={"primary"}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
