// import Button from "@/components/Button";
import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "@/components/ButtonComponent";
import React, { useState } from "react";
import styles from "@/styles/global";
import { useAuth } from "@/context/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { UserRegister } from "@/types/UserRegister";

const schema = yup.object().shape({
    email: yup
        .string()
        .email("Veuillez entrer une adresse email valide")
        .required("Veuillez entrer une adresse email"),
    username: yup
        .string()
        .required("Veuillez entrer un nom d'utilisateur")
        .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    password: yup
        .string()
        .required("Veuillez entrer un mot de passe")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/,
            "Doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (ex: !@#$%^&*_)",
        ),
    passwordRetype: yup
        .string()
        .required("Veuillez confirmer votre mot de passe")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/,
            "Doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (ex: !@#$%^&*_)",
        )
        .equals([yup.ref("password")], "Les mots de passe doivent correspondre"),
    lastName: yup.string().required("Veuillez entrer un nom de famille"),
    firstName: yup.string().required("Veuillez entrer un prénom"),
    noma: yup
        .string()
        .matches(/^[0-9]{8}$/, {
            message: "Le noma doit contenir exactement 8 chiffres.",
            excludeEmptyString: true,
        })
        .required("Veuillez entrer votre noma (exemple : 20200584)"),
});

export default function register() {
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
            email: "",
            username: "",
            lastName: "",
            firstName: "",
            noma: "",
            password: "",
            passwordRetype: "",
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
                <Text style={styles.title}>Inscription</Text>
                {/*Email field*/}
                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputField}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Adresse mail"
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
                                    style={styles.input}
                                    placeholder="Nom d'utilisateur"
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
                                    style={styles.input}
                                    placeholder="Nom de Famille"
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
                                    style={styles.input}
                                    placeholder="Prénom"
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
                                    style={styles.input}
                                    placeholder="Noma"
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
                                    placeholder="Mot de passe"
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
                                    placeholder="Retaper le mot de passe"
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
                        text="S'inscrire"
                        onPress={handleSubmit(onSubmit)}
                        buttonType={"primary"}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
