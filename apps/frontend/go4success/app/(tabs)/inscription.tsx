import React from 'react';

import {View, Text, Image, ScrollView, TextInput,StyleSheet} from 'react-native';


export default function inscription() {
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
    /* InscriptionForm */

    display:'flex',

    /* Auto layout */
    flexDirection: 'column',
    alignItems: 'center',
    padding: 50,
    gap: 16,

    width: 390,
    height: 453,


    /* Inside auto layout */
    flex: 'none',
    order: 3,
    flexGrow: 0,

});



