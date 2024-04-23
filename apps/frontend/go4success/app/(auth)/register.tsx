// import Button from "@/components/Button";
import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "@/components/ButtonComponent";
import React, { useState } from "react";
import styles from "@/styles/global";
import { useAuth } from "@/context/Auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { UserRegister } from "@/types/UserRegister";
import { useTranslation } from "react-i18next";

export default function Register() {
    const { t } = useTranslation();
    const schema = yup.object().shape({
        email: yup
            .string()
            .email(t("translateRegister.yupEmailInvalid"))
            .required(t("translateRegister.yupEmailRequired")),
        username: yup
            .string()
            .required(t("translateRegister.yupUsernameRequired"))
            .min(3, t("translateRegister.yupUsernameMin")),
        password: yup
            .string()
            .required(t("translateRegister.yupPasswordRequired"))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/,
                t("translateRegister.yupPasswordConstraint"),
            ),
        passwordRetype: yup
            .string()
            .required(t("translateRegister.yupConfirmPasswordRequired"))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/,
                t("translateRegister.yupPasswordConstraint"),
            )
            .equals([yup.ref("password")], t("translateRegister.yupPasswordEquals")),
        lastName: yup.string().required(t("translateRegister.yupLastNameRequired")),
        firstName: yup.string().required(t("translateRegister.yupFirstNameRequired")),
        noma: yup
            .string()
            .matches(/^[0-9]{8}$/, {
                message: t("translateRegister.yupNomaConstraint"),
                excludeEmptyString: true,
            })
            .required(t("translateRegister.yupNomaRequired")),
    });

    const { signUp } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRetype, setShowPasswordRetype] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "test@gmail.com",
            username: "test",
            lastName: "test",
            firstName: "test",
            noma: "11223344",
            password: "Azerty123_",
            passwordRetype: "Azerty123_",
        },
    });

    const onSubmit = (userData: UserRegister) => {
        signUp(userData);
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.mainContainer, { justifyContent: "center" }]}
        >
            <View style={[styles.container, { shadowRadius: 0, backgroundColor: "" }]}>
                <Text style={styles.title}>{t("translateRegister.title")}</Text>
                {/*Email field*/}
                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    autoCapitalize={"none"}
                                    style={styles.input}
                                    placeholder={t("translateRegister.email")}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            </View>
                        )}
                        name="email"
                        defaultValue=""
                    />
                    {/*Error message for email field*/}
                    {errors.email && (
                        <Text style={styles.errorMsg}>{errors.email.message}</Text>
                    )}
                    {/*Username field*/}
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    autoCapitalize={"none"}
                                    style={styles.input}
                                    placeholder={t("translateRegister.username")}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            </View>
                        )}
                        name="username"
                        defaultValue=""
                    />

                    {/* Error message for username field*/}
                    {errors.username && (
                        <Text style={styles.errorMsg}>{errors.username.message}</Text>
                    )}

                    {/*Last Name field*/}
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    autoCapitalize={"none"}
                                    style={styles.input}
                                    placeholder={t("translateRegister.lastName")}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            </View>
                        )}
                        name="lastName"
                        defaultValue=""
                    />

                    {/*Error message for lastname field*/}
                    {errors.lastName && (
                        <Text style={styles.errorMsg}>{errors.lastName.message}</Text>
                    )}

                    {/* firstname field*/}
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    autoCapitalize={"none"}
                                    style={styles.input}
                                    placeholder={t("translateRegister.firstName")}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            </View>
                        )}
                        name="firstName"
                        defaultValue=""
                    />
                    {/*Error message for firstname field*/}
                    {errors.firstName && (
                        <Text style={styles.errorMsg}>{errors.firstName.message}</Text>
                    )}

                    {/*Noma field*/}
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    autoCapitalize={"none"}
                                    style={styles.input}
                                    placeholder={t("translateRegister.noma")}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            </View>
                        )}
                        name="noma"
                    />

                    {/*Error message for noma field*/}

                    {errors.noma && (
                        <Text style={styles.errorMsg}>{errors.noma.message}</Text>
                    )}

                    {/* Password field */}
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t("translateRegister.password")}
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
                    {/*Error message for password field*/}
                    {errors.password && (
                        <Text style={styles.errorMsg}>{errors.password.message}</Text>
                    )}
                    {/*Password retype field*/}
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t("translateRegister.confirmPassword")}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry={!showPasswordRetype}
                                />

                                <MaterialCommunityIcons
                                    name={showPasswordRetype ? "eye-off" : "eye"}
                                    size={24}
                                    color="black"
                                    onPress={() =>
                                        setShowPasswordRetype(!showPasswordRetype)
                                    }
                                />
                            </View>
                        )}
                        name="passwordRetype"
                        defaultValue=""
                    />
                    {/*Error message for password retype field*/}
                    {errors.passwordRetype && (
                        <Text style={styles.errorMsg}>
                            {errors.passwordRetype?.message?.toString()}
                        </Text>
                    )}

                    {/*Submit button*/}
                    <Button
                        text={t("translateRegister.registerButton")}
                        onPress={handleSubmit(onSubmit)}
                        buttonType={"primary"}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
