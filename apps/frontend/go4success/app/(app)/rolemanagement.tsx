import React, { useState ,useEffect} from 'react';
import { View, Text, FlatList, Picker, TouchableOpacity} from 'react-native';
import axios from 'axios';


export default function RoleManagement() {
  const [selectedValues, setSelectedValues] = useState({});
  const [backdata,setData] = useState(null);
  const [item,setItem] = useState();


  const items = [];


  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/rolemanagement/');
      setData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      // Gérer les erreurs
    }
  };





  const addItem = (newItem) =>{

    const newItems = items.concat(newItem);
    setItem(newItems);

  };



  const data = [
    { id: 1, nom: 'Jean Dupond', valeur: 'Admin' },
    { id: 2, nom: 'Tintin', valeur: 'Etudiant' },
    { id: 3, nom: 'Beta', valeur: 'Tuteur' },
    // Ajoutez autant d'éléments que nécessaire
  ];



  const handleValueChange = (itemValue, itemId) => {
    setSelectedValues({
      ...selectedValues,
      [itemId]: itemValue
    });
    console.log(`L'état de l'élément ${itemId} est :`, itemValue);
  };


  const sendDataToBackend = () => {
    axios.post('http://127.0.0.1:8000/api/rolemanagement/', selectedValues)
      .then(response => {
        console.log('Réponse du serveur:', response.data);
        // Gérer la réponse si nécessaire
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi des données au backend:', error);
        // Gérer les erreurs
      });
  };


  
  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', padding: 10 }}>
      <Text style={{ flex: 1 }}>{item.nom}</Text>
      <Text style={{ flex: 1 }}>{item.valeur}</Text>
      <View style={{ flex: 1 }}>
        <Picker
          selectedValue={selectedValues[item.id]}
          onValueChange={(itemValue, itemIndex) =>
           
          handleValueChange(itemValue, item.id)
           
           
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
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity onPress={sendDataToBackend} style={{ backgroundColor: 'blue', padding: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>sauvegarder </Text>
      </TouchableOpacity>
    </View>
  );
};
