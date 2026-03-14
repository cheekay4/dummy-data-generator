import { View } from 'react-native';
import { CameraScreen } from '@/src/components/camera/CameraView';
import { ScanResultSheet } from '@/src/components/bottom-sheet/ScanResultSheet';

export default function ScanTab() {
  return (
    <View style={{ flex: 1 }}>
      <CameraScreen />
      <ScanResultSheet />
    </View>
  );
}
