import * as FileSystem from "expo-file-system";

const FS = FileSystem as any;

// turvallinen local cache -kansio
const CACHE_DIR: string = FS.documentDirectory + "app-cache/";

async function ensureCacheDir() {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

async function getDirectorySize(uri: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) return 0;

  if (info.isDirectory) {
    const files = await FileSystem.readDirectoryAsync(uri);
    let total = 0;

    for (const file of files) {
      total += await getDirectorySize(uri + file);
    }
    return total;
  }

  return info.size ?? 0;
}

export async function getUsedCacheMB(): Promise<number> {
  await ensureCacheDir();
  const bytes = await getDirectorySize(CACHE_DIR);
  return +(bytes / 1024 / 1024).toFixed(2);
}

export async function clearCache(): Promise<void> {
  await ensureCacheDir();
  const files = await FileSystem.readDirectoryAsync(CACHE_DIR);

  await Promise.all(
    files.map((file) =>
      FileSystem.deleteAsync(CACHE_DIR + file, { idempotent: true })
    )
  );
}