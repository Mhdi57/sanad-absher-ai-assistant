# Implementation Plan - Chat Notifications Dropdown

The user wants the notification bell in the chat header to be interactive. When clicked, it should show a list of "about to expire" items, fines, and other alerts in a "nice design".

## Proposed Changes

### [MODIFY] [SanadChat.tsx](file:///Users/alialqhtani/Desktop/sanad---absher-ai-assistant/components/SanadChat.tsx)

**Goal:** Implement a notification dropdown/popover triggered by the bell icon.

-   **State:** Add `showNotifications` (boolean).
-   **Mock Data:** Create a list of alerts:
    -   **Urgent (Red)**: Unpaid Traffic Fines (Total amount).
    -   **Warning (Yellow)**: Passport expiring in 45 days.
    -   **Info (Blue)**: Driver's License renewal due soon.
-   **UI Design:**
    -   Absolute positioned dropdown below the bell.
    -   Glassmorphism or clean white card with shadow.
    -   Header: "التنبيهات" (Notifications).
    -   List Items: Each item has an icon, title, description (time left/amount), and a "Take Action" arrow.
    -   **Close Behavior:** Clicking outside or clicking the bell again closes it.
    -   **Action:** Clicking an item could trigger a chat message (e.g., clicking Fines -> sends "سدد المخالفات" to the chat).

## Verification
-   **Manual Test:** Click the bell -> Dropdown appears -> Click "Pay Fines" -> Chat generates response.
