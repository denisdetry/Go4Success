import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function TabTwoScreen() {
    return (
        <View>
            
            <Text>Nom : </Text>
                 <TextInput defaultValue=""/>

            <Text>Prénom : </Text>     
                 <TextInput defaultValue=""/>

            <Text>Adresse mail :</Text>
                <TextInput defaultValue=""/>

            <Text>Mot de passe :</Text>
            <TextInput secureTextEntry={true} style={styles.default}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});
