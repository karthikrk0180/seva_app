/**
 * Media Management — Superadmin only.
 * Upload images to Cloudinary (backend-signed), show last uploaded, delete.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'react-native-image-picker';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { useAuthStore } from 'src/store/auth.store';
import { mediaService, cloudinaryImageUrl, MediaAsset, LocalImageFile } from 'src/services/media.service';
import { Button } from 'src/components/common/Button';

export const MediaManagementScreen = () => {
  const { user } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAsset, setLastAsset] = useState<MediaAsset | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSuperAdmin = user?.role?.toLowerCase() === 'superadmin';

  if (!isSuperAdmin) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.denied}>
          <Text style={TYPOGRAPHY.h3}>Media management</Text>
          <Text style={styles.deniedText}>Only superadmin users can manage media.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const pickAndUpload = async () => {
    setError(null);
    try {
      const launchImageLibrary = ImagePicker?.launchImageLibrary;
      if (typeof launchImageLibrary !== 'function') {
        setError('Image picker is not available. Rebuild the app if you just added this feature.');
        return;
      }
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        setError(result.errorMessage || 'Failed to pick image');
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      const file: LocalImageFile = {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'upload.jpg',
        fileSize: asset.fileSize,
      };

      setUploading(true);
      const { registration } = await mediaService.uploadMedia(file);
      setLastAsset(registration);
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete media',
      'Remove this asset from the app? It will be deleted from the server.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setError(null);
            setDeletingId(id);
            try {
              await mediaService.deleteMedia(id);
              if (lastAsset?.id === id) setLastAsset(null);
            } catch (err: any) {
              setError(err?.message || 'Delete failed.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={TYPOGRAPHY.h2}>Media</Text>
        <Text style={styles.subtitle}>Upload images (Cloudinary). Superadmin only.</Text>

        <Button
          title={uploading ? 'Uploading…' : 'Pick & upload image'}
          onPress={pickAndUpload}
          disabled={uploading}
          style={styles.uploadButton}
        />
        {uploading && <ActivityIndicator size="small" style={styles.progress} color={COLORS.primary} />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {lastAsset && (
          <View style={styles.card}>
            <Text style={TYPOGRAPHY.caption}>Last uploaded</Text>
            <Image
              source={{ uri: cloudinaryImageUrl(lastAsset.public_id, 'w_400,h_300,c_fill') }}
              style={styles.thumb}
              resizeMode="cover"
            />
            <Text style={styles.meta} numberOfLines={1}>
              {lastAsset.public_id}
            </Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(lastAsset.id)}
              disabled={deletingId === lastAsset.id}
            >
              {deletingId === lastAsset.id ? (
                <ActivityIndicator size="small" color={COLORS.text.error} />
              ) : (
                <Text style={styles.deleteBtnText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.l, paddingBottom: SPACING.xxl },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.text.secondary, marginBottom: SPACING.l },
  uploadButton: { marginBottom: SPACING.m },
  progress: { marginBottom: SPACING.s },
  errorText: { ...TYPOGRAPHY.caption, color: COLORS.text.error, marginBottom: SPACING.m },
  denied: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.l },
  deniedText: { ...TYPOGRAPHY.body, color: COLORS.text.secondary, textAlign: 'center', marginTop: SPACING.s },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginTop: SPACING.l,
  },
  thumb: { width: '100%', height: 200, borderRadius: 8, marginVertical: SPACING.s },
  meta: { ...TYPOGRAPHY.caption, color: COLORS.text.secondary, marginBottom: SPACING.s },
  deleteBtn: { alignSelf: 'flex-start', paddingVertical: SPACING.s, paddingHorizontal: SPACING.m },
  deleteBtnText: { ...TYPOGRAPHY.button, color: COLORS.text.error },
});
