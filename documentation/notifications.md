# Système de Notifications

Avant toute chose, il vous faut vous créer un compte sur expo.dev et suivre les instructions pour créer un projet. Vous
devez également installer l'application Expo Go sur votre téléphone pour tester les notifications push. Voici le site
pour vous créer un compte et lié le projet à expo : https://expo.dev/

Il vous faudra également un compte Firebase pour pouvoir utiliser les notifications push. Voici le site pour vous créer
un compte et créer un projet Firebase : https://firebase.google.com/

Je vous invite à regarder cette vidéo pour en apprendre davantage sur l'installation et la configuration des notifications avec Expo : 
https://www.youtube.com/watch?v=V-hois8dgM4

## Fichier `usePushNotifications.ts`

Ce fichier contient le hook personnalisé `usePushNotifications`, qui est utilisé pour gérer les notifications push dans
l'application. Il utilise les fonctions d'Expo pour enregistrer l'appareil pour les notifications push, envoyer des
notifications. En voici la documentation officiel pour plus
d'informations : https://docs.expo.dev/versions/latest/sdk/notifications/

Ce hook utilise la fonction `registerForPushNotificationsAsync` pour enregistrer l'appareil pour les notifications push
lors de son initialisation. Il enregistre également deux handlers de notifications : un pour les notifications reçues
et un pour les réponses aux notifications. Il renvoie le token de notification push Expo et la dernière notification
reçue.

Un useEffect est mise en place pour ce système, et nous avons ajouter les rêquetes à notre serveur django pour ajouter (si nécessaire), ou mettre à jour l'attribut is_active de la table ExpoToken de la base de données.

### Fonction `registerForPushNotificationsAsync`

Cette fonction est utilisée pour enregistrer l'appareil pour les notifications push. Elle vérifie d'abord si l'appareil
est un appareil Android et configure le canal de notification par défaut. Ensuite, elle vérifie si l'appareil est un
appareil physique et non une plateforme web. Si c'est le cas, elle demande la permission de recevoir des notifications
push. Si la permission est accordée, elle récupère le token de notification push Expo.

## Fichier `sendNotification.ts`

Ce fichier contient des fonctions pour envoyer des notifications push.

### Fonction `sendPushNotification`

Cette fonction envoie une notification push à un token Expo spécifique. Elle crée un message avec le titre, le corps et
les données spécifiés, puis envoie ce message à l'API de push d'Expo.

### Fonction `sendNotificationsToAllUsers`

Cette fonction envoie une notification push à tous les utilisateurs actifs. Elle parcourt la liste des tokens Expo et
appelle la fonction `sendPushNotification` pour chaque token actif.

### Fonction `schedulePushNotification`

Cette fonction planifie une notification push pour être envoyée après un certain délai. Elle crée un contenu de
notification et un déclencheur, puis planifie la notification avec l'API de notifications d'Expo.

## Fichier `useAllExpoTokens.ts`

Ce fichier contient le hook personnalisé `useAllExpoTokens`, qui est utilisé pour récupérer tous les tokens Expo des
utilisateurs stockés dans la base de données. Ce hook est utilisé avec la fonction `sendNotificationsToAllUsers` pour
passer en paramètre la liste des tokens Expo des utilisateurs.

## Utilisation

Pour utiliser le système de notifications, vous devez d'abord enregistrer l'appareil pour les notifications push en
utilisant le hook `usePushNotifications`. Ensuite, vous pouvez utiliser les
fonctions `sendPushNotification`, `sendNotificationsToAllUsers` et `schedulePushNotification` pour envoyer et planifier
des notifications push.

```tsx 
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import ButtonComponent from "@/components/ButtonComponent";
import useAllExpoTokens from "@/hooks/useAllExpoTokens";
import { useAuth } from "@/context/Auth";
import { sendNotificationsToAllUsers, sendPushNotification } from "@/utils/sendNotification";
import styles from "@/styles/global";

export default function Notifications() {
    const { allExpoTokens } = useAllExpoTokens(); // Get all Expo tokens from the database
    const { expoPushToken, notification } = useAuth(); // Get the Expo push token and the last notification received

    const data = JSON.stringify(notification, undefined, 2);

    return (
        <ScrollView nestedScrollEnabled={true} contentContainerStyle={[styles.mainContainer, { flexGrow: 0 }]}>
            <View style={styles.container}>
                // Display the Expo push token of the current user
                <Text>{expoPushToken}</Text>
                <ScrollView>
                    // Display the last notification received
                    <Text style={{ maxHeight: 200 }}>{data}</Text>
                </ScrollView>
                <ButtonComponent
                    text="Send notification"
                    buttonType="primary"
                    onPress={() => {
                        // Send a notification to the current user
                        if (expoPushToken) {
                            void sendPushNotification(expoPushToken, "Venez voir !", "Vous avez reçu un feedback de la part de vos étudiants! 📬", { someData: "goes here" });
                        }
                    }}
                />

                <ButtonComponent
                    text={"Send notifications to all users"}
                    onPress={() => {
                        // Send a notification to all users
                        sendNotificationsToAllUsers(allExpoTokens, "Venez voir !", "Vous avez reçu un feedback de la part de vos étudiants! 📬", { someData: "goes here" });
                    }}
                    buttonType={"secondary"}
                />
            </View>
        </ScrollView>
    );

}

```
