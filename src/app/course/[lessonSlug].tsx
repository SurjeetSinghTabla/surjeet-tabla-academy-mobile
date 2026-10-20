import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Share,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { getCourseLessons, CourseLesson } from '@/lib/sanity';
import { extractYouTubeId } from '@/lib/youtube';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LessonDetailScreen() {
  const { lessonSlug } = useLocalSearchParams<{ lessonSlug: string }>();

  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    getCourseLessons()
      .then((all) => {
        setLessons(all);
        const match =
          all.find((l) => l.slug?.current === lessonSlug || l._id === lessonSlug) || all[0];
        setActiveLesson(match || null);
      })
      .finally(() => setLoading(false));
  }, [lessonSlug]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingText}>Loading Sacred Lesson Stream...</Text>
      </SafeAreaView>
    );
  }

  if (!activeLesson) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>Lesson Not Found</Text>
        <GlassButton
          title="Return to Gurukul"
          onPress={() => router.back()}
          variant="gold"
          size="md"
        />
      </SafeAreaView>
    );
  }

  const youtubeVideoId = extractYouTubeId(activeLesson.youtubeUnlistedUrl);

  // Curriculum Navigation Helpers
  const currentIndex = lessons.findIndex((l) => l._id === activeLesson._id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const navigateToLesson = (lesson: CourseLesson) => {
    setActiveLesson(lesson);
  };

  const handleDownloadPdf = () => {
    if (activeLesson.pdfAttachmentUrl) {
      Linking.openURL(activeLesson.pdfAttachmentUrl);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={16} color={Colors.gold} />
            <Text style={styles.backText}>All Lessons</Text>
          </TouchableOpacity>

          <View style={styles.topRightActions}>
            {youtubeVideoId && (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`https://www.youtube.com/watch?v=${youtubeVideoId}`)
                }
                style={styles.openInYtPill}
              >
                <Text style={styles.openInYtText}>YouTube</Text>
                <ExternalLink size={12} color={Colors.gold} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 16:9 Video Player Viewport */}
        <View style={styles.videoPlayerContainer}>
          {youtubeVideoId ? (
            <YoutubePlayer
              height={(SCREEN_WIDTH - 40) * (9 / 16)}
              play={videoPlaying}
              videoId={youtubeVideoId}
              webViewProps={{
                allowsFullscreenVideo: true,
                androidLayerType: 'hardware',
              }}
              initialPlayerParams={{
                rel: false,
                modestbranding: true,
                preventFullScreen: false,
              }}
            />
          ) : (
            <View style={styles.noVideoPlaceholder}>
              <Text style={styles.noVideoText}>Video stream initializing...</Text>
            </View>
          )}
        </View>

        {/* Lesson Title & Module Info */}
        <View style={styles.lessonMetaHeader}>
          <View style={styles.moduleTagRow}>
            <Text style={styles.moduleTag}>
              MODULE {activeLesson.moduleNumber} • LESSON {activeLesson.lessonOrder}
            </Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.taalTag}>{activeLesson.taal}</Text>
          </View>

          <Text style={styles.lessonTitle}>{activeLesson.title}</Text>
        </View>

        {/* Bol Notation Sheet Card */}
        <GlassCard variant="goldAccent" intensity={70} style={styles.bolNotationCard}>
          <View style={styles.bolHeader}>
            <View style={styles.bolHeaderLeft}>
              <BookOpen size={16} color={Colors.gold} />
              <Text style={styles.bolHeaderTitle}>Bandish Bol Notation</Text>
            </View>

            {activeLesson.pdfAttachmentUrl && (
              <TouchableOpacity onPress={handleDownloadPdf} style={styles.pdfDownloadButton}>
                <Download size={13} color={Colors.emerald} />
                <Text style={styles.pdfDownloadText}>PDF Sheet</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bolContentBox}>
            <Text style={styles.bolText}>
              {activeLesson.bolNotation || 'No bol notation transcript attached to this lesson.'}
            </Text>
          </View>

          {activeLesson.summary ? (
            <View style={styles.pedagogicalContext}>
              <Text style={styles.contextLabel}>Pedagogical Guidance:</Text>
              <Text style={styles.contextText}>{activeLesson.summary}</Text>
            </View>
          ) : null}
        </GlassCard>

        {/* Lesson Pagination Nav */}
        <View style={styles.paginationRow}>
          {prevLesson ? (
            <TouchableOpacity
              onPress={() => navigateToLesson(prevLesson)}
              style={styles.navButton}
            >
              <ChevronLeft size={16} color={Colors.gold} />
              <View>
                <Text style={styles.navSub}>PREVIOUS</Text>
                <Text numberOfLines={1} style={styles.navTitle}>
                  {prevLesson.title}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}

          {nextLesson && (
            <TouchableOpacity
              onPress={() => navigateToLesson(nextLesson)}
              style={[styles.navButton, { alignItems: 'flex-end' }]}
            >
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.navSub}>NEXT LESSON</Text>
                <Text numberOfLines={1} style={styles.navTitle}>
                  {nextLesson.title}
                </Text>
              </View>
              <ChevronRight size={16} color={Colors.gold} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.obsidian,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: Colors.gold,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  errorTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 22,
    color: Colors.ivory,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  backText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openInYtPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
  },
  openInYtText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  videoPlayerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
  },
  noVideoPlaceholder: {
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  noVideoText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: 'rgba(245, 239, 230, 0.5)',
  },
  lessonMetaHeader: {
    marginBottom: 16,
  },
  moduleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  moduleTag: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 0.8,
  },
  dotSeparator: {
    color: 'rgba(245, 239, 230, 0.3)',
  },
  taalTag: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: 'rgba(245, 239, 230, 0.6)',
  },
  lessonTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 24,
    color: Colors.ivory,
  },
  bolNotationCard: {
    marginBottom: 20,
  },
  bolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bolHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bolHeaderTitle: {
    fontFamily: Fonts.serifSemiBold,
    fontSize: 18,
    color: Colors.ivory,
  },
  pdfDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  pdfDownloadText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.emerald,
  },
  bolContentBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.06)',
    marginBottom: 12,
  },
  bolText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    color: Colors.ivory,
    lineHeight: 20,
  },
  pedagogicalContext: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 239, 230, 0.08)',
  },
  contextLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  contextText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(245, 239, 230, 0.65)',
    lineHeight: 16,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(245, 239, 230, 0.08)',
  },
  navButtonPlaceholder: {
    flex: 1,
  },
  navSub: {
    fontFamily: Fonts.monoMedium,
    fontSize: 9,
    color: Colors.gold,
    letterSpacing: 0.8,
  },
  navTitle: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: Colors.ivory,
    maxWidth: 120,
  },
});
