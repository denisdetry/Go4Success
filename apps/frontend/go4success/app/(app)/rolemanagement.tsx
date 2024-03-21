import React, { useState } from 'react';
import { View, Text, FlatList, Picker,TouchableOpacity,Alert} from 'react-native';

export default function RoleManagement() {
  const [selectedValues, setSelectedValues] = useState({});

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
      <View style={{ flex: 1 }}>
        <Picker
          selectedValue={selectedValues[item.id]}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedValues({
              ...selectedValues,
              [item.id]: itemValue
            })
          }>
          <Picker.Item label="Étudiant" value="étudiant" />
          <Picker.Item label="Tuteur" value="tuteur" />
          <Picker.Item label="Professeur" value="professeur" />
          <Picker.Item label="Administrateur" value="administrateur" />
          {/* Ajoutez autant d'éléments que nécessaire */}
        </Picker>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );
}
