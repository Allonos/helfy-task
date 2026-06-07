import { create } from "zustand";
import { persist } from "zustand/middleware";

// Client-side UI state only - no server state
interface CartUIState {
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
}

export const useCartStore = create<CartUIState>()(
  persist(
    (set) => ({
      isCartDrawerOpen: false,
      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),
      toggleCartDrawer: () =>
        set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
    }),
    {
      name: "cart-ui-storage",
    },
  ),
);
