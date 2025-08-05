import { Image } from 'expo-image';
import { StyleSheet, TextInput, ActivityIndicator, View, Button, Animated, Pressable, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useRef, useState } from 'react';
import { fetchProducts } from '@/constants/api';
import { useBasket } from '@/components/BasketContext';

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
  const { addToBasket, deleteFromBasket, basket } = useBasket();

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
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#888"
            />
          </ThemedView>
          <ThemedView style={styles.productsContainer}>
            {filteredProducts.length === 0 ? (
              <ThemedView style={styles.emptyContainer}>
                <ThemedText type="subtitle" style={styles.emptyText}>
                  No products found
                </ThemedText>
              </ThemedView>
            ) : (
              filteredProducts.map((product: Product) => (
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
          <Button onPress={() => searchRef.current?.focus()} title="Search products" />
        </View>
      )}
    </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
  },
  searchContainer: {
    marginBottom: 20,
    width: '100%',
  },
  searchInput: {
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  productsContainer: {
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  productCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '48%',
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2A9D8F',
    textAlign: 'center',
  },
  addButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fcd200',
    borderRadius: 6,
    width: 130,
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: '#f7ca00',
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});