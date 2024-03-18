import React,{useState} from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    StyleSheet,
} from "react-native";

import axios from "axios";







export default function inscription() {
const [name,setName] = useState('');
const [lastname,setLastName] = useState('');
const [mail,setMail] = useState('');
const [password,setPassword] = useState('');
    return (
        <View>
            <Text>Nom : </Text>
            <TextInput defaultValue={name} />

            <Text>Prénom : </Text>
            <TextInput defaultValue={lastname} />

            <Text>Adresse mail :</Text>
            <TextInput defaultValue={mail} />
            <Text>Mot de passe :</Text>
            <TextInput secureTextEntry={true} defaultValue={password}/>
        </View>

        
    );

    
    axios.post('127.0.0.1:8000/registration', {
        name: name,
        lastName: lastname,
        mail :mail,
        password : password
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

    
}

const styles = StyleSheet.create({});
