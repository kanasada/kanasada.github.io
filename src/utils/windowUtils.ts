
import { create } from 'zustand';

export type WindowId = 'scoreboard' | 'baseballCard' | 'radio' | 'guestbook' | 'jumbotron' | 'stadiumMap';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isFocused: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowStore {
  windows: Record<WindowId, WindowState>;
  highestZIndex: number;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updateWindowPosition: (id: WindowId, position: { x: number; y: number }) => void;
  updateWindowSize: (id: WindowId, size: { width: number; height: number }) => void;
}

const initialWindows: Record<WindowId, WindowState> = {
  scoreboard: {
    id: 'scoreboard',
    title: 'Scoreboard.exe',
    isOpen: false,
    isFocused: false,
    zIndex: 0,
    position: { x: 100, y: 100 },
    size: { width: 500, height: 400 },
  },
  baseballCard: {
    id: 'baseballCard',
    title: 'BaseballCard.exe',
    isOpen: false,
    isFocused: false,
    zIndex: 0,
    position: { x: 650, y: 150 },
    size: { width: 400, height: 500 },
  },
  radio: {
    id: 'radio',
    title: 'Scully Radio.exe',
    isOpen: false,
    isFocused: false,
    zIndex: 0,
    position: { x: 1150, y: 300 },
    size: { width: 350, height: 220 },
  },
  guestbook: {
    id: 'guestbook',
    title: 'Stadium Guestbook.exe',
    isOpen: false,
    isFocused: false,
    zIndex: 0,
    position: { x: 550, y: 80 },
    size: { width: 450, height: 300 },
  },
  jumbotron: {
    id: 'jumbotron',
    title: 'Jumbotron.exe',
    isOpen: false,
    isFocused: false,
    zIndex: 0,
    position: { x: 900, y: 200 },
    size: { width: 500, height: 500 },
  },
  stadiumMap: {
    id: 'stadiumMap',
    title: 'StadiumMap.exe',
    isOpen: false,
    isFocused: false,
    zIndex: 0,
    position: { x: 50, y: 50 },
    size: { width: 622, height: 600 },
  },
};

export const useWindowStore = create<WindowStore>((set) => ({
  windows: initialWindows,
  highestZIndex: 0,
  openWindow: (id) => {
    set((state) => {
      const newZIndex = state.highestZIndex + 1;
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isOpen: true,
            isFocused: true,
            zIndex: newZIndex,
          },
        },
        highestZIndex: newZIndex,
      };
    });
  },
  closeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
          isFocused: false,
        },
      },
    }));
  },
  focusWindow: (id) => {
    set((state) => {
      if (state.windows[id].zIndex === state.highestZIndex) {
        return {
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isFocused: true,
            },
          },
        };
      }
      
      const newZIndex = state.highestZIndex + 1;
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isFocused: true,
            zIndex: newZIndex,
          },
        },
        highestZIndex: newZIndex,
      };
    });
  },
  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position,
        },
      },
    }));
  },
  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size,
        },
      },
    }));
  },
}));
