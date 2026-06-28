export type GroupChat = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
};

const GROUP_CHATS_STORAGE_KEY = "brinks-group-chats";
const GROUP_CHATS_EVENT = "brinks-group-chats-change";

const defaultGroups: GroupChat[] = [
  {
    id: "design-systems-team",
    name: "Design Systems Team",
    description: "Components, tokens, and product UI decisions.",
    memberCount: 8,
    createdAt: new Date("2026-06-20T10:00:00.000Z").toISOString(),
  },
  {
    id: "frontend-squad",
    name: "Frontend Squad",
    description: "Daily frontend build notes and review handoffs.",
    memberCount: 5,
    createdAt: new Date("2026-06-21T10:00:00.000Z").toISOString(),
  },
];

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

export const getGroupChats = () => {
  if (!canUseStorage()) return defaultGroups;

  const storedGroups = window.localStorage.getItem(GROUP_CHATS_STORAGE_KEY);

  if (!storedGroups) {
    window.localStorage.setItem(GROUP_CHATS_STORAGE_KEY, JSON.stringify(defaultGroups));
    return defaultGroups;
  }

  try {
    const parsedGroups = JSON.parse(storedGroups) as GroupChat[];

    if (Array.isArray(parsedGroups)) {
      return parsedGroups;
    }
  } catch {
    window.localStorage.removeItem(GROUP_CHATS_STORAGE_KEY);
  }

  window.localStorage.setItem(GROUP_CHATS_STORAGE_KEY, JSON.stringify(defaultGroups));
  return defaultGroups;
};

export const saveGroupChat = (group: Omit<GroupChat, "id" | "createdAt" | "memberCount">) => {
  const groups = getGroupChats();
  const createdGroup: GroupChat = {
    ...group,
    id: `${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`,
    memberCount: 1,
    createdAt: new Date().toISOString(),
  };

  if (canUseStorage()) {
    window.localStorage.setItem(
      GROUP_CHATS_STORAGE_KEY,
      JSON.stringify([createdGroup, ...groups]),
    );
    window.dispatchEvent(new Event(GROUP_CHATS_EVENT));
  }

  return createdGroup;
};

export const subscribeToGroupChats = (callback: () => void) => {
  window.addEventListener(GROUP_CHATS_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(GROUP_CHATS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};
