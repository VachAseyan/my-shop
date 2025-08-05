import { Image } from 'expo-image';
import { StyleSheet, Pressable, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBasket } from '@/components/BasketContext';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabTwoScreen() {
  const { basket, deleteFromBasket, incrementQuantity, decrementQuantity } = useBasket();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = basket.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    setTotalPrice(total);
  }, [basket]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/basketBackgroundImage.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Your Basket</ThemedText>
      </ThemedView>

      <ThemedView>
        <ThemedText style={styles.totalText}>
          {totalPrice > 0 ? `Total: $${totalPrice.toFixed(0)}` : ''}
        </ThemedText>
        {totalPrice > 0 && (
          <ThemedText style={styles.itemCount}>
            {basket.length} {basket.length === 1 ? 'item' : 'items'}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.productsContainer}>
        {basket.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <MaterialIcons name="remove-shopping-cart" size={48} color="#D3D3D3" />
            <ThemedText style={styles.emptyText}>Your basket is empty</ThemedText>
            <ThemedText style={styles.emptySubtext}>Start shopping to add items</ThemedText>
          </ThemedView>
        ) : (
          basket.map(item => (
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

              <View style={styles.quantityControls}>
                <View style={styles.quantityContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.quantityButton,
                      pressed && styles.buttonPressed
                    ]}
                    onPress={() => decrementQuantity(item.id)}
                  >
                    <MaterialIcons name="remove" size={18} />
                  </Pressable>

                  <ThemedText style={styles.quantityText}>
                    {item.quantity || 1}
                  </ThemedText>

                  <Pressable
                    style={({ pressed }) => [
                      styles.quantityButton,
                      pressed && styles.buttonPressed
                    ]}
                    onPress={() => incrementQuantity(item.id)}
                  >
                    <MaterialIcons name="add" size={15} />
                  </Pressable>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => deleteFromBasket(item.id)}
                >
                  <MaterialIcons name="delete-outline" size={18} color="#F44336" />
                  <ThemedText style={styles.deleteButtonText}>
                    Remove
                  </ThemedText>
                </Pressable>
              </View>
            </ThemedView>
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
    paddingTop: 8,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A9D8F',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
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
    marginTop: 16,
    marginBottom: 4,
    textAlign: 'center',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  productsContainer: {
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '48%',
    height: 390,
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
    height: 120,
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
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
    color: '#333',
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
    fontSize: 18,
    color: '#2A9D8F',
    textAlign: 'center',
    marginBottom: 12,
  },
  quantityControls: {
    width: '100%',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  reactLogo: {
    height: "100%",
    width: "100%",
  },
});