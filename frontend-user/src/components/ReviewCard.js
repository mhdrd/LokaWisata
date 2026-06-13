import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RatingStars from './RatingStars';
import { COLORS } from '../utils/constants';

export default function ReviewCard({ review }) {
  const reviewerName = review.user?.name || 'User LokaWisata';
  const reviewerAvatar = review.user?.avatar;
  const rating = review.rating || 5;
  const comment = review.comment || 'Tidak ada komentar tertulis.';
  const dateStr = review.createdAt 
    ? new Date(review.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {reviewerAvatar ? (
            <Image source={{ uri: reviewerAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={18} color={COLORS.textSecondary} />
            </View>
          )}
        </View>
        
        <View style={styles.reviewerInfo}>
          <Text style={styles.name}>{reviewerName}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>

        <RatingStars rating={rating} size={14} />
      </View>
      
      <Text style={styles.comment}>{comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  date: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 1,
  },
  comment: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

