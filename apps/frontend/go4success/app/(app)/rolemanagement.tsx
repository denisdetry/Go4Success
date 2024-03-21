import {View,Text,FlatList,Picker} from 'react-native';
import React from "react";
import styles from "@/styles/global";



export default function roleManagement (){
    

  const data = [
    { id: 1, nom: 'Jean Dupond', valeur: 'Admin' },
    { id: 2, nom: 'Tintin', valeur: 'Etudiant' },
    { id: 3, nom: 'Beta', valeur: 'Tuteur' },
    // Ajoutez autant d'éléments que nécessaire
  ];




      const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', padding: 10 }}>
      <Text style={{ flex: 1 }}>{item.nom}</Text>
      <Text style={{ flex: 1 }}>{item.valeur}</Text>
    </View>
  );
    
    
    return (
  <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      // Vous pouvez également ajouter d'autres props FlatList ici selon vos besoins
    />
    );
}

