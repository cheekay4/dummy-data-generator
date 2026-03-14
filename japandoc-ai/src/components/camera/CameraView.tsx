import { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Platform, Pressable, AppState, Linking, ActivityIndicator } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScanStore } from '@/src/stores/scan-store';
import { useUserStore } from '@/src/stores/user-store';
import { ShutterButton } from './ShutterButton';
import { FlashToggle } from './FlashToggle';
import { GalleryButton } from './GalleryButton';
import { LiveTextBar } from './LiveTextBar';

type FlashMode = 'auto' | 'on' | 'off';

export function CameraScreen() {
  const { t } = useTranslation('camera');
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const hasRequestedRef = useRef(false);

  // Re-check permission when app returns from Settings
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        // Re-trigger permission check by requesting again
        requestPermission();
      }
    });
    return () => sub.remove();
  }, [requestPermission]);

  // Auto-request permission once on mount if not yet granted
  useEffect(() => {
    if (!hasRequestedRef.current && permission && !permission.granted && permission.canAskAgain) {
      hasRequestedRef.current = true;
      requestPermission();
    }
  }, [permission?.granted, permission?.canAskAgain, requestPermission]);
  const [flashMode, setFlashMode] = useState<FlashMode>('auto');
  const [cameraMountError, setCameraMountError] = useState<string | null>(null);
  const cameraRef = useRef<ExpoCameraView>(null);
  const { startScan, isScanning, limitReached, clearResult } = useScanStore();
  const { creditBalance, purchaseStatus, dailyFreeScansUsed } = useUserStore();
  const insets = useSafeAreaInsets();

  // Navigate to paywall when limit is reached
  useEffect(() => {
    if (limitReached) {
      clearResult();
      router.push('/paywall');
    }
  }, [limitReached, clearResult, router]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isScanning) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) {
      startScan(photo.uri);
    }
  }, [isScanning, startScan]);

  const handleGallery = useCallback(async () => {
    if (isScanning) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      startScan(result.assets[0].uri);
    }
  }, [isScanning, startScan]);

  const handleDemoScan = useCallback(() => {
    if (isScanning) return;
    startScan('demo://mock-image');
  }, [isScanning, startScan]);

  const toggleFlash = useCallback(() => {
    setFlashMode((prev) =>
      prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto'
    );
  }, []);

  // Web or no camera: show gallery + demo buttons instead of camera
  const isWeb = Platform.OS === 'web';
  const cameraUnavailable = isWeb || !permission?.granted || !!cameraMountError;

  if (!isWeb && !permission) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#E8443A" />
        <Text style={{ color: '#999', marginTop: 12, fontSize: 14 }}>{t('loadingCamera')}</Text>
      </View>
    );
  }

  const scanCountLabel =
    purchaseStatus === 'subscriber'
      ? '∞'
      : purchaseStatus === 'credits'
        ? `${creditBalance} credits`
        : `${dailyFreeScansUsed}/3`;

  if (cameraUnavailable) {
    return (
      <View style={{ flex: 1, backgroundColor: '#111' }}>
        {/* Top bar */}
        <View style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 12, marginRight: 4 }}>🇯🇵</Text>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500' }}>{t('targetLanguage')}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ color: '#FFF', fontSize: 12 }}>{scanCountLabel}</Text>
            </View>
            <Pressable onPress={() => router.push('/(tabs)/history')} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>📋</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/(tabs)/settings')} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
            📷 {t('targetLanguage')}
          </Text>
          <Text style={{ color: '#999', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
            {isWeb ? t('webModeMessage') : t('cameraPermissionMessage')}
          </Text>

          {/* Gallery pick */}
          <Pressable
            onPress={handleGallery}
            style={{ backgroundColor: '#2563EB', borderRadius: 16, paddingHorizontal: 32, paddingVertical: 16, marginBottom: 16, width: 256, alignItems: 'center' }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              🖼️ {t('selectFromGallery')}
            </Text>
          </Pressable>

          {/* Demo scan */}
          <Pressable
            onPress={handleDemoScan}
            style={{ backgroundColor: '#374151', borderRadius: 16, paddingHorizontal: 32, paddingVertical: 16, marginBottom: 24, width: 256, alignItems: 'center' }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
              ✨ {t('tryDemo')}
            </Text>
          </Pressable>

          {!isWeb && !permission?.granted && (
            <View style={{ alignItems: 'center', gap: 12 }}>
              {permission?.canAskAgain ? (
                <Pressable
                  onPress={requestPermission}
                  style={{ backgroundColor: '#E8443A', borderRadius: 16, paddingHorizontal: 32, paddingVertical: 16, width: 256, alignItems: 'center' }}
                >
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
                    {t('grantCameraPermission')}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => Linking.openSettings()}
                  style={{ backgroundColor: '#E8443A', borderRadius: 16, paddingHorizontal: 32, paddingVertical: 16, width: 256, alignItems: 'center' }}
                >
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
                    {t('openSettings') || 'Open Settings'}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <View style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 12, marginRight: 4 }}>🇯🇵</Text>
          <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500' }}>{t('targetLanguage')}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ color: '#FFF', fontSize: 12 }}>{scanCountLabel}</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/history')} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18 }}>📋</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/settings')} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      {/* Camera */}
      <ExpoCameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        flash={flashMode}
        onCameraReady={() => {
          if (cameraMountError) setCameraMountError(null);
        }}
        onMountError={(e: { message: string }) => {
          console.error('[ScanLingo] Camera mount error:', e.message);
          setCameraMountError(e.message);
        }}
      />

      {/* Bottom overlay */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <LiveTextBar />
        <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 24, paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <GalleryButton onPress={handleGallery} />
          <ShutterButton onPress={handleCapture} disabled={isScanning} />
          <FlashToggle mode={flashMode} onToggle={toggleFlash} />
        </View>
      </View>
    </View>
  );
}
