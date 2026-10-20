import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Play,
  Disc3,
  ExternalLink,
  Send,
  Sparkles,
  Music,
  CheckCircle2,
  Camera,
} from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { getPerformanceWorks, PerformanceWork } from '@/lib/sanity';

const GALLERY_PHOTOS = [
  {
    src: require('../../../assets/images/gallery/470682296_18432761506076561_4740777405915033227_n.jpg'),
    caption: 'Classical Solo Recital • Punjab Gharana',
  },
  {
    src: require('../../../assets/images/gallery/639762287_18509265916076561_3876243902014117663_n.jpg'),
    caption: 'Vocal Sangat & Harmonium Jugalbandi',
  },
  {
    src: require('../../../assets/images/gallery/683740643_18523457047076561_941756929725314147_n.jpg'),
    caption: 'Acoustic Stage Setup & Bayan Modulation',
  },
  {
    src: require('../../../assets/images/gallery/706257018_18529122763076561_2437233484309581567_n.jpg'),
    caption: 'Festival Mehfil • Teentaal Drut Bandish',
  },
  {
    src: require('../../../assets/images/gallery/723663409_18535186444076561_94554391318084790_n.jpg'),
    caption: 'Gurukul Parampara • Intensive Riyaz',
  },
];

export default function RepertoireScreen() {
  const [works, setWorks] = useState<PerformanceWork[]>([]);
  const [loading, setLoading] = useState(true);

  // Stems Form
  const [producerName, setProducerName] = useState('');
  const [producerEmail, setProducerEmail] = useState('');
  const [trackBpmTaal, setTrackBpmTaal] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [stemsSubmitted, setStemsSubmitted] = useState(false);

  useEffect(() => {
    getPerformanceWorks()
      .then((data) => setWorks(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmitStems = () => {
    if (!producerName || !producerEmail) {
      Alert.alert('Required', 'Please enter your name and contact email.');
      return;
    }
    setStemsSubmitted(true);
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `🎼 Pranaam Surjeet Ji,\n\nI would like to commission remote 24-bit WAV tabla stems:\n\nName: ${producerName}\nEmail: ${producerEmail}\nBPM/Taal: ${trackBpmTaal}\nNotes: ${projectNotes}`
    );
    Linking.openURL(`https://wa.me/919810000000?text=${text}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>CONCERT ARCHIVE & RECORDINGS</Text>
            <View style={styles.badgeDot} />
          </View>
          <Text style={styles.title}>Repertoire & Stems</Text>
          <Text style={styles.subtitle}>
            Concert solos, festival archival recordings, and 24-bit remote studio stem commissions.
          </Text>
        </View>

        {/* Concert Works List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Archival Recitals</Text>
          <Text style={styles.sectionCount}>{works.length} Works</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.gold} style={{ marginVertical: 20 }} />
        ) : works.length === 0 ? (
          <GlassCard variant="dark" intensity={60} style={styles.emptyCard}>
            <Disc3 size={24} color={Colors.gold} style={{ alignSelf: 'center', marginBottom: 6 }} />
            <Text style={styles.emptyTitle}>Archive Synchronizing</Text>
            <Text style={styles.emptyDesc}>
              Concert recordings published in Sanity Studio will appear here automatically.
            </Text>
          </GlassCard>
        ) : (
          <View style={styles.worksList}>
            {works.map((work) => (
              <GlassCard key={work._id} variant="dark" intensity={70} style={styles.workCard}>
                <View style={styles.workMetaRow}>
                  <Text style={styles.workCategory}>
                    {work.category} • {work.year}
                  </Text>
                  {work.taal && <Text style={styles.workTaal}>{work.taal}</Text>}
                </View>

                <Text style={styles.workTitle}>{work.title}</Text>

                {work.venueOrAlbum && (
                  <Text style={styles.workVenue}>{work.venueOrAlbum}</Text>
                )}

                {work.description && (
                  <Text style={styles.workDesc} numberOfLines={2}>
                    {work.description}
                  </Text>
                )}

                {work.youtubeUrl && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(work.youtubeUrl)}
                    style={styles.watchButton}
                  >
                    <Play size={14} color={Colors.gold} fill={Colors.gold} />
                    <Text style={styles.watchButtonText}>Watch Archive Stream</Text>
                    <ExternalLink size={12} color={Colors.gold} />
                  </TouchableOpacity>
                )}
              </GlassCard>
            ))}
          </View>
        )}

        {/* Archival Performance Photographic Gallery */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <View>
            <Text style={styles.sectionTitle}>Archival Concert Gallery</Text>
            <Text style={styles.gallerySub}>Live stage recitals & jugalbandi moments</Text>
          </View>
          <Text style={styles.sectionCount}>{GALLERY_PHOTOS.length} Photographs</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryScroll}
        >
          {GALLERY_PHOTOS.map((photo, index) => (
            <View key={index} style={styles.galleryCard}>
              <Image source={photo.src} style={styles.galleryImage} resizeMode="cover" />
              <View style={styles.galleryScrim}>
                <View style={styles.galleryTagRow}>
                  <Camera size={11} color={Colors.gold} />
                  <Text style={styles.galleryTagText}>PUNJAB GHARANA LIVE</Text>
                </View>
                <Text style={styles.galleryCaption}>{photo.caption}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 24-Bit Studio Stem Commission Section */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Commission Studio Stems</Text>
        </View>

        <GlassCard variant="goldAccent" intensity={70} style={styles.stemsCard}>
          <Text style={styles.stemsTitle}>Remote 24-Bit WAV Acoustic Recording</Text>
          <Text style={styles.stemsDesc}>
            For film scores, Sufi productions, and commercial records. Recorded with matched condenser microphones with 48–72hr turnaround.
          </Text>

          {!stemsSubmitted ? (
            <View style={styles.stemsForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Producer / Artist Name *</Text>
                <TextInput
                  value={producerName}
                  onChangeText={setProducerName}
                  placeholder="e.g. Salim Merchant"
                  placeholderTextColor="rgba(245, 239, 230, 0.3)"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Email *</Text>
                <TextInput
                  value={producerEmail}
                  onChangeText={setProducerEmail}
                  placeholder="producer@studio.com"
                  placeholderTextColor="rgba(245, 239, 230, 0.3)"
                  style={styles.textInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Desired Tempo, Taal & Raag</Text>
                <TextInput
                  value={trackBpmTaal}
                  onChangeText={setTrackBpmTaal}
                  placeholder="e.g. 118 BPM, Teentaal, Raag Bhairavi"
                  placeholderTextColor="rgba(245, 239, 230, 0.3)"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Project Arrangement Specifics</Text>
                <TextInput
                  value={projectNotes}
                  onChangeText={setProjectNotes}
                  placeholder="Describe fills, Meend slides, dynamic Peshkar requirements..."
                  placeholderTextColor="rgba(245, 239, 230, 0.3)"
                  style={[styles.textInput, styles.textArea]}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <GlassButton
                title="Send Recording Request"
                onPress={handleSubmitStems}
                variant="gold"
                size="md"
                icon={<Send size={14} color={Colors.obsidian} />}
              />
            </View>
          ) : (
            <View style={styles.stemsSubmittedBox}>
              <CheckCircle2 size={32} color={Colors.emerald} style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text style={styles.stemsSubmittedTitle}>Inquiry Prepared</Text>
              <Text style={styles.stemsSubmittedDesc}>
                Thank you, <strong>{producerName}</strong>. You can chat directly with Surjeet on WhatsApp for immediate acoustic delivery.
              </Text>

              <GlassButton
                title="Chat with Surjeet on WhatsApp"
                onPress={handleWhatsAppInquiry}
                variant="gold"
                size="md"
                style={{ marginTop: 12 }}
              />

              <TouchableOpacity
                onPress={() => setStemsSubmitted(false)}
                style={{ alignSelf: 'center', marginTop: 10 }}
              >
                <Text style={{ fontFamily: Fonts.monoMedium, fontSize: 11, color: Colors.gold }}>
                  Send Another Request
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.obsidian,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  title: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 28,
    color: Colors.ivory,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.65)',
    lineHeight: 17,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 20,
    color: Colors.ivory,
  },
  sectionCount: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.45)',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 16,
    color: Colors.ivory,
    marginBottom: 2,
  },
  emptyDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.6)',
    textAlign: 'center',
  },
  worksList: {
    gap: 12,
  },
  gallerySub: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.55)',
    marginTop: 2,
  },
  galleryScroll: {
    gap: 14,
    paddingVertical: 6,
    paddingRight: 20,
  },
  galleryCard: {
    width: 260,
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1C191A',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  galleryImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  galleryScrim: {
    padding: 12,
    backgroundColor: 'rgba(20, 18, 19, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  galleryTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  galleryTagText: {
    fontFamily: Fonts.monoBold,
    fontSize: 8,
    color: Colors.gold,
    letterSpacing: 1,
  },
  galleryCaption: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: Colors.ivory,
    lineHeight: 15,
  },
  workCard: {
    padding: 14,
  },
  workMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  workCategory: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workTaal: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: 'rgba(245, 239, 230, 0.5)',
  },
  workTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
    marginBottom: 4,
  },
  workVenue: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.7)',
    marginBottom: 6,
  },
  workDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.55)',
    lineHeight: 15,
    marginBottom: 12,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  watchButtonText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  stemsCard: {
    padding: 16,
  },
  stemsTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
    marginBottom: 4,
  },
  stemsDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.65)',
    lineHeight: 16,
    marginBottom: 14,
  },
  stemsForm: {
    gap: 12,
  },
  inputGroup: {
    marginBottom: 2,
  },
  inputLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: 'rgba(20, 18, 19, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.12)',
    paddingHorizontal: 12,
    height: 42,
    color: Colors.ivory,
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
  },
  textArea: {
    height: 70,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  stemsSubmittedBox: {
    paddingVertical: 12,
  },
  stemsSubmittedTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
    textAlign: 'center',
    marginBottom: 4,
  },
  stemsSubmittedDesc: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },
});
