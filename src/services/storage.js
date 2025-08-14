// Guardar y leer datos offline
import AsyncStorage from '@react-native-async-storage/async-storage';

export const guardarDato = async (clave, valor) => {
  await AsyncStorage.setItem(clave, valor);
};

export const leerDato = async (clave) => {
  return await AsyncStorage.getItem(clave);
};