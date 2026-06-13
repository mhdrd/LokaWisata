import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as favoriteApi from '../../api/favoriteApi';
import WisataCard from '../../components/WisataCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import { COLORS } from '../../utils/constants';

export default function FavoriteScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await favoriteApi.getFavorites();
      setFavorites(res.data || res || []);
    } catch (e) {
      console.error('Failed to load favorites:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    
    // Refresh favorites list every time the user navigates back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const handleFavoriteToggle = async (wisataId) => {
    try {
      // Instantly remove item from local state for snap-fast UI feedback
      setFavorites(prev => prev.filter(f => f.wisataId !== wisataId));
      await favoriteApi.toggleFavorite(wisataId);
    } catch (error) {
      console.error('Failed to toggle favorite in favorites screen:', error);
      // Reload on failure to restore consistency
      fetchFavorites();
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Destinasi Favorit</Text>
        <Text style={styles.subtitle}>Tempat liburan impian Anda</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <SkeletonLoader preset="card" count={3} />
        </View>
      ) : favorites.length === 0 ? (
        <FlatList
          data={[]}
          renderItem={null}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-dislike-outline" size={64} color={COLORS.textLight} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
              <Text style={styles.emptyText}>
                Jelajahi berbagai destinasi wisata menarik dan ketuk ikon hati untuk menyimpannya di sini.
              </Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <WisataCard
              wisata={item.wisata}
              isFavorite={true}
              onPress={() => navigation.navigate('DetailWisata', { id: item.wisataId })}
              onFavoritePress={() => handleFavoriteToggle(item.wisataId)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

