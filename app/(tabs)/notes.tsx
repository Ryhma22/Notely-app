import { useState, useEffect, useCallback, useLayoutEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";

import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import { Colors, DANGER_COLOR } from "@/constants/Colors";
import TextApp from "@/components/TextApp";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "@/lib/supabase";

import MathBlock from "../../components/blocks/MathBlock";
import DiagramEditorBlock from "../../components/blocks/DiagramEditorBlock";
import BarChartEditorBlock from "../../components/blocks/BarChartEditorBlock";
import ImageBlock from "../../components/blocks/ImageBlock";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleNoteFavorite,
  getNoteBlocks,
  createNoteBlock,
  deleteNoteBlock,
  updateNoteBlock,
} from "@/services/notes";
import type { NoteSortOrder } from "@/services/notes";

import type { Note, NoteBlock, BlockType } from "@/lib/database.types";
import { Ionicons } from "@expo/vector-icons";

export default function NotesScreen() {
  const { isDark } = useSettings();
  const { t } = useI18n();
  const colors = isDark ? Colors.dark : Colors.light;
  const navigation = useNavigation();

  const [notes, setNotes] = useState<Note[]>([]);
  const [blocks, setBlocks] = useState<NoteBlock[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<NoteSortOrder>("newest");
  const [fromCache, setFromCache] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Suodatettu ja järjestetty lista (haku client-side, järjestys palvelimelta)
  const filteredNotes = notes
    .filter(
      (n) =>
        !searchQuery.trim() ||
        (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.content || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Lisää lohko -valikko (Alert)
  const openAddBlockMenu = () => {
    if (!activeNote) return;
    Alert.alert(t("addBlock"), "", [
      { text: t("math"), onPress: () => handleAddBlock("math") },
      { text: t("diagram"), onPress: () => handleAddBlock("diagram") },
      { text: t("barChart"), onPress: () => handleAddBlock("bar") },
      { text: t("addImage"), onPress: handleAddImageBlock },
      { text: t("cancel"), style: "cancel" },
    ]);
  };

  // Header-valikko: lisää lohko, suosikki tai poista muistiinpano
  const openNoteMenu = () => {
    if (!activeNote) return;
    Alert.alert(t("note"), "", [
      { text: t("addBlock"), onPress: openAddBlockMenu },
      {
        text: activeNote.is_favorite
          ? t("removeFromFavorites")
          : t("addToFavorites"),
        onPress: () => handleToggleFavorite(activeNote.id),
      },
      {
        text: t("deleteNote"),
        style: "destructive",
        onPress: () => handleRemoveNote(activeNote.id),
      },
      { text: t("cancel"), style: "cancel" },
    ]);
  };

  // Header-painikkeet muistiinpano-näkymässä
  useLayoutEffect(() => {
    if (activeNote) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => setActiveNoteId(null)}
            style={{ marginLeft: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.tint} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={openNoteMenu} style={{ marginRight: 12 }}>
            <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({ headerLeft: undefined, headerRight: undefined });
    }
  }, [navigation, activeNoteId, colors]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  useEffect(() => {
    loadNotes();
  }, [sortOrder]);

  useEffect(() => {
    if (activeNoteId) loadBlocks(activeNoteId);
    else setBlocks([]);
  }, [activeNoteId]);

  const loadNotes = async () => {
    setLoading(true);
    const { data, error, fromCache: cached } = await getNotes(sortOrder);
    setFromCache(cached ?? false);
    if (error) {
      Alert.alert(t("error"), t("notesLoadFailed"));
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  const loadBlocks = async (noteId: string) => {
    const { data } = await getNoteBlocks(noteId);
    setBlocks(data || []);
  };

  const handleAddNote = async () => {
    setSaving(true);
    const { data } = await createNote({
      title: `${t("note")} ${notes.length + 1}`,
    });
    if (data) setNotes([data, ...notes]);
    setSaving(false);
  };

  const handleRemoveNote = async (id: string) => {
    Alert.alert(t("deleteNote"), t("areYouSure"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          await deleteNote(id);
          setNotes(notes.filter((n) => n.id !== id));
          if (activeNoteId === id) setActiveNoteId(null);
        },
      },
    ]);
  };

  const handleUpdateNote = async (
    id: string,
    updates: { title?: string; content?: string }
  ) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    await updateNote(id, updates);
  };

  const handleToggleFavorite = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const next = !note.is_favorite;
    setNotes(notes.map((n) => (n.id === id ? { ...n, is_favorite: next } : n)));
    await toggleNoteFavorite(id, next);
  };

  const handleDeleteBlock = async (blockId: string) => {
    await deleteNoteBlock(blockId);
    setBlocks(blocks.filter((b) => b.id !== blockId));
  };

  const handleAddBlock = async (type: BlockType) => {
    if (!activeNote) return;
    const { data } = await createNoteBlock({
      note_id: activeNote.id,
      type,
      position: blocks.length,
      data: {},
    });
    if (data) setBlocks([...blocks, data]);
  };

  const base64ToUint8Array = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const handleAddImageBlock = async () => {
    if (!activeNote) return;
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("error"), t("galleryPermission"));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const path = `${user.id}/${Date.now()}.jpg`;
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });
    const fileData = base64ToUint8Array(base64);

    const { error: uploadError } = await supabase.storage
      .from("note-images")
      .upload(path, fileData, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) return;

    const { data } = await createNoteBlock({
      note_id: activeNote.id,
      type: "image",
      position: blocks.length,
      data: { path },
    });
    if (data) setBlocks([...blocks, data]);
  };

  // Loading-tila
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.tint} />
        <TextApp style={{ marginTop: 12 }}>{t("loadingNotes")}</TextApp>
      </View>
    );
  }

  // Muistiinpanojen lista -näkymä
  if (!activeNote) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {fromCache && (
          <View
            style={{
              backgroundColor: colors.icon + "25",
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="cloud-offline-outline" size={18} color={colors.text} />
            <TextApp style={{ flex: 1, fontSize: 14, color: colors.text }}>
              {t("offlineCachedNotes")}
            </TextApp>
          </View>
        )}
        {/* Haku */}
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("searchNotes")}
          placeholderTextColor={colors.icon}
          style={{
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.icon + "50",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.text,
            marginBottom: 12,
          }}
        />

        {/* Järjestys */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => setSortOrder("newest")}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                sortOrder === "newest" ? colors.tint : colors.icon + "25",
              alignItems: "center",
            }}
          >
            <TextApp
              style={{
                color: sortOrder === "newest" ? colors.background : colors.text,
                fontWeight: "500",
              }}
            >
              {t("sortNewest")}
            </TextApp>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortOrder("oldest")}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                sortOrder === "oldest" ? colors.tint : colors.icon + "25",
              alignItems: "center",
            }}
          >
            <TextApp
              style={{
                color: sortOrder === "oldest" ? colors.background : colors.text,
                fontWeight: "500",
              }}
            >
              {t("sortOldest")}
            </TextApp>
          </TouchableOpacity>
        </View>

        {/* Tyhjä tila */}
        {notes.length === 0 && (
          <View
            style={{
              alignItems: "center",
              paddingVertical: 48,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.icon + "20",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={40}
                color={colors.icon}
              />
            </View>
            <TextApp
              style={{
                fontSize: 16,
                color: colors.icon,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {t("emptyNotes")}
            </TextApp>
          </View>
        )}

        {/* Ei tuloksia haulle */}
        {notes.length > 0 && filteredNotes.length === 0 && (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <TextApp style={{ color: colors.icon }}>{t("noSearchResults")}</TextApp>
          </View>
        )}

        {/* Muistiinpano-kortit */}
        {filteredNotes.map((note) => (
          <TouchableOpacity
            key={note.id}
            onPress={() => setActiveNoteId(note.id)}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.background,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.icon + "40",
              ...(Platform.OS === "android"
                ? { elevation: 2 }
                : {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                  }),
            }}
          >
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleToggleFavorite(note.id);
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ padding: 4, marginRight: 8 }}
            >
              <Ionicons
                name={note.is_favorite ? "star" : "star-outline"}
                size={22}
                color={note.is_favorite ? "#f1c40f" : colors.icon}
              />
            </TouchableOpacity>
            <TextApp
              style={{ flex: 1, fontSize: 16, fontWeight: "500" }}
              numberOfLines={1}
            >
              {note.title || t("note")}
            </TextApp>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleRemoveNote(note.id);
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ padding: 4 }}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={DANGER_COLOR}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Lisää muistiinpano -painike */}
        <TouchableOpacity
          onPress={handleAddNote}
          disabled={saving}
          activeOpacity={0.8}
          style={{
            marginTop: 8,
            paddingVertical: 16,
            backgroundColor: colors.tint,
            alignItems: "center",
            borderRadius: 12,
          }}
        >
          {saving ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons
                name="add"
                size={22}
                color={colors.background}
              />
              <TextApp style={{ color: colors.background, fontWeight: "600" }}>
                {t("addNote")}
              </TextApp>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Muistiinpano-editori -näkymä
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Otsikko */}
        <TextInput
          value={activeNote.title}
          onChangeText={(text) => handleUpdateNote(activeNote.id, { title: text })}
          placeholder={t("note")}
          placeholderTextColor={colors.icon}
          style={{
            fontSize: 24,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 12,
            paddingVertical: 4,
          }}
        />

        {/* Sisältökenttä */}
        <TextInput
          value={activeNote.content}
          onChangeText={(text) =>
            handleUpdateNote(activeNote.id, { content: text })
          }
          placeholder={t("writeNote")}
          placeholderTextColor={colors.icon}
          multiline
          style={{
            borderWidth: 1,
            borderColor: colors.icon + "50",
            borderRadius: 12,
            padding: 16,
            minHeight: 120,
            marginBottom: 20,
            fontSize: 16,
            color: colors.text,
          }}
        />

        {/* Lohkot */}
        {blocks.map((block) => {
          const onDelete = () => handleDeleteBlock(block.id);
          if (block.type === "diagram")
            return (
              <DiagramEditorBlock
                key={block.id}
                block={block}
                onUpdate={(data) => updateNoteBlock(block.id, { data })}
                onDelete={onDelete}
              />
            );
          if (block.type === "bar")
            return (
              <BarChartEditorBlock
                key={block.id}
                block={block}
                onUpdate={(data) => updateNoteBlock(block.id, { data })}
                onDelete={onDelete}
              />
            );
          if (block.type === "image")
            return (
              <ImageBlock
                key={block.id}
                block={block}
                onDelete={() => handleDeleteBlock(block.id)}
              />
            );
          if (block.type === "math")
            return (
              <MathBlock
                key={block.id}
                block={block}
                onUpdate={(data) => updateNoteBlock(block.id, { data })}
                onDelete={onDelete}
              />
            );
          return null;
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
