import { Image } from 'expo-image';
import { StyleSheet, TextInput, ActivityIndicator, View, Button, Animated, Pressable, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useRef, useState } from 'react';
import { fetchProducts } from '@/constants/api';
import { useBasket } from '@/components/BasketContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '@/assets/styles/HomeScreen';

type Product = {
  id: number;
  image: string;
  title: string;
  category: string;
  price: number;
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scaleValue] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<TextInput>(null);
  const { addToBasket } = useBasket();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;


  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'text');

  useEffect(() => {
    setLoading(true);
    const timeOutId = setTimeout(() =>
      fetchProducts().then(res => {
        setProducts(res);
        setLoading(false);
      }), 3000);
    return () => clearTimeout(timeOutId);
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/homeBackgroundImage.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome Our Shop</ThemedText>
      </ThemedView>
      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d0dce0ff" />
          <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
        </ThemedView>
      ) : (
        <View>
          <ThemedView style={styles.searchContainer}>
            <TextInput
              ref={searchRef}
              placeholder="Search products..."
              style={[styles.searchInput, { color: textColor }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={placeholderColor}
            />
          </ThemedView>
          <ThemedView style={styles.productsContainer}>
            {paginatedProducts.length === 0 ? (
              <ThemedView style={styles.emptyContainer}>
                <ThemedText type="subtitle" style={styles.emptyText}>
                  No products found
                </ThemedText>
              </ThemedView>
            ) : (
              paginatedProducts.map((product: Product) => (
                <ThemedView key={product.id} style={styles.productCard}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      contentFit="contain"
                      transition={200}
                    />
                  </View>
                  <ThemedText type="subtitle" style={styles.productTitle} numberOfLines={2}>
                    {product.title}
                  </ThemedText>
                  <ThemedText type="default" style={styles.productCategory}>
                    {product.category}
                  </ThemedText>
                  <ThemedText type="default" style={styles.productPrice}>
                    ${product.price.toFixed(0)}
                  </ThemedText>
                  <Pressable
                    onPress={() => addToBasket(product)}
                    style={({ pressed }) => [
                      styles.addButton,
                      pressed && styles.buttonPressed
                    ]}
                  >
                    <ThemedText style={styles.buttonText}>Add to Basket</ThemedText>
                  </Pressable>
                </ThemedView>
              ))
            )}
          </ThemedView>
          <Pressable
            style={({ pressed }) => [
              styles.searchButton,
            ]}
            onPress={() => searchRef.current?.focus()}
          >
            <MaterialIcons name="search" size={18} color="#c4a3a1ff" />
            <ThemedText style={styles.searchButtonText}>
              Search
            </ThemedText>
          </Pressable>
          <ThemedView
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
              marginVertical: 20,
            }}
          >
            <Pressable
              onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={({ pressed }) => ({
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 30,
                backgroundColor: currentPage === 1
                  ? '#e0e0e0'
                  : pressed
                    ? '#ffd600'
                    : '#fcd200',
                opacity: currentPage === 1 ? 0.5 : 1,
                elevation: pressed ? 1 : 3,
              })}
            >
              <Text style={{ fontWeight: 'bold', color: '#333' }}>◀ Prev</Text>
            </Pressable>

            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#444' }}>
              Page {currentPage} of {totalPages}
            </Text>

            <Pressable
              onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={({ pressed }) => ({
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 30,
                backgroundColor: currentPage === totalPages
                  ? '#e0e0e0'
                  : pressed
                    ? '#ffd600'
                    : '#fcd200',
                opacity: currentPage === totalPages ? 0.5 : 1,
                elevation: pressed ? 1 : 3,
              })}
            >
              <Text style={{ fontWeight: 'bold', color: '#333' }}>Next ▶</Text>
            </Pressable>
          </ThemedView>
        </View>
      )}
    </ParallaxScrollView>

  );
}

