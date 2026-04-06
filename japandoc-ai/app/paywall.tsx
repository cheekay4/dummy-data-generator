import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/user-store';
import {
  initIAP,
  disconnectIAP,
  fetchProducts,
  fetchSubscriptions,
  buyCredits,
  buySubscription,
  restoreIAPPurchases,
  verifyReceipt,
  completePurchase,
  getCreditsForProduct,
  purchaseUpdatedListener,
  purchaseErrorListener,
  CREDIT_PRODUCT_IDS,
  SUBSCRIPTION_PRODUCT_IDS,
  type Product,
  type Subscription,
} from '@/src/lib/iap';

const FALLBACK_CREDITS = [
  { id: 'scanlingo.credits.5', scans: 5, priceDisplay: '¥160' },
  { id: 'scanlingo.credits.30', scans: 30, priceDisplay: '¥500' },
  { id: 'scanlingo.credits.100', scans: 100, priceDisplay: '¥1,500' },
  { id: 'scanlingo.credits.300', scans: 300, priceDisplay: '¥3,500' },
];

const FALLBACK_SUBS = [
  { id: 'scanlingo.premium.monthly', priceDisplay: '¥980', trialKey: 'trialMonthly' },
  { id: 'scanlingo.premium.yearly', priceDisplay: '¥9,800', trialKey: 'trialYearly' },
];

function CreditPackCard({
  scans,
  priceDisplay,
  onPress,
  loading,
  t,
}: {
  scans: number;
  priceDisplay: string;
  onPress: () => void;
  loading: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: '#1A1A22',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: loading ? 0.6 : 1,
      }}
    >
      <View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
          {t('scans', { count: scans })}
        </Text>
        <Text style={{ fontSize: 12, color: '#9999AA', marginTop: 2 }}>
          {priceDisplay}
        </Text>
      </View>
      <View style={{ backgroundColor: '#E8443A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>{priceDisplay}</Text>
        )}
      </View>
    </Pressable>
  );
}

function SubscriptionCard({
  priceDisplay,
  trialKey,
  highlighted,
  onPress,
  loading,
  t,
}: {
  priceDisplay: string;
  trialKey: string;
  highlighted: boolean;
  onPress: () => void;
  loading: boolean;
  t: (key: string) => string;
}) {
  const features = ['featUnlimited', 'featHistory', 'featDeadlines', 'featNoAds'] as const;
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: '#1A1A22',
        borderRadius: 16,
        padding: 20,
        marginBottom: 10,
        borderWidth: highlighted ? 2 : 0,
        borderColor: highlighted ? '#E8443A' : 'transparent',
        opacity: loading ? 0.6 : 1,
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
  const { addCredits, setPurchaseStatus } = useUserStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [iapReady, setIapReady] = useState(false);

  useEffect(() => {
    let purchaseListener: { remove: () => void } | null = null;
    let errorListener: { remove: () => void } | null = null;

    async function setup() {
      const connected = await initIAP();
      if (!connected) return;
      setIapReady(true);

      const [prods, subs] = await Promise.all([fetchProducts(), fetchSubscriptions()]);
      setProducts(prods);
      setSubscriptions(subs);

      purchaseListener = purchaseUpdatedListener(async (purchase) => {
        const receipt = Platform.OS === 'ios'
          ? purchase.transactionReceipt || ''
          : purchase.purchaseToken || '';

        if (!receipt) return;

        try {
          const result = await verifyReceipt(receipt, purchase.productId, purchase.transactionId);
          if (result.valid) {
            if (result.type === 'credits') {
              await addCredits(result.credits);
            } else {
              await setPurchaseStatus('subscriber');
            }
            await completePurchase(purchase);
            setLoading(null);
            router.back();
          }
        } catch {
          setLoading(null);
          Alert.alert('Error', 'Purchase verification failed. Please try again.');
        }
      });

      errorListener = purchaseErrorListener(() => {
        setLoading(null);
      });
    }

    setup();

    return () => {
      purchaseListener?.remove();
      errorListener?.remove();
      disconnectIAP();
    };
  }, [addCredits, setPurchaseStatus, router]);

  const getProductPrice = useCallback(
    (productId: string): string => {
      const prod = products.find((p) => p.productId === productId);
      if (prod) return prod.localizedPrice;
      const sub = subscriptions.find((s) => s.productId === productId);
      if (sub) return sub.localizedPrice;
      return '';
    },
    [products, subscriptions],
  );

  const creditItems = CREDIT_PRODUCT_IDS.map((id) => {
    const fallback = FALLBACK_CREDITS.find((f) => f.id === id)!;
    return {
      id,
      scans: fallback.scans,
      priceDisplay: getProductPrice(id) || fallback.priceDisplay,
    };
  });

  const subItems = SUBSCRIPTION_PRODUCT_IDS.map((id) => {
    const fallback = FALLBACK_SUBS.find((f) => f.id === id)!;
    return {
      id,
      priceDisplay: getProductPrice(id) || fallback.priceDisplay,
      trialKey: fallback.trialKey,
    };
  });

  const handleBuyCredits = async (productId: string) => {
    if (!iapReady) {
      const credits = getCreditsForProduct(productId);
      await addCredits(credits);
      router.back();
      return;
    }
    setLoading(productId);
    const purchase = await buyCredits(productId);
    if (!purchase) setLoading(null);
  };

  const handleSubscribe = async (productId: string) => {
    if (!iapReady) {
      await setPurchaseStatus('subscriber');
      router.back();
      return;
    }
    setLoading(productId);
    const purchase = await buySubscription(productId);
    if (!purchase) setLoading(null);
  };

  const handleRestore = async () => {
    setLoading('restore');
    try {
      const purchases = await restoreIAPPurchases();
      const activeSub = purchases.find((p) =>
        SUBSCRIPTION_PRODUCT_IDS.includes(p.productId),
      );
      if (activeSub) {
        await setPurchaseStatus('subscriber');
        Alert.alert(t('restored') || 'Restored', t('restoredSub') || 'Subscription restored!');
        router.back();
        return;
      }
      Alert.alert(t('noRestore') || 'No Purchases', t('noRestoreMsg') || 'No previous purchases found.');
    } catch {
      Alert.alert('Error', 'Failed to restore purchases.');
    } finally {
      setLoading(null);
    }
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
        {subItems.map((sub, i) => (
          <SubscriptionCard
            key={sub.id}
            priceDisplay={sub.priceDisplay}
            trialKey={sub.trialKey}
            highlighted={i === 0}
            onPress={() => handleSubscribe(sub.id)}
            loading={loading === sub.id}
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
        {creditItems.map((pack) => (
          <CreditPackCard
            key={pack.id}
            scans={pack.scans}
            priceDisplay={pack.priceDisplay}
            onPress={() => handleBuyCredits(pack.id)}
            loading={loading === pack.id}
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
        <Pressable onPress={handleRestore} disabled={loading === 'restore'} style={{ marginTop: 20, alignItems: 'center' }}>
          {loading === 'restore' ? (
            <ActivityIndicator size="small" color="#2D7FF9" />
          ) : (
            <Text style={{ fontSize: 14, color: '#2D7FF9' }}>{t('restorePurchases')}</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#888' }}>{t('maybeLater')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
