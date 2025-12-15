import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../lib/supabase";
import { useTheme } from "../theme/ThemeContext";

// 🔧 ここを変えると Friend 画面のパネル高さが変わる
const PANEL_MIN_HEIGHT = 695;

// ===== MashOS 設定 =====
// Expo を想定: EXPO_PUBLIC_MASHOS_URL を設定しておくと便利
// 例) EXPO_PUBLIC_MASHOS_URL=https://xxxxx.ngrok.app
const MASHOS_BASE_URL =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.EXPO_PUBLIC_MASHOS_URL || process.env.MASHOS_BASE_URL)) ||
  "http://localhost:8765";

// ===== 表示用定数 =====
const STRENGTH_LABEL = {
  weak: "弱",
  medium: "中",
  strong: "強",
};

function emotionTint(emotion) {
  switch (emotion) {
    case "喜び":
      return { bg: "rgba(16,185,129,0.12)", text: "#065F46" }; // green
    case "悲しみ":
      return { bg: "rgba(99,102,241,0.12)", text: "#3730A3" }; // indigo
    case "怒り":
      return { bg: "rgba(239,68,68,0.12)", text: "#7F1D1D" }; // red
    case "不安":
      return { bg: "rgba(56,189,248,0.12)", text: "#0369A1" }; // cyan-ish
    case "平穏":
      return { bg: "rgba(129,140,248,0.12)", text: "#3730A3" }; // calm
    default:
      return { bg: "rgba(107,114,128,0.12)", text: "#374151" };
  }
}

function formatTimeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function getAccessTokenOrThrow() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data?.session?.access_token;
  if (!token) {
    throw new Error(
      "ログイン情報が取得できませんでした（access_token が空です）"
    );
  }
  return token;
}

async function getUserIdOrThrow() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const uid = data?.user?.id;
  if (!uid) throw new Error("ユーザーIDが取得できませんでした");
  return uid;
}

async function mashosFetchJson(path, { method = "GET", body } = {}) {
  const token = await getAccessTokenOrThrow();
  const res = await fetch(`${MASHOS_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const msg =
      json?.detail || json?.message || json?.error || json?.raw || "API Error";
    throw new Error(msg);
  }

  return json;
}

export default function FriendsScreen() {
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // ===== feed（既存） =====
  const [feed, setFeed] = useState([]); // { id, ownerName, items[], timeLabel }
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ===== friend 管理（追加） =====
  const [modalVisible, setModalVisible] = useState(false);
  const [tab, setTab] = useState("friends"); // friends | requests | add
  const [manageLoading, setManageLoading] = useState(false);
  const [manageError, setManageError] = useState("");

  const [myProfile, setMyProfile] = useState(null); // { id, displayName, friendCode }
  const [friendsList, setFriendsList] = useState([]); // { userId, displayName }

  const [incoming, setIncoming] = useState([]); // pending: { id, requesterUserId, requesterName, timeLabel }
  const [outgoing, setOutgoing] = useState([]); // pending: { id, requestedUserId, requestedName, timeLabel }

  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [sending, setSending] = useState(false);
  const [actingRequestId, setActingRequestId] = useState(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data, error } = await supabase
        .from("friend_emotion_feed")
        .select("id, owner_name, items, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const rows = Array.isArray(data) ? data : [];

      const mapped = rows.map((row) => ({
        id: row.id,
        ownerName: row.owner_name || "Friend",
        items: Array.isArray(row.items) ? row.items : [],
        timeLabel: formatTimeLabel(row.created_at),
      }));

      setFeed(mapped);
    } catch (e) {
      console.error("friend feed load error:", e);
      setErrorMsg(String(e?.message || e));
      setFeed([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyProfile = useCallback(async (uid) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, friend_code")
      .eq("id", uid)
      .maybeSingle();

    if (error) throw error;

    // profiles が未作成の場合は、最小プロフィールを作る（friend_code はDB側で自動生成）
    if (!data) {
      const { error: insErr } = await supabase
        .from("profiles")
        .insert({ id: uid, display_name: "User" });

      // すでに作成済み等で失敗しても、次の SELECT を試す
      if (insErr) {
        console.warn("profiles insert fallback error:", insErr);
      }

      const { data: again, error: againErr } = await supabase
        .from("profiles")
        .select("id, display_name, friend_code")
        .eq("id", uid)
        .maybeSingle();

      if (againErr) throw againErr;

      setMyProfile({
        id: uid,
        displayName: again?.display_name || "",
        friendCode: again?.friend_code || "",
      });
      return;
    }

    setMyProfile({
      id: uid,
      displayName: data.display_name || "",
      friendCode: data.friend_code || "",
    });
  }, []);

  const loadFriendsList = useCallback(async (uid) => {
    // friendships は「自分の行」だけ select できる想定
    const { data, error } = await supabase
      .from("friendships")
      .select("friend_user_id, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    const ids = rows.map((r) => r.friend_user_id).filter(Boolean);

    if (ids.length === 0) {
      setFriendsList([]);
      return;
    }

    // profiles は誰でも参照OKのポリシー想定
    const { data: profs, error: pErr } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", ids);

    if (pErr) throw pErr;

    const map = new Map();
    (Array.isArray(profs) ? profs : []).forEach((p) => {
      map.set(p.id, p.display_name || "Friend");
    });

    const list = rows.map((r) => ({
      userId: r.friend_user_id,
      displayName: map.get(r.friend_user_id) || "Friend",
    }));

    setFriendsList(list);
  }, []);

  const loadRequests = useCallback(async (uid) => {
    const { data: inData, error: inErr } = await supabase
      .from("friend_requests")
      .select("id, requester_user_id, created_at")
      .eq("requested_user_id", uid)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (inErr) throw inErr;

    const { data: outData, error: outErr } = await supabase
      .from("friend_requests")
      .select("id, requested_user_id, created_at")
      .eq("requester_user_id", uid)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (outErr) throw outErr;

    const inRows = Array.isArray(inData) ? inData : [];
    const outRows = Array.isArray(outData) ? outData : [];

    const needProfileIds = new Set();
    inRows.forEach((r) => r.requester_user_id && needProfileIds.add(r.requester_user_id));
    outRows.forEach((r) => r.requested_user_id && needProfileIds.add(r.requested_user_id));

    let profileMap = new Map();
    const idList = Array.from(needProfileIds);
    if (idList.length > 0) {
      const { data: profs, error: pErr } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", idList);

      if (pErr) throw pErr;

      profileMap = new Map(
        (Array.isArray(profs) ? profs : []).map((p) => [p.id, p.display_name || "Friend"])
      );
    }

    setIncoming(
      inRows.map((r) => ({
        id: r.id,
        requesterUserId: r.requester_user_id,
        requesterName: profileMap.get(r.requester_user_id) || "Friend",
        timeLabel: formatTimeLabel(r.created_at),
      }))
    );

    setOutgoing(
      outRows.map((r) => ({
        id: r.id,
        requestedUserId: r.requested_user_id,
        requestedName: profileMap.get(r.requested_user_id) || "Friend",
        timeLabel: formatTimeLabel(r.created_at),
      }))
    );
  }, []);

  const loadManageAll = useCallback(async () => {
    setManageLoading(true);
    setManageError("");

    try {
      const uid = await getUserIdOrThrow();
      await Promise.all([
        loadMyProfile(uid),
        loadFriendsList(uid),
        loadRequests(uid),
      ]);
    } catch (e) {
      console.error("friends manage load error:", e);
      setManageError(String(e?.message || e));
    } finally {
      setManageLoading(false);
    }
  }, [loadFriendsList, loadMyProfile, loadRequests]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    if (modalVisible) {
      // モーダルを開いたら最新を取得
      loadManageAll();
    }
  }, [modalVisible, loadManageAll]);

  const sendRequest = useCallback(async () => {
    const code = friendCodeInput.trim();
    if (!code) {
      Alert.alert("入力が必要です", "相手のフレンドコードを入力してね");
      return;
    }

    setSending(true);
    setManageError("");

    try {
      await mashosFetchJson("/friends/request", {
        method: "POST",
        body: { friend_code: code },
      });

      Alert.alert("送信しました", "フレンド申請を送りました");
      setFriendCodeInput("");
      setTab("requests");
      await loadManageAll();
    } catch (e) {
      console.error("send friend request error:", e);
      Alert.alert("送信できませんでした", String(e?.message || e));
    } finally {
      setSending(false);
    }
  }, [friendCodeInput, loadManageAll]);

  const acceptRequest = useCallback(
    async (requestId) => {
      setActingRequestId(requestId);
      setManageError("");
      try {
        await mashosFetchJson(`/friends/requests/${requestId}/accept`, {
          method: "POST",
        });
        Alert.alert("承諾しました", "フレンドになりました");
        await loadManageAll();
      } catch (e) {
        console.error("accept request error:", e);
        Alert.alert("承諾できませんでした", String(e?.message || e));
      } finally {
        setActingRequestId(null);
      }
    },
    [loadManageAll]
  );

  const rejectRequest = useCallback(
    async (requestId) => {
      setActingRequestId(requestId);
      setManageError("");
      try {
        await mashosFetchJson(`/friends/requests/${requestId}/reject`, {
          method: "POST",
        });
        Alert.alert("拒否しました", "申請を拒否しました");
        await loadManageAll();
      } catch (e) {
        console.error("reject request error:", e);
        Alert.alert("拒否できませんでした", String(e?.message || e));
      } finally {
        setActingRequestId(null);
      }
    },
    [loadManageAll]
  );

  const renderFeedItem = ({ item }) => {
    const items = item.items || [];
    return (
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle-outline" size={28} color="#6B7280" />
          </View>
          <Text style={styles.name}>{item.ownerName}</Text>
        </View>

        <View style={styles.center}>
          {items.length === 0 ? (
            <Text style={styles.noEmotion}>まだ感情が選択されていません</Text>
          ) : (
            <View style={styles.emotionRow}>
              {items.map((it, idx) => {
                const tint = emotionTint(it.type);
                const labelStrength = STRENGTH_LABEL[it.strength] || "";
                return (
                  <View
                    key={`${it.type}-${it.strength}-${idx}`}
                    style={[styles.badge, { backgroundColor: tint.bg }]}
                  >
                    <Text style={[styles.badgeText, { color: tint.text }]}>
                      {it.type}
                      {labelStrength ? `（${labelStrength}）` : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <Text style={styles.time}>{item.timeLabel}</Text>
      </View>
    );
  };

  const isDark = themeName === "dark";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      {/* 画面全体は固定（背景＆タイトル固定） */}
      <View style={styles.screenContainer}>
        {/* Emlis ヘッダー */}
        <View style={styles.appTitleWrapper}>
          <Text style={styles.appTitleText}>Emlis</Text>
          <Text style={styles.appSubtitleText}>
            ～Emotion Limbic Internal Structure～
          </Text>
        </View>

        {/* ゴールド枠パネル */}
        <View style={styles.panel}>
          {/* パネルヘッダー：Frend */}
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Frend</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.friendPill}
              activeOpacity={0.85}
            >
              <Ionicons
                name="people-circle-outline"
                size={22}
                color={colors.TEXT_ON_LIGHT}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.panelScroll}
            contentContainerStyle={styles.panelScrollContent}
            showsVerticalScrollIndicator={false}
          >

            <Text style={styles.lead}>つながっている人たちの最新の心の動き</Text>

          {/* フィードカード */}
          <View style={styles.card}>
            {errorMsg ? (
              <View style={styles.centerBox}>
                <Text style={styles.errorText}>取得エラー: {errorMsg}</Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={loadFeed}
                  activeOpacity={0.85}
                >
                  <Text style={styles.retryText}>再読み込み</Text>
                </TouchableOpacity>
              </View>
            ) : loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="small" />
              </View>
            ) : feed.length === 0 ? (
              <View style={styles.centerBox}>
                <Text style={styles.emptyText}>
                  まだフレンドの感情ログがありません
                </Text>
              </View>
            ) : (
              <FlatList
                data={feed}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderFeedItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                scrollEnabled={false} // パネル全体は ScrollView がスクロール担当
              />
            )}
          </View>

          </ScrollView>
        </View>
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          setTab("add");
          setModalVisible(true);
        }}
      >
        <Ionicons name="person-add-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* フレンド管理モーダル */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>フレンド</Text>
              <TouchableOpacity
                onPress={loadManageAll}
                activeOpacity={0.85}
                style={styles.iconBtn}
              >
                <Ionicons name="refresh" size={18} color={styles.modalTitle.color} />
              </TouchableOpacity>
            </View>

            {/* 自分のフレンドコード */}
            <View style={styles.myCodeBox}>
              <Text style={styles.myCodeLabel}>あなたのフレンドコード</Text>
              <Text style={styles.myCodeValue}>
                {myProfile?.friendCode ? myProfile.friendCode : "（未設定）"}
              </Text>
            </View>

            {/* タブ */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                onPress={() => setTab("friends")}
                style={[styles.tabBtn, tab === "friends" && styles.tabBtnActive]}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === "friends" && styles.tabTextActive,
                  ]}
                >
                  一覧
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTab("requests")}
                style={[styles.tabBtn, tab === "requests" && styles.tabBtnActive]}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === "requests" && styles.tabTextActive,
                  ]}
                >
                  申請
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTab("add")}
                style={[styles.tabBtn, tab === "add" && styles.tabBtnActive]}
                activeOpacity={0.85}
              >
                <Text
                  style={[styles.tabText, tab === "add" && styles.tabTextActive]}
                >
                  追加
                </Text>
              </TouchableOpacity>
            </View>

            {manageError ? (
              <Text style={styles.manageErrorText}>{manageError}</Text>
            ) : null}

            {manageLoading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="small" />
              </View>
            ) : (
              <ScrollView
                style={{ maxHeight: 420 }}
                showsVerticalScrollIndicator={false}
              >
                {/* タブ: フレンド一覧 */}
                {tab === "friends" ? (
                  <View style={{ marginTop: 8 }}>
                    {friendsList.length === 0 ? (
                      <Text style={styles.emptyText}>まだフレンドがいません</Text>
                    ) : (
                      friendsList.map((f) => (
                        <View key={f.userId} style={styles.modalRow}>
                          <Ionicons
                            name="person-outline"
                            size={18}
                            color={styles.friendName.color}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.friendName}>{f.displayName}</Text>
                        </View>
                      ))
                    )}
                  </View>
                ) : null}

                {/* タブ: 申請 */}
                {tab === "requests" ? (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.sectionTitle}>届いた申請</Text>
                    {incoming.length === 0 ? (
                      <Text style={styles.emptyText}>届いている申請はありません</Text>
                    ) : (
                      incoming.map((r) => (
                        <View key={r.id} style={styles.requestRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.requestName}>{r.requesterName}</Text>
                            <Text style={styles.requestTime}>{r.timeLabel}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.smallBtn}
                            onPress={() => acceptRequest(r.id)}
                            disabled={actingRequestId === r.id}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.smallBtnText}>承諾</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.smallBtnOutline]}
                            onPress={() => rejectRequest(r.id)}
                            disabled={actingRequestId === r.id}
                            activeOpacity={0.85}
                          >
                            <Text style={[styles.smallBtnText, styles.smallBtnTextOutline]}
                            >
                              拒否
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    )}

                    <View style={{ height: 12 }} />

                    <Text style={styles.sectionTitle}>送った申請</Text>
                    {outgoing.length === 0 ? (
                      <Text style={styles.emptyText}>送った申請はありません</Text>
                    ) : (
                      outgoing.map((r) => (
                        <View key={r.id} style={styles.requestRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.requestName}>{r.requestedName}</Text>
                            <Text style={styles.requestTime}>{r.timeLabel}</Text>
                          </View>
                          <Text style={styles.pendingPill}>pending</Text>
                        </View>
                      ))
                    )}
                  </View>
                ) : null}

                {/* タブ: 追加 */}
                {tab === "add" ? (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.sectionTitle}>フレンドを追加</Text>
                    <Text style={styles.helpText}>
                      相手のフレンドコードを入力して申請を送ります
                    </Text>

                    <TextInput
                      value={friendCodeInput}
                      onChangeText={setFriendCodeInput}
                      placeholder="例: A1B2C3D4E5"
                      placeholderTextColor={colors.TEXT_SUBTLE}
                      autoCapitalize="characters"
                      style={styles.input}
                    />

                    <TouchableOpacity
                      style={[styles.primaryBtn, sending && { opacity: 0.6 }]}
                      onPress={sendRequest}
                      disabled={sending}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.primaryBtnText}>
                        {sending ? "送信中..." : "申請を送る"}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.helpText2}>
                      ※通信先: {MASHOS_BASE_URL}
                    </Text>
                  </View>
                ) : null}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(COLORS) {
  const TEXT_MAIN = COLORS.TEXT_ON_LIGHT;
  const TEXT_SUB = "#6B7280";

  const ACCENT = COLORS.GOLD_BUTTON;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
    screenContainer: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 16,
      alignItems: "center",
    },

    // Emlis ロゴ
    appTitleWrapper: {
      alignItems: "center",
      marginBottom: 14,
    },
    appTitleText: {
      fontFamily: "CormorantGaramond-Bold",
      fontSize: 24,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 1.2,
    },
    appSubtitleText: {
      fontFamily: "CormorantGaramond-Regular",
      marginTop: 4,
      fontSize: 11,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 0.8,
    },

    // メインパネル
    panel: {
      width: "94%",
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0.24,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
      flex: 1,
      minHeight: 0,
    },
    panelHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },

    panelScroll: {
      flex: 1,
    },
    panelScrollContent: {
      paddingBottom: 18,
    },

    friendPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    lead: {
      color: COLORS.TEXT_SUBTLE,
      fontSize: 12,
      marginBottom: 10,
    },

    // フィードカード
    card: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingVertical: 4,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: "#F3F4F6",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    name: {
      fontWeight: "700",
      color: TEXT_MAIN,
      fontSize: 15,
    },

    center: {
      flex: 1,
      alignItems: "center",
    },
    noEmotion: {
      fontSize: 12,
      color: TEXT_SUB,
    },

    emotionRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      marginHorizontal: 2,
      marginVertical: 2,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
    },

    time: {
      color: TEXT_SUB,
      fontSize: 12,
      width: 80,
      textAlign: "right",
    },

    separator: {
      height: 1,
      backgroundColor: "#EEE",
      marginLeft: 12,
      marginRight: 12,
    },

    centerBox: {
      paddingVertical: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      color: "#B91C1C",
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      color: TEXT_SUB,
      textAlign: "center",
      fontSize: 13,
    },

    retryBtn: {
      marginTop: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    retryText: {
      color: TEXT_MAIN,
      fontSize: 12,
    },

    fab: {
      position: "absolute",
      right: 18,
      bottom: 26,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: ACCENT,
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
    },

    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContent: {
      backgroundColor: COLORS.FIELD_BG,
      padding: 18,
      borderRadius: 16,
      width: "86%",
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },

    modalHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    iconBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 10,
      color: TEXT_MAIN,
    },

    myCodeBox: {
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: COLORS.FIELD_BG,
      marginBottom: 10,
    },
    myCodeLabel: {
      fontSize: 12,
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 4,
    },
    myCodeValue: {
      fontSize: 16,
      fontWeight: "800",
      color: TEXT_MAIN,
      letterSpacing: 0.8,
    },

    tabRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      gap: 8,
    },
    tabBtn: {
      flex: 1,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingVertical: 8,
      borderRadius: 999,
      alignItems: "center",
    },
    tabBtnActive: {
      backgroundColor: ACCENT,
      borderColor: ACCENT,
    },
    tabText: {
      fontWeight: "800",
      color: TEXT_MAIN,
      fontSize: 12,
    },
    tabTextActive: {
      color: "#fff",
    },

    sectionTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: TEXT_MAIN,
      marginBottom: 6,
    },

    helpText: {
      fontSize: 12,
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 10,
    },

    helpText2: {
      fontSize: 11,
      color: COLORS.TEXT_SUBTLE,
      marginTop: 10,
      textAlign: "center",
    },

    input: {
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      color: TEXT_MAIN,
      fontSize: 14,
    },

    primaryBtn: {
      marginTop: 10,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: ACCENT,
      borderRadius: 999,
    },
    primaryBtnText: {
      color: "#fff",
      fontWeight: "800",
    },

    manageErrorText: {
      color: "#B91C1C",
      fontSize: 12,
      marginBottom: 6,
      textAlign: "center",
    },

    modalRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 6,
    },
    friendName: {
      fontSize: 16,
      color: TEXT_SUB,
    },

    requestRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#EEE",
      gap: 8,
    },
    requestName: {
      fontSize: 14,
      fontWeight: "800",
      color: TEXT_MAIN,
    },
    requestTime: {
      marginTop: 2,
      fontSize: 11,
      color: COLORS.TEXT_SUBTLE,
    },

    smallBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: ACCENT,
    },
    smallBtnText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 12,
    },

    smallBtnOutline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: ACCENT,
    },
    smallBtnTextOutline: {
      color: ACCENT,
    },

    pendingPill: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      color: TEXT_SUB,
      fontSize: 12,
      overflow: "hidden",
    },

    closeButton: {
      marginTop: 16,
      paddingVertical: 10,
      alignItems: "center",
      backgroundColor: ACCENT,
      borderRadius: 999,
    },
    closeButtonText: {
      color: "#fff",
      fontWeight: "700",
    },
  });
}
