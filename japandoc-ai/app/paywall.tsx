import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/user-store';

const CREDIT_PACKS = [
  { id: 'scanlingo.credits.5', scans: 5, price: 160, priceDisplay: '¥160' },
  { id: 'scanlingo.credits.30', scans: 30, price: 500, priceDisplay: '¥500' },
  { id: 'scanlingo.credits.100', scans: 100, price: 1500, priceDisplay: '¥1,500' },
  { id: 'scanlingo.credits.300', scans: 300, price: 3500, priceDisplay: '¥3,500' },
];

const SUBSCRIPTIONS = [
  { id: 'scanlingo.premium.monthly', priceDisplay: '¥980', trialKey: 'trialMonthly', yearly: false },
  { id: 'scanlingo.premium.yearly', priceDisplay: '¥9,800', trialKey: 'trialYearly', yearly: true },
];

function CreditPackCard({
  scans,
  price,
  priceDisplay,
  onPress,
  t,
}: {
  scans: number;
  price: number;
  priceDisplay: string;
  onPress: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#1A1A22',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
          {t('scans', { count: scans })}
        </Text>
        <Text style={{ fontSize: 12, color: '#9999AA', marginTop: 2 }}>
          {priceDisplay} ({t('perScan', { price: `${Math.round(price / scans)}¥` })})
        </Text>
      </View>
      <View style={{ backgroundColor: '#E8443A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>{priceDisplay}</Text>
      </View>
    </Pressable>
  );
}

function SubscriptionCard({
  priceDisplay,
  trialKey,
  highlighted,
  onPress,
  t,
}: {
  priceDisplay: string;
  trialKey: string;
  highlighted: boolean;
  onPress: () => void;
  t: (key: string) => string;
}) {
  const features = ['featUnlimited', 'featHistory', 'featDeadlines', 'featNoAds'] as const;
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#1A1A22',
        borderRadius: 16,
        padding: 20,
        marginBottom: 10,
        borderWidth: highlighted ? 2 : 0,
        borderColor: highlighted ? '#E8443A' : 'transparent',
      }}
    >
      {highlighted && (
        <View style={{ position: 'absolute', top: -10, right: 16, backgroundColor: '#E8443A', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '700' }}>{t('recommended')}</Text>
        </View>
      )}
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
        {t('premium')}
      </Text>
      <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginTop: 4 }}>
        {priceDisplay}
      </Text>
      <Text style={{ fontSize: 13, color: '#1DB954', marginTop: 4 }}>
        {t(trialKey)}
      </Text>
      <View style={{ marginTop: 12 }}>
        {features.map((feat) => (
          <Text key={feat} style={{ fontSize: 13, color: '#A0A0B0', marginTop: 2 }}>
            ✓ {t(feat)}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}

export default function PaywallScreen() {
  const { t } = useTranslation('paywall');
  const router = useRouter();
  const { addCredits, setPurchaseStatus, restorePurchases } = useUserStore();

  const handleBuyCredits = async (scans: number) => {
    // TODO: Phase 1-D manual — integrate react-native-iap purchase flow
    // For now, simulate purchase
    await addCredits(scans);
    router.back();
  };

  const handleSubscribe = async () => {
    // TODO: Phase 1-D manual — integrate react-native-iap subscription flow
    await setPurchaseStatus('subscriber');
    router.back();
  };

  const handleRestore = async () => {
    await restorePurchases();
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F13' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' }}>
            {t('title')}
          </Text>
          <Text style={{ fontSize: 15, color: '#A0A0B0', textAlign: 'center', marginTop: 8 }}>
            {t('subtitle')}
          </Text>
        </View>

        {/* Subscriptions */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 10 }}>
          {t('unlimitedAccess')}
        </Text>
        {SUBSCRIPTIONS.map((sub, i) => (
          <SubscriptionCard
            key={sub.id}
            priceDisplay={sub.priceDisplay}
            trialKey={sub.trialKey}
            highlighted={i === 0}
            onPress={handleSubscribe}
            t={t}
          />
        ))}

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#222' }} />
          <Text style={{ marginHorizontal: 12, fontSize: 13, color: '#9999AA' }}>{t('or')}</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#222' }} />
        </View>

        {/* Credit packs */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 10 }}>
          {t('creditPacks')}
        </Text>
        {CREDIT_PACKS.map((pack) => (
          <CreditPackCard
            key={pack.id}
            scans={pack.scans}
            price={pack.price}
            priceDisplay={pack.priceDisplay}
            onPress={() => handleBuyCredits(pack.scans)}
            t={t}
          />
        ))}

        {/* Free hint */}
        <View style={{ backgroundColor: '#1A1A22', borderRadius: 12, padding: 14, marginTop: 16 }}>
          <Text style={{ fontSize: 13, color: '#9999AA', textAlign: 'center' }}>
            {t('freeHint')}
          </Text>
        </View>

        {/* Restore + Close */}
        <Pressable onPress={handleRestore} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#2D7FF9' }}>{t('restorePurchases')}</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#888' }}>{t('maybeLater')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
