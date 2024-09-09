import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import api from './src/services/api';

import PickerItem from './src/components/Picker';
import { useEffect, useState } from 'react';

export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true)
  const [moedaSelecionada, setMoedaSelecionada] = useState(null)
  const [valorInput, setValorInput] = useState('')
  const [valorConvertido, setValorConvertido] = useState(0)
  const [nomeMoeda, setNomeMoeda] = useState('')

  useEffect(() => {
    async function loadMoedas(){
      const response = await api.get('all')
      let arrayMoedas = []
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          value: key,
          label: key,
          key: key
        })
      })

      setMoedas(arrayMoedas);
      setLoading(false)
      setMoedaSelecionada(arrayMoedas[0].key)

    };

    loadMoedas()
  }, [])

  async function converter(){
    if(moedaSelecionada === null || valorInput === '' || valorInput === 0){
      return false;
    };
    
    const response = await api.get(`all/${moedaSelecionada}-BRL`)
    console.log(response.data[moedaSelecionada].ask);

    let resultado = (response.data[moedaSelecionada].ask * valorInput)

    setValorConvertido(resultado.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}))
    setNomeMoeda(response.data[moedaSelecionada].name)
    Keyboard.dismiss()

    
  }

  if(loading){
    return(
      <View style={{backgroundColor: '#101215', justifyContent:'center', alignItems:'center', flex: 1}}>
        <ActivityIndicator color='#FFF' size='large'/>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.areaMoeda}>
        <Text style={styles.textAreaMoeda}>Selecione sua moeda</Text>
        <PickerItem 
        moedas={moedas}
        moedaSelecionada={moedaSelecionada}
        onChange = {(item) => setMoedaSelecionada(item)}/>
      </View>

      <View style={styles.areaValor}>
        <Text style={styles.textAreaMoeda}>Digite um valor para converter em (R$)</Text>
        <TextInput
        placeholder='EX: 1.50'
        style={styles.input}
        value={valorInput}
        onChangeText={(valor) => setValorInput(valor)}
        keyboardType='default'
        />
      </View>

      <TouchableOpacity style={styles.areaBotao} onPress={() => converter()}>
        <Text style={styles.textBotao}>CONVERTER</Text>
      </TouchableOpacity>

      {valorConvertido !== 0 && (
        <View style={styles.moedaConvertida}>
          <Text style={{fontSize: 16}}>{nomeMoeda}</Text>
          <Text style={styles.textMoedaConvertida}> {`${valorInput} ${moedaSelecionada}`}</Text>
          <Text style={{fontSize: 16}}> corresponde a: </Text>
          <Text style={styles.textMoedaConvertida}> {valorConvertido}</Text>
        </View>
      )}

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#101215',
    paddingTop: 80
  },
  areaMoeda:{
    backgroundColor:'#FFF',
    width: '90%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    padding: 10,
    marginBottom: 1
  },
  textAreaMoeda:{
    fontSize: 15,
    fontWeight: '500'
  },
  areaValor:{
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 1
  },
  input:{
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 18,
    color: '#000'
  },
  areaBotao:{
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  textBotao:{
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  moedaConvertida:{
    width: '90%',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    padding: 25,
    borderRadius: 10
  },
  textMoedaConvertida:{
    color: '#000',
    fontSize: 24,
    padding: 10,
    fontWeight: 'bold'
  }
});
