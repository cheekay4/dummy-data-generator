import { View, Text, Pressable, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { requestCameraPermissionsAsync } from 'expo-camera';
import { ProgressDots } from '@/src/components/onboarding/ProgressDots';

export default function CameraPermissionScreen() {
  const router = useRouter();
  const { t } = useTranslation('onboarding');
  const insets = useSafeAreaInsets();

  const handleGo = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('permAlertTitle') || 'Camera Permission',
          t('permAlertMsg') || 'Camera access is needed to scan Japanese text. You can enable it later in Settings.',
        );
      }
    }
    router.push('/onboarding/value');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable onPress={() => router.back()} style={[styles.backButton, { top: insets.top + 8 }]}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>
      <View style={styles.content}>
        <View style={styles.visual}>
          <Text style={styles.cameraEmoji}>{'\ud83d\udcf7'}</Text>
          <View style={styles.overlayBar}>
            <Text style={styles.overlayText}>Today's Set Meal \u00a5850</Text>
          </View>
        </View>

        <Text style={styles.title}>{t('permTitle')}</Text>
        <Text style={styles.desc}>{t('permDesc')}</Text>

        <Pressable style={styles.ctaButton} onPress={handleGo}>
          <Text style={styles.ctaText}>{t('permBtn')}</Text>
        </Pressable>
      </View>
      <ProgressDots total={4} current={2} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F13',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  visual: {
    width: 180,
    height: 140,
    backgroundColor: '#1A1A22',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  cameraEmoji: {
    fontSize: 48,
  },
  overlayBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E8443A',
    paddingVertical: 6,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  desc: {
    fontSize: 13,
    color: '#A0A0B0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  ctaButton: {
    backgroundColor: '#E8443A',
    borderRadius: 14,
    paddingVertical: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#FFF',
    marginTop: -2,
  },
});
