import { View, Text, TextInput, Image } from 'react-native';

export default function HomeHeader() {
  return (
    <View style={{
      padding: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      paddingTop: 50 // üstten boşluk
    }}>

      {/* LOGO + YAZI ORTADA */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 30, height: 30, borderRadius: 15 }}
        />

        <Text style={{ fontSize: 22, fontWeight: 'bold', marginLeft: 8 }}>
          Tercihsepetim
        </Text>
      </View>

      {/* ARAMA ALANI */}
      <TextInput
        placeholder="Ürün ara..."
        style={{
          backgroundColor: '#f1f1f1',
          padding: 10,
          borderRadius: 10,
        }}
      />
    </View>
  );
}
