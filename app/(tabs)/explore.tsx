import { Image } from 'expo-image';
import { StyleSheet, Pressable, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBasket } from '@/components/BasketContext';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {styles} from '@/assets/styles/Basket';

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