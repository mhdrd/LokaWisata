import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, API_HOST } from '../utils/constants';

export default function WisataCard({
  wisata,
  onPress,
  onFavoritePress,
  isFavorite,
  horizontal = false,
}) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  // Build image URL
  const getImageUrl = (images) => {
    if (!images || images.length === 0) return null;
    const url = images[0].url;
    if (url.startsWith('http')) return url;
    // Serve from microservice port 3001 directly
    return `http://${API_HOST}:3001${url}`;
  };

  const imageUrl = getImageUrl(wisata.images);
  const averageRating = wisata.averageRating || (wisata.reviews && wisata.reviews.length > 0 
    ? (wisata.reviews.reduce((sum, r) => sum + r.rating, 0) / wisata.reviews.length).toFixed(1)
    : '5.0'); // fallback rating

  const cardContent = (
    <Animated.View style={[
      horizontal ? styles.cardHorizontal : styles.cardVertical,
      { transform: [{ scale: scaleValue }] }
    ]}>
      {/* Image Section */}
      <View style={horizontal ? styles.imageContainerHorizontal : styles.imageContainerVertical}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={40} color={COLORS.textLight} />
          </View>
        )}
        
        {/* Category Badge overlay */}
        {wisata.kategori?.name && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{wisata.kategori.name}</Text>
          </View>
        )}

        {/* Favorite Button overlay */}
        {onFavoritePress && (
          <Pressable 
            style={styles.favoriteButton} 
            onPress={(e) => {
              e.stopPropagation();
              onFavoritePress();
            }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? COLORS.heartActive : COLORS.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {wisata.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={COLORS.accent} />
            <Text style={styles.ratingText}>{averageRating}</Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} style={{ marginRight: 2 }} />
          <Text style={styles.address} numberOfLines={1}>
            {wisata.address || 'Tanpa Alamat'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        styles.pressable,
        horizontal && styles.pressableHorizontal
      ]}
    >
      {cardContent}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 8,
  },
  pressableHorizontal: {
    marginRight: 16,
    width: 250,
  },
  cardVertical: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHorizontal: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 250,
  },
  imageContainerVertical: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: COLORS.border,
  },
  imageContainerHorizontal: {
    width: '100%',
    height: 150,
    position: 'relative',
    backgroundColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  infoContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D97706',
    marginLeft: 3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
});

