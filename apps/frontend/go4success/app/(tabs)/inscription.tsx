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

/* Auto layout */
display: flex,
flexDirection: column,
alignItems: center,
padding: 50px 16px,
gap: 16px,

width: 390px,
height: 453px,


/* Inside auto layout */
flex: none,
order: 3,
flex-grow: 0,

});



