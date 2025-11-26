
import { View, ScrollView,Text } from 'react-native';
import HomeHeader from './HomeHeader';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      
      {/* ✓ Header her zaman üstte sabit */}
      <HomeHeader />
     <Text >Kategoriler</Text>
      {/* ✓ İçerik aşağıda scroll edilebilir */}
      <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Ürünler, slider vb. buraya gelecek */}
      </ScrollView>

    </View>
  );
}
