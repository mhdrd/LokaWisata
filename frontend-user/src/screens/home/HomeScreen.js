import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { useAuth } from '../../hooks/useAuth';
import * as wisataApi from '../../api/wisataApi';
import * as favoriteApi from '../../api/favoriteApi';
import CategoryChip from '../../components/CategoryChip';
import WisataCard from '../../components/WisataCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import { COLORS } from '../../utils/constants';

const { width } = Dimensions.get('window');

// Banner Promos data
const PROMOS = [
  { id: 1, title: 'Eksplor Bali Baru', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', desc: 'Diskon hotel & tiket 20%' },
  { id: 2, title: 'Keindahan Labuan Bajo', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', desc: 'Tur kapal mewah mulai 2jt' },
  { id: 3, title: 'Gunung Bromo Sunrise', image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80', desc: 'Paket petualangan akhir pekan' }
];

export default function HomeScreen({ navigation }) {
  const { userProfile } = useAuth();
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch categories & recommended destinations in parallel
      const [catData, wisataRes, favData] = await Promise.all([
        wisataApi.getKategori(),
        wisataApi.getWisata({ limit: 5 }),
        favoriteApi.getFavorites().catch(() => ({ data: [] })) // catch if fails
      ]);

      setCategories(catData.data || catData || []);
      setRecommendations(wisataRes.data || (wisataRes && wisataRes.data) || []);
      
      const favList = favData.data || favData || [];
      setFavoriteIds(new Set(favList.map(f => f.wisataId)));
    } catch (error) {
      console.error('Failed to load home screen data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Re-fetch favorites when screen is focused
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

  const handleSearchSubmit = () => {
    navigation.navigate('ExploreTab', { search: searchQuery });
    setSearchQuery('');
  };

  const handleCategorySelect = (id) => {
    setSelectedCategory(id === selectedCategory ? null : id);
    // Navigate to Explore tab with the filtered category
    navigation.navigate('ExploreTab', { kategoriId: id === selectedCategory ? null : id });
  };

  const displayName = userProfile?.name || 'Pengunjung';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Halo, {displayName} 👋</Text>
            <Text style={styles.subGreeting}>Mau liburan ke mana hari ini?</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <Ionicons name="person-circle-outline" size={36} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pantai, gunung, candi..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Promos Banner Carousel */}
        <View style={styles.carouselContainer}>
          <Swiper
            autoplay
            autoplayTimeout={4}
            dotColor="rgba(255,255,255,0.4)"
            activeDotColor={COLORS.white}
            paginationStyle={{ bottom: 12 }}
            height={150}
            style={styles.swiper}
          >
            {PROMOS.map((promo) => (
              <View key={promo.id} style={styles.slide}>
                <Image source={{ uri: promo.image }} style={styles.slideImage} />
                <View style={styles.slideOverlay}>
                  <Text style={styles.slideTitle}>{promo.title}</Text>
                  <Text style={styles.slideDesc}>{promo.desc}</Text>
                </View>
              </View>
            ))}
          </Swiper>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Kategori Wisata</Text>
          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <View key={idx} style={[styles.skeletonChip, { width: 80, height: 36, borderRadius: 18, marginRight: 8, backgroundColor: '#E2E8F0' }]} />
              ))}
            </ScrollView>
          ) : (
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
          )}
        </View>

        {/* Recommended destinations slider */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rekomendasi Destinasi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ExploreTab')}>
              <Text style={styles.seeAllLink}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              {Array.from({ length: 2 }).map((_, idx) => (
                <View key={idx} style={{ marginRight: 16, width: 250, height: 250, borderRadius: 20, backgroundColor: '#E2E8F0', opacity: 0.5 }} />
              ))}
            </View>
          ) : recommendations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="compass-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>Tidak ada rekomendasi destinasi.</Text>
            </View>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={recommendations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <WisataCard
                  wisata={item}
                  horizontal
                  isFavorite={favoriteIds.has(item.id)}
                  onPress={() => navigation.navigate('DetailWisata', { id: item.id })}
                  onFavoritePress={() => handleFavoriteToggle(item.id)}
                />
              )}
              contentContainerStyle={styles.recommendationsList}
            />
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  profileButton: {
    padding: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
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
    marginBottom: 20,
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
  carouselContainer: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    height: 150,
    marginBottom: 24,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  swiper: {
    borderRadius: 20,
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  slideImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  slideOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    padding: 16,
    paddingBottom: 24,
  },
  slideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  slideDesc: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  seeAllLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  categoriesList: {
    paddingVertical: 4,
  },
  recommendationsList: {
    paddingVertical: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  skeletonChip: {
    opacity: 0.5,
  },
});

