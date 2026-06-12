import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  Animated,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as wisataApi from '../../api/wisataApi';
import * as favoriteApi from '../../api/favoriteApi';
import * as reviewApi from '../../api/reviewApi';
import RatingStars from '../../components/RatingStars';
import ReviewCard from '../../components/ReviewCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import { COLORS, API_HOST } from '../../utils/constants';

const { width } = Dimensions.get('window');

export default function DetailWisataScreen({ route, navigation }) {
  const { id } = route.params;
  const [wisata, setWisata] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState({ averageRating: '5.0', totalReviews: 0 });
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Weather state
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Add Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  // Spring animation for heart button
  const heartScale = useRef(new Animated.Value(1)).current;

  // Load destination details, reviews, and favorites
  const loadData = async () => {
    try {
      setLoading(true);
      const [wisataRes, reviewsRes, avgRes, favRes] = await Promise.all([
        wisataApi.getWisataById(id),
        reviewApi.getReviews(id),
        reviewApi.getAverageRating(id).catch(() => ({ averageRating: '5.0', totalReviews: 0 })),
        favoriteApi.getFavorites().catch(() => ({ data: [] }))
      ]);

      const wisataData = wisataRes.data || wisataRes;
      setWisata(wisataData);
      setReviews(reviewsRes.data || reviewsRes || []);
      setAvgRating(avgRes.data || avgRes || { averageRating: '5.0', totalReviews: 0 });

      const favList = favRes.data || favRes || [];
      setIsFavorite(favList.some(f => f.wisataId === wisataData.id));

      // Fetch Weather if coordinates exist
      if (wisataData.latitude && wisataData.longitude) {
        fetchWeather(wisataData.latitude, wisataData.longitude);
      }
    } catch (e) {
      console.error('Failed to load destination details:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      setWeatherLoading(true);
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      if (data.current_weather) {
        setWeather(data.current_weather);
      }
    } catch (error) {
      console.log('Error fetching weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleFavoriteToggle = async () => {
    // Heart bounce animation
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.4,
        friction: 3,
        tension: 150,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await favoriteApi.toggleFavorite(wisata.id);
      setIsFavorite(prev => !prev);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleContactWa = () => {
    if (!wisata.contactWa) return;
    // Format WA: delete plus/spaces, add prefix
    let phoneNum = wisata.contactWa.replace(/[^0-9]/g, '');
    if (phoneNum.startsWith('0')) {
      phoneNum = '62' + phoneNum.slice(1);
    }
    const message = `Halo, saya ingin bertanya tentang ${wisata.name}.`;
    const url = `whatsapp://send?phone=${phoneNum}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Open via web browser fallback
          Linking.openURL(`https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`);
        }
      })
      .catch((err) => console.log('WA Open Error:', err));
  };

  const handleContactEmail = () => {
    if (!wisata.contactEmail) return;
    const url = `mailto:${wisata.contactEmail}?subject=Pertanyaan%20LokaWisata:%20${encodeURIComponent(wisata.name)}`;
    Linking.openURL(url).catch(err => console.log('Email link error:', err));
  };

  const handleAddReview = async () => {
    if (!newComment.trim()) return;
    
    setSubmittingReview(true);
    try {
      await reviewApi.createReview({
        wisataId: wisata.id,
        rating: newRating,
        comment: newComment,
      });

      // Reset fields
      setNewComment('');
      setNewRating(5);
      setReviewModalVisible(false);

      // Reload reviews and rating stats
      const [reviewsRes, avgRes] = await Promise.all([
        reviewApi.getReviews(wisata.id),
        reviewApi.getAverageRating(wisata.id),
      ]);
      setReviews(reviewsRes.data || reviewsRes || []);
      setAvgRating(avgRes.data || avgRes || { averageRating: '5.0', totalReviews: 0 });
    } catch (e) {
      console.error('Submit review error:', e);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Weather mappings helper
  const getWeatherInfo = (code) => {
    if (code === undefined || code === null) return { text: 'N/A', icon: 'cloud-outline' };
    
    // WMO Weather interpretation codes
    if (code === 0) return { text: 'Cerah', icon: 'sunny' };
    if (code === 1 || code === 2 || code === 3) return { text: 'Berawan', icon: 'cloudy' };
    if (code >= 45 && code <= 48) return { text: 'Berkabut', icon: 'cloud' };
    if (code >= 51 && code <= 55) return { text: 'Gerimis', icon: 'rainy-outline' };
    if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return { text: 'Hujan', icon: 'rainy' };
    if (code >= 95) return { text: 'Badai Petir', icon: 'thunderstorm' };
    
    return { text: 'Mendung', icon: 'cloudy' };
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://${API_HOST}:3001${url}`;
  };

  if (loading || !wisata) {
    return <SkeletonLoader preset="detail" />;
  }

  const weatherInfo = weather ? getWeatherInfo(weather.weathercode) : null;
  const wisataImages = wisata.images || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* Gallery Image Slider */}
        <View style={styles.imageSliderContainer}>
          {wisataImages.length > 0 ? (
            <Swiper
              autoplay
              dotColor="rgba(255, 255, 255, 0.4)"
              activeDotColor={COLORS.white}
              paginationStyle={{ bottom: 35 }}
              style={styles.swiper}
            >
              {wisataImages.map((image, index) => (
                <View key={image.id || index} style={styles.slide}>
                  <Image source={{ uri: getImageUrl(image.url) }} style={styles.sliderImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(15, 23, 42, 0.7)']}
                    style={styles.sliderGradient}
                  />
                </View>
              ))}
            </Swiper>
          ) : (
            <View style={styles.slidePlaceholder}>
              <Ionicons name="image-outline" size={70} color={COLORS.textLight} />
              <LinearGradient
                colors={['transparent', 'rgba(15, 23, 42, 0.7)']}
                style={styles.sliderGradient}
              />
            </View>
          )}

          {/* Floating Actions overlay */}
          <View style={styles.floatingHeader}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleFavoriteToggle}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite ? COLORS.heartActive : COLORS.textSecondary}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Content Body Container */}
        <View style={styles.contentContainer}>
          {/* Category Chip */}
          {wisata.kategori?.name && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{wisata.kategori.name}</Text>
            </View>
          )}

          {/* Destination Title & Rating */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{wisata.name}</Text>
            <View style={styles.ratingStats}>
              <Ionicons name="star" size={16} color={COLORS.accent} />
              <Text style={styles.ratingScore}>{parseFloat(avgRating.averageRating).toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({avgRating.totalReviews} Review)</Text>
            </View>
          </View>

          {/* Location / Address */}
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.addressText}>{wisata.address || 'Tanpa Alamat'}</Text>
          </View>

          {/* Weather integration Card */}
          {weather && (
            <View style={styles.weatherCard}>
              <View style={styles.weatherLeft}>
                <Ionicons name={weatherInfo.icon} size={28} color={COLORS.primary} />
                <View style={styles.weatherTextCol}>
                  <Text style={styles.weatherLabel}>Cuaca Saat Ini</Text>
                  <Text style={styles.weatherStatus}>{weatherInfo.text}</Text>
                </View>
              </View>
              <Text style={styles.weatherTemp}>{Math.round(weather.temperature)}°C</Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Description Section */}
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{wisata.description || 'Tidak ada deskripsi untuk destinasi ini.'}</Text>

          {/* Direct Contacts actions */}
          {(wisata.contactWa || wisata.contactEmail) && (
            <View style={styles.contactsSection}>
              <Text style={styles.sectionTitle}>Hubungi Pengelola</Text>
              <View style={styles.contactsRow}>
                {wisata.contactWa && (
                  <TouchableOpacity
                    style={[styles.contactCard, styles.waCard]}
                    onPress={handleContactWa}
                  >
                    <Ionicons name="logo-whatsapp" size={20} color={COLORS.white} />
                    <Text style={styles.contactCardText}>WhatsApp</Text>
                  </TouchableOpacity>
                )}
                {wisata.contactEmail && (
                  <TouchableOpacity
                    style={[styles.contactCard, styles.emailCard]}
                    onPress={handleContactEmail}
                  >
                    <Ionicons name="mail" size={20} color={COLORS.white} />
                    <Text style={styles.contactCardText}>Kirim Email</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Reviews List Section */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Review Pengunjung</Text>
            <TouchableOpacity
              style={styles.addReviewBtn}
              onPress={() => setReviewModalVisible(true)}
            >
              <Text style={styles.addReviewText}>Tulis Review</Text>
            </TouchableOpacity>
          </View>

          {reviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <Ionicons name="chatbubbles-outline" size={36} color={COLORS.textLight} />
              <Text style={styles.emptyReviewsText}>Belum ada review. Jadilah yang pertama!</Text>
            </View>
          ) : (
            reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
          )}
        </View>

      </ScrollView>

      {/* Write Review Dialog Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tulis Review Anda</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Rating inputs */}
            <Text style={styles.modalLabel}>Peringkat Bintang</Text>
            <View style={styles.modalStars}>
              <RatingStars
                rating={newRating}
                onRatingChange={setNewRating}
                size={36}
              />
            </View>

            {/* Comment textbox */}
            <Text style={styles.modalLabel}>Komentar / Pengalaman</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={4}
              placeholder="Bagikan pengalaman menarik Anda berkunjung ke tempat ini..."
              placeholderTextColor={COLORS.textLight}
              value={newComment}
              onChangeText={setNewComment}
            />

            {/* Submit btn */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddReview}
              disabled={submittingReview}
            >
              {submittingReview ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Kirim Review</Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  imageSliderContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  swiper: {
    height: 320,
  },
  slide: {
    flex: 1,
    backgroundColor: COLORS.border,
  },
  slidePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  sliderGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight + 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  floatingButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  contentContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLORS.white,
    marginTop: -25,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  titleRow: {
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 32,
    marginBottom: 6,
  },
  ratingStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  weatherCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTextCol: {
    marginLeft: 12,
  },
  weatherLabel: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  weatherStatus: {
    fontSize: 14,
    color: '#115E59',
    fontWeight: 'bold',
    marginTop: 2,
  },
  weatherTemp: {
    fontSize: 22,
    fontWeight: '800',
    color: '#115E59',
  },
  divider: {
    height: 1.5,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
  },
  contactsSection: {
    marginTop: 24,
  },
  contactsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  contactCard: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waCard: {
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  emailCard: {
    backgroundColor: COLORS.primary,
  },
  contactCardText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewBtn: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addReviewText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyReviewsText: {
    color: COLORS.textLight,
    fontSize: 13,
    marginTop: 8,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  modalStars: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#F8FAFC',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

