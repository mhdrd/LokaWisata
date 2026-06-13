import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const { width } = Dimensions.get('window');

export default function SkeletonLoader({ preset = 'card', count = 1, style }) {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const sharedAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    
    sharedAnimation.start();
    
    return () => sharedAnimation.stop();
  }, [pulseAnim]);

  const renderCard = (index) => (
    <View key={index} style={[styles.cardContainer, style]}>
      <Animated.View style={[styles.imagePlaceholder, { opacity: pulseAnim }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.lineLarge, { opacity: pulseAnim }]} />
        <View style={styles.metaRow}>
          <Animated.View style={[styles.lineSmall, { opacity: pulseAnim, width: '40%' }]} />
          <Animated.View style={[styles.lineSmall, { opacity: pulseAnim, width: '20%' }]} />
        </View>
      </View>
    </View>
  );

  const renderList = (index) => (
    <View key={index} style={[styles.listContainer, style]}>
      <Animated.View style={[styles.avatarPlaceholder, { opacity: pulseAnim }]} />
      <View style={styles.listContent}>
        <Animated.View style={[styles.lineLarge, { opacity: pulseAnim, width: '70%' }]} />
        <Animated.View style={[styles.lineSmall, { opacity: pulseAnim, width: '90%', marginTop: 8 }]} />
      </View>
    </View>
  );

  const renderDetail = () => (
    <View style={styles.detailContainer}>
      <Animated.View style={[styles.heroPlaceholder, { opacity: pulseAnim }]} />
      <View style={styles.detailContent}>
        <Animated.View style={[styles.lineLarge, { opacity: pulseAnim, width: '60%', height: 24 }]} />
        <Animated.View style={[styles.lineSmall, { opacity: pulseAnim, width: '40%', marginTop: 12 }]} />
        <View style={styles.divider} />
        <Animated.View style={[styles.lineSmall, { opacity: pulseAnim, width: '100%', height: 14 }]} />
        <Animated.View style={[styles.lineSmall, { opacity: pulseAnim, width: '90%', height: 14, marginTop: 8 }]} />
        <Animated.View style={[styles.lineSmall, { opacity: pulseAnim, width: '95%', height: 14, marginTop: 8 }]} />
      </View>
    </View>
  );

  return (
    <View>
      {Array.from({ length: count }).map((_, idx) => {
        if (preset === 'card') return renderCard(idx);
        if (preset === 'list') return renderList(idx);
        if (preset === 'detail') return renderDetail();
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#E2E8F0',
  },
  content: {
    padding: 16,
  },
  lineLarge: {
    height: 18,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    width: '80%',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineSmall: {
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  listContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#E2E8F0',
  },
  detailContent: {
    padding: 24,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
});

