import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

export default function RatingStars({
  rating = 0,
  maxStars = 5,
  onRatingChange,
  size = 18,
  color = COLORS.accent,
  style,
}) {
  const isEditable = !!onRatingChange;

  const renderStar = (index) => {
    const starValue = index + 1;
    let iconName = 'star-outline';

    if (isEditable) {
      iconName = starValue <= rating ? 'star' : 'star-outline';
    } else {
      // Displaying decimal ratings (e.g., 4.5)
      if (rating >= starValue) {
        iconName = 'star';
      } else if (rating >= starValue - 0.5) {
        iconName = 'star-half';
      }
    }

    const starIcon = (
      <Ionicons
        name={iconName}
        size={size}
        color={color}
        style={styles.star}
      />
    );

    if (isEditable) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onRatingChange(starValue)}
          activeOpacity={0.7}
        >
          {starIcon}
        </TouchableOpacity>
      );
    }

    return <View key={index}>{starIcon}</View>;
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: maxStars }).map((_, i) => renderStar(i))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
});

