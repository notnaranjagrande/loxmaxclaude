import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import type { ScanResult } from "../types/scan";
import { fetchScans, deleteScan } from "../lib/scans";
import { useAuth } from "../lib/AuthContext";
import { colors, radii } from "../lib/theme";

type Props = NativeStackScreenProps<RootStackParamList, "History">;

export function HistoryScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchScans(session.user.id);
      setScans(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? "Kunde inte hämta historik.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(scan: ScanResult) {
    if (!scan.photoPath) return;
    setScans((prev) => prev.filter((s) => s.id !== scan.id));
    try {
      await deleteScan(scan.id, scan.photoPath);
    } catch (err) {
      console.warn(err);
      load();
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Historik</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : scans.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyText}>Inga scans än. Gör din första scan!</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("Scan")}>
            <Text style={styles.primaryButtonText}>Starta scan</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => navigation.navigate("Results", { scan: item, isNew: false })}
              onLongPress={() => handleDelete(item)}
            >
              <Image source={{ uri: item.photoUri }} style={styles.thumb} />
              <View style={styles.rowInfo}>
                <Text style={styles.rowDate}>
                  {new Date(item.createdAt).toLocaleDateString("sv-SE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
                <Text style={styles.rowSub}>Tryck och håll för att ta bort</Text>
              </View>
              <View style={styles.rowScore}>
                <Text style={styles.rowScoreText}>{item.overallScore}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: { color: colors.text, fontSize: 16 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  centerContent: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: "center", marginBottom: 20 },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: radii.pill,
  },
  primaryButtonText: { color: colors.bg, fontWeight: "700", fontSize: 15 },
  listContent: { paddingHorizontal: 20, gap: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  thumb: { width: 52, height: 52, borderRadius: radii.sm, backgroundColor: colors.bgAlt },
  rowInfo: { flex: 1 },
  rowDate: { color: colors.text, fontSize: 14, fontWeight: "600" },
  rowSub: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  rowScore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  rowScoreText: { color: colors.primary, fontWeight: "700", fontSize: 14 },
});
