import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as wisataApi from '../../api/wisataApi';
import * as favoriteApi from '../../api/favoriteApi';
import CategoryChip from '../../components/CategoryChip';
import WisataCard from '../../components/WisataCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import { COLORS } from '../../utils/constants';

export default function ExploreScreen({ route, navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  
  // Pagination and Refresh state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load categories and favorites
  const loadInitialData = async () => {
    try {
      const [catData, favData] = await Promise.all([
        wisataApi.getKategori(),
        favoriteApi.getFavorites().catch(() => ({ data: [] }))
      ]);
      setCategories(catData.data || catData || []);
      const favList = favData.data || favData || [];
      setFavoriteIds(new Set(favList.map(f => f.wisataId)));
    } catch (e) {
      console.error('Failed to load categories/favorites:', e);
    }
  };

  // Main data fetcher
  const fetchDestinations = async (pageNum, shouldAppend = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: pageNum,
        limit: 10,
        search: searchQuery || undefined,
        kategoriId: selectedCategory || undefined,
      };

      const response = await wisataApi.getWisata(params);
      const fetchedData = response.data || [];
      const meta = response.meta || { totalPages: 1 };

      setDestinations(prev => shouldAppend ? [...prev, ...fetchedData] : fetchedData);
      setTotalPages(meta.totalPages);
    } catch (error) {
      console.error('Failed to load destinations in explore:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Initialize and handle home parameters routing
  useEffect(() => {
    loadInitialData();
  }, []);

  // Listen to router parameter changes from home
  useEffect(() => {
    const params = route.params || {};
    let changed = false;

    if (params.search !== undefined && params.search !== searchQuery) {
      setSearchQuery(params.search);
      changed = true;
    }
    if (params.kategoriId !== undefined && params.kategoriId !== selectedCategory) {
      setSelectedCategory(params.kategoriId);
      changed = true;
    }

    if (changed || destinations.length === 0) {
      setPage(1);
      // Trigger fetch directly or let the useEffect watch state
    }
  }, [route.params]);

  // Watch filter/search/page states and fetch
  useEffect(() => {
    fetchDestinations(page, page > 1);
  }, [page, selectedCategory, searchQuery]);

  // Listen for screen focus to reload favorites
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      favoriteApi.getFavorites()
        .then(favData => {
          const favList = favData.data || favData || [];
          setFavoriteIds(new Set(favList.map(f => f.wisataId)));
        })
        .catch(err => console.log('Err reload fav:', err));
    });
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadInitialData();
    fetchDestinations(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handleFavoriteToggle = async (wisataId) => {
    try {
      await favoriteApi.toggleFavorite(wisataId);
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (next.has(wisataId)) {
          next.delete(wisataId);
        } else {
          next.add(wisataId);
        }
        return next;
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleCategorySelect = (id) => {
    setSelectedCategory(prev => prev === id ? null : id);
    setPage(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Search Bar Block */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pantai, gunung, candi..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setPage(1);
            }}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setPage(1);
            }}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Kategori Filters scrollbar */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryChip
              name={item.name}
              active={selectedCategory === item.id}
              onPress={() => handleCategorySelect(item.id)}
            />
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Destinations Listing */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <SkeletonLoader preset="card" count={3} />
        </View>
      ) : destinations.length === 0 ? (
        <FlatList
          data={[]}
          renderItem={null}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={60} color={COLORS.textLight} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>Destinasi Tidak Ditemukan</Text>
              <Text style={styles.emptyText}>
                Cobalah mengganti kata kunci pencarian atau kategori filter Anda.
              </Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      ) : (
        <FlatList
          data={destinations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <WisataCard
              wisata={item}
              isFavorite={favoriteIds.has(item.id)}
              onPress={() => navigation.navigate('DetailWisata', { id: item.id })}
              onFavoritePress={() => handleFavoriteToggle(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : page >= totalPages ? (
              <View style={styles.footerLoader}>
                <Text style={styles.footerText}>Sudah menampilkan semua destinasi</Text>
              </View>
            ) : null
          }
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
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  categoriesList: {
    paddingHorizontal: 24,
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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

