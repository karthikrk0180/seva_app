import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useVoiceStore } from 'src/services/voice.service';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
// Assuming you might use an Icon library, for now using Text as icon
// import Icon from 'react-native-vector-icons/MaterialIcons';

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}

export const VoiceSearchModal = ({ visible, onClose, onResult }: VoiceModalProps) => {
  const { isListening, results, error, startListening, stopListening, cancelListening, reset } = useVoiceStore();

  useEffect(() => {
    if (visible) {
      startListening();
    } else {
      stopListening();
      reset();
    }
    return () => {
        cancelListening(); // Cleanup
    };
  }, [visible]);

  useEffect(() => {
    // Auto-select text if silence/done? 
    // For now, let user tap the result or we can debounce and select.
    // Simplifying: If results exist, updating "Live" text.
  }, [results]);

  const handleSelect = (text: string) => {
      onResult(text);
      onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
            <Text style={TYPOGRAPHY.h3}>Speak Now</Text>
            
            <View style={styles.micContainer}>
                {isListening ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                    <Text style={{ fontSize: 50 }}>🎤</Text>
                )}
            </View>

            {error && <Text style={{ color: 'red', marginTop: SPACING.m }}>{error}</Text>}

            <View style={styles.resultsContainer}>
                {results.map((res, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSelect(res)}>
                        <Text style={styles.resultText}>{res}</Text>
                    </TouchableOpacity>
                ))}
                {results.length === 0 && isListening && (
                    <Text style={TYPOGRAPHY.caption}>Listening...</Text>
                )}
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={{ color: COLORS.surface }}>Cancel</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.xl, alignItems: 'center', minHeight: 300 },
  micContainer: { marginVertical: SPACING.xl, padding: SPACING.l, borderRadius: 50, backgroundColor: COLORS.background },
  resultsContainer: { width: '100%', alignItems: 'center', marginBottom: SPACING.l },
  resultText: { ...TYPOGRAPHY.h3, marginVertical: SPACING.s, textAlign: 'center' },
  closeButton: { marginTop: SPACING.l, padding: SPACING.m, backgroundColor: COLORS.accent, borderRadius: 8 }
});
