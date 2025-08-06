import { Image } from 'expo-image';
import { StyleSheet, TextInput, ActivityIndicator, View, Button, Animated, Pressable, Text, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [scaleValue] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<TextInput>(null);
  const { addToBasket } = useBasket();
  const [page, setPage] = useState(1);
  const productsPerPage = 4;

  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'text');

  useEffect(() => {
    const loadInitialProducts = async () => {
      setLoading(true);
      const res = await fetchProducts();
      setProducts(res);
      setVisibleProducts(res.slice(0, productsPerPage));
      setLoading(false);
    };

    loadInitialProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMoreProducts = useCallback(() => {
    const nextPage = page + 1;
    const nextProducts = products.slice(0, nextPage * productsPerPage);

    if (nextProducts.length > visibleProducts.length) {
      setVisibleProducts(nextProducts);
      setPage(nextPage);
    }
  }, [page, visibleProducts, products]);

  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, page * productsPerPage));
    setPage(1);
  }, [searchQuery]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 50;
    const isNearBottom = layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isNearBottom && !loading && visibleProducts.length < filteredProducts.length) {
      loadMoreProducts();
    }
  }, [loading, visibleProducts, filteredProducts]);

  const renderProductItem = ({ item }: { item: Product }) => (
    <ThemedView key={item.id} style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          contentFit="contain"
          transition={200}
        />
      </View>
      <ThemedText type="subtitle" style={styles.productTitle} numberOfLines={2}>
        {item.title}
      </ThemedText>
      <ThemedText type="default" style={styles.productCategory}>
        {item.category}
      </ThemedText>
      <ThemedText type="default" style={styles.productPrice}>
        ${item.price.toFixed(0)}
      </ThemedText>
      <Pressable
        onPress={() => addToBasket(item)}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.buttonPressed
        ]}
      >
        <ThemedText style={styles.buttonText}>Add to Basket</ThemedText>
      </Pressable>
    </ThemedView>
  );

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/homeBackgroundImage.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome Our Shop</ThemedText>
        </ThemedView>

        {loading && products.length === 0 ? (
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

            <View style={styles.productsContainer}>
              {filteredProducts.length === 0 ? (
                <ThemedView style={styles.emptyContainer}>
                  <ThemedText type="subtitle" style={styles.emptyText}>
                    No products found
                  </ThemedText>
                </ThemedView>
              ) : (
                visibleProducts.map((product) => renderProductItem({ item: product }))
              )}
            </View>

            {visibleProducts.length < filteredProducts.length && (
              <ActivityIndicator size="small" style={{ marginVertical: 20 }} />
            )}

            <Pressable
              style={styles.searchButton}
              onPress={() => searchRef.current?.focus()}
            >
              <MaterialIcons name="search" size={18} color="#c4a3a1ff" />
              <ThemedText style={styles.searchButtonText}>
                Search
              </ThemedText>
            </Pressable>
          </View>
        )}
      </ParallaxScrollView>
    </ScrollView>
  );
}