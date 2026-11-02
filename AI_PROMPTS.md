# AI Prompts

The prompts used during development, recorded verbatim and in order.

## Prompt 1: Project brief and Stage 1

````text
I'm building a front-end coding assessment for a Senior Software Engineer role at Leap Tools.

We are starting completely from scratch in this empty VS Code workspace. You are my AI coding assistant, and I want us to build this project incrementally, with me reviewing your work at each step.

## Project overview

We are building an interactive room visualizer called "My Spaces."

The application allows users to view an interior room full-screen, enter a gallery mode to browse saved rooms, select another room, and smoothly return to the full-screen visualizer.

The main focus of the assessment is polished UI transitions and micro-interactions, not backend development.

## Design references

The `references/` directory contains six screenshots:

- `00-assignment.png` — Assignment instructions
- `01-visualizer.png` — Initial full-screen room visualizer
- `02-enter-spaces.png` — My Spaces gallery layout
- `03-swipe-spaces.png` — Horizontal swipe transition
- `04-select-space.png` — Selected bedroom in the carousel
- `05-exit-spaces.png` — Selected bedroom expanded back into the visualizer

Please inspect the screenshots before implementing anything.

These screenshots are the visual source of truth. Do not require a Figma connection or Dev Mode.

If you cannot inspect the images, tell me explicitly.

## Complete application flow

### State 1 — Visualizer mode

- Display a room image filling the entire main canvas.
- The initial room is a bright living room.
- Place a compact floating toolbar at the top center.
- Toolbar buttons: Exit, My Spaces, Share.
- Match the reference layout, spacing, colors, and image presentation.

### State 2 — Enter My Spaces

When the user clicks My Spaces:

- The current room smoothly shrinks into a centered gallery card.
- The canvas background transitions to dark gray.
- The active room gets rounded corners.
- Neighboring room previews become partially visible.
- The toolbar changes to a Done button.
- Room name, floor and wall details, and actions appear beneath the active image.

The transition should feel like the same image moving between layouts, not a page replacement.

### State 3 — Swipe between spaces

- Users can drag or swipe horizontally between rooms.
- The cards move together as a carousel.
- The active room stays centered when navigation finishes.
- Motion blur can appear during the swipe, but images should be sharp when the animation settles.
- Neighboring rooms remain partially visible.
- Support clicking neighboring rooms as well.

### State 4 — Select a room

- Selecting another room centers it in the carousel.
- Show the selected room name and material details.
- Show Share, Favorite, and Duplicate controls.
- An Add Space placeholder may appear.
- Do not spend time implementing the Add Space or Duplicate flows yet.

### State 5 — Return to visualizer

When the user clicks Done:

- The selected room smoothly expands to fill the main canvas.
- The gallery background and neighboring cards disappear.
- The original toolbar returns.
- The selected room must be preserved.

For example, if the user selected the blue bedroom, the full-screen visualizer must display the blue bedroom, not the original living room.

## Technical requirements

Use:

- React
- TypeScript
- Vite
- Modern CSS
- Motion for React for animations
- Phosphor Icons

Use npm.

No backend, database, authentication, or external APIs are required.

Use local room data.

Use suitable room photographs as image assets. The reference screenshots should guide the appearance, but do not use entire screenshots as interactive UI backgrounds because they contain baked-in controls.

Keep the components simple and readable.

Prefer fewer dependencies and fewer moving parts.

## Engineering expectations

- Responsive desktop and mobile layouts
- Accessible buttons and keyboard navigation
- Smooth motion without flickering
- No unnecessary component remounting
- Clean TypeScript types
- Small, understandable React components
- Respect prefers-reduced-motion
- No unnecessary architecture or over-engineering

This is a timeboxed two-hour assignment.

## Our implementation process

We will build this in stages:

1. Initialize the React project and build the initial visualizer.
2. Implement the My Spaces gallery layout.
3. Add smooth enter and exit transitions.
4. Add carousel navigation and swipe gestures.
5. Polish micro-interactions and responsiveness.
6. Test, review, and prepare the final submission.

Do not implement all stages at once.

## YOUR TASK RIGHT NOW — STAGE 1 ONLY

1. Initialize a clean React + TypeScript + Vite project in the current folder without deleting the `references/` directory.
2. Install the required dependencies.
3. Create a simple, organized component structure.
4. Add local room data for the bright living room and blue bedroom.
5. Implement ONLY the initial full-screen visualizer from `01-visualizer.png`.
6. Recreate the top floating toolbar with Exit, My Spaces, and Share buttons.
7. Use Phosphor Icons for the toolbar.
8. Make the initial visualizer responsive.
9. Run the development server or build to verify the project compiles.

For now, the toolbar buttons only need their visual states. We'll add navigation behavior in the next stage.

Prioritize matching the initial reference screenshot closely.

Do not build the carousel yet.

Do not add complex animations yet.

Do not implement Add Space or Duplicate.

After completing Stage 1:

- Tell me which files you created.
- Explain the main component structure.
- Tell me how to run the app locally.
- Identify anything that still differs from the reference.
- Wait for my review before proceeding to Stage 2.

Also create an `AI_PROMPTS.md` file to record the actual prompts used during development, starting with this one. Do not fabricate later prompts or decisions.

Let's start with Stage 1.
````

## Prompt 2: Stage 2 My Spaces interaction

````text
The initial visualizer UI is implemented, but I noticed that the toolbar buttons don't work yet.

Let's move to Stage 2: implement the My Spaces interaction.

First, please understand these details:

**Initial state — Visualizer mode**
- The application should initially display the full-screen living room.
- The top toolbar contains Exit, My Spaces, and Share.
- The My Spaces button has a lighter background than the other buttons, matching the Figma design.
- This lighter background indicates the primary action, not that the gallery mode is currently active.
- Exit and Share can remain outside the scope of this stage, but they must not pretend to perform an action.

**When clicking My Spaces**
- Switch from visualizer mode into My Spaces mode.
- Display the gray gallery background.
- Shrink the current room into a centered card with rounded corners.
- Show a partial preview of the neighboring room.
- Replace the top toolbar with a Done button.
- Display the selected room's name, floor and wall descriptions.
- Display Share, Favorite, and Duplicate controls beneath the room.
- For now, focus on correct layout and functionality rather than complex animations.

**When clicking Done**
- Return to the full-screen visualizer.
- Preserve the currently selected room.
- Restore the Exit, My Spaces, and Share toolbar.

**State management**
- Use a simple mode state: "visualizer" or "spaces".
- Track the selected room separately from the mode.
- Do not introduce unnecessary state management libraries.
- Avoid rewriting components that already work.

**Important**
- Do not implement swipe gestures yet.
- Do not implement Add Space or Duplicate flows yet.
- Do not implement complex transitions yet.
- Keep the styling close to the reference screenshots.
- Ensure the toolbar buttons remain clickable and aren't covered by overlapping elements.

After implementing, run npm run build, fix any errors, summarize the changed files, and wait for my review before adding animations.

Please append this actual prompt to AI_PROMPTS.md.
````

## Prompt 3: Carousel gestures, Done states and Add Space

````text
Please improve the existing My Spaces carousel in our Leap Tools React application.

Keep the current design and working functionality. Do not rebuild the project from scratch.

I want the carousel to feel like a smooth, polished room gallery, closely matching the Figma references.

## 1. Carousel layout and appearance

- All room cards must have exactly the same width, height, aspect ratio, and border radius.
- The previous, current, and next rooms must remain the same size.
- Do not scale neighboring cards down or enlarge the selected card.
- The currently selected room should be centered and displayed sharply at full image quality.
- Neighboring rooms should appear lighter, with a subtle faded or washed-out effect to visually separate them from the active room.
- Keep adjacent room previews partially visible at the left and right edges.
- Use a consistent gap between slides.
- Do not distort or resize images during horizontal navigation.

## 2. Horizontal swipe and drag behavior

Implement smooth horizontal carousel navigation with Motion for React.

Support:
- Touch swiping on mobile
- Mouse dragging on desktop
- Clicking a neighboring room to select it
- Left and right arrow keyboard navigation

While dragging:
- The entire carousel track should follow the pointer or finger horizontally.
- All visible room images should temporarily become blurred.
- The Done button should become disabled and visually dimmed.
- The active slide should not change size.
- The room details should not jump or disappear unexpectedly.

When dragging ends:
- Use drag distance and velocity to determine whether to move to the previous room, next room, or return to the current room.
- Animate the carousel into the final centered position with a smooth spring transition.
- Restore sharpness to the centered room once the movement finishes.
- Restore the Done button to its enabled state after the transition finishes.
- Avoid accidental clicks after a drag.
- Prevent navigation beyond the first or last room.

Important: Vertical page scrolling should not accidentally trigger horizontal navigation. If the user scrolls vertically, don't change the selected room. Apply the temporary blur and disabled state only during an actual horizontal carousel gesture or slide transition, not ordinary vertical scrolling.

Use a clear interaction state such as idle, dragging, or settling rather than loosely connected booleans.

## 3. Done button behavior

- Done is enabled when the carousel is idle.
- Done is disabled while dragging or sliding between rooms.
- Done must not respond to clicks while disabled.
- Use the native disabled attribute and a visible disabled style.
- Re-enable Done only after the active room settles into position.
- Clicking Done should smoothly expand the currently selected room back into the full-screen visualizer.

## 4. Add New Space at the end

At the end of the carousel, display an Add Space card with a centered "+" icon.

Requirements:
- The Add Space card should have the same dimensions and rounded corners as the room cards.
- Use a subtle dark-gray background and a centered Phosphor Plus icon.
- Keep it visually distinct from uploaded rooms.
- Clicking it should open the native image file picker.
- Accept common image formats such as JPG, PNG, and WebP.
- After selecting a valid image, create a new room entry using a local object URL.
- Show the uploaded image as a new room card.
- Automatically select and center the new room with a smooth transition.
- Let the user browse between existing and newly uploaded rooms.
- Clean up object URLs when they are no longer needed.
- Handle file picker cancellation and invalid files without breaking the interface.

No backend or database is needed. Uploaded images only need to exist in the current browser session.

## 5. Animation quality

Use Motion for React.

- Keep animations smooth with minimal bounce.
- Maintain stable room IDs.
- Avoid unnecessary image remounts.
- Animate the horizontal track rather than changing slide dimensions.
- Keep active-room metadata synchronized with the centered room.
- Respect prefers-reduced-motion.
- Prevent gesture handlers or overlays from blocking room action buttons.

## 6. Technical implementation

Please inspect the current components and state management before editing.

Reuse the existing components wherever practical.

Keep the code simple and readable.

Avoid adding another carousel library unless there's a compelling reason.

Do not change unrelated features or rewrite working code.

## 7. Verification

After implementing, run npm run build and fix any errors.

Manually or programmatically verify as much as possible:

1. All room cards remain the same size.
2. The active room is centered and sharp.
3. Neighboring rooms have a brighter, faded appearance.
4. Mouse drag moves the carousel horizontally.
5. Touch swipe works on mobile.
6. Images blur during horizontal movement.
7. Done becomes disabled during movement.
8. Done becomes enabled again after settling.
9. Vertical scrolling does not accidentally navigate or disable Done.
10. Navigation stops correctly at both ends.
11. The Add Space card appears after the final room.
12. Clicking + opens the image picker.
13. Uploading an image creates and selects a new room.
14. Clicking Done expands the newly selected room correctly.

Explain any remaining limitations.

Summarize which files you modified, what you implemented, and what I should manually check in the browser.

Append this actual prompt to AI_PROMPTS.md.

Do not implement unrelated features.
````

## Prompt 4: Share, Favourite and Duplicate

````text
Please implement the SHARE, FAVOURITE, and DUPLICATE button functionality in our existing Leap Tools My Spaces React application.

The My Spaces carousel, room selection, swipe interactions, and visualizer transitions are already implemented.

Do not rebuild the project or change the existing design.

First, inspect the current code, room data model, and state management. Reuse the existing components and utilities wherever possible.

## 1. SHARE — Public room URL

The SHARE button should let users share the currently selected room through a URL.

Expected behavior:

- Clicking SHARE generates a URL that points to the currently selected room.
- Prefer a URL format such as `https://our-app-url/?room=room-id`.
- Use the browser's native Web Share API when available.
- Otherwise, copy the shareable URL to the clipboard.
- Display a small success message such as "Link copied!".
- Provide helpful feedback if sharing or copying fails.
- When someone opens a valid room URL, the application should automatically display that room in visualizer mode.
- Handle invalid or missing room IDs by showing the default room.
- Sharing must not interrupt carousel navigation or change the selected room.

Important architectural consideration:

We currently use a front-end-only application with local room data.

For predefined rooms, URL-based sharing should work once the application is publicly deployed.

However, a room uploaded by one user cannot be shared publicly using only a local object URL or localStorage.

Do not pretend that a locally uploaded image has a working public URL.

For uploaded rooms, either:
- Clearly explain that public sharing requires persistent image storage and a backend or suitable hosted storage service, or
- Implement a genuinely working share mechanism if it can be done safely within our project scope.

Do not add a backend just for this assessment without discussing the trade-off first.

## 2. FAVOURITE — Toggle heart

Implement working favourite functionality.

Expected behavior:

- Clicking the heart marks the selected room as a favourite.
- Clicking it again removes the favourite.
- Use a filled heart icon for favourite rooms.
- Use an outlined heart icon for non-favourite rooms.
- Add a small, smooth icon animation when toggling.
- Preserve each room's favourite status when switching between rooms.
- Persist favourites in localStorage so refreshing the page doesn't reset them.
- Use stable room IDs rather than array indexes.
- Use Phosphor Icons.
- Add accessible button labels and aria-pressed.
- Prevent the favourite button click from triggering carousel navigation.

## 3. DUPLICATE — Copy current room

Implement actual room duplication.

Expected behavior:

- Clicking DUPLICATE creates a new room based on the currently selected room.
- The duplicate should use the same image and room metadata.
- Generate a unique ID for the duplicate.
- Name it something like "Cozy Bedroom (Copy)".
- Insert the duplicate immediately after the original room in the carousel.
- Automatically select the duplicated room.
- Smoothly slide the carousel to the new room.
- Preserve all existing rooms.
- Allow users to duplicate a room more than once without ID collisions.
- Keep the original and duplicate as independent room entries.
- Avoid duplicating image files unnecessarily.
- If the original is an uploaded image, ensure duplicating it does not break its image URL or cleanup lifecycle.
- Do not allow duplicate actions to interfere with active drag animations.

Use React state updates without mutating existing arrays.

## 4. Button micro-interactions

For all three buttons:

- Add hover, pressed, and keyboard focus states.
- Use the existing visual style.
- Use Phosphor Icons.
- Provide feedback after successful actions.
- Prevent event bubbling into carousel selection or drag interactions.
- Respect reduced-motion preferences.
- Keep buttons usable on mobile.

## 5. Code quality

Keep the implementation simple.

Do not introduce Redux, a database, or extra state libraries.

Avoid unnecessary refactoring.

Reuse current room IDs and component structure.

Handle edge cases such as invalid shared links, clipboard failures, repeated duplication, and missing uploaded images.

## 6. Testing

Run npm run build and fix TypeScript or build errors.

Then verify:

1. SHARE creates the correct selected-room URL.
2. Opening the URL in a new browser tab displays the correct predefined room.
3. FAVOURITE toggles the heart correctly.
4. Favourite status survives a refresh.
5. DUPLICATE creates a new independent room entry.
6. The duplicated room appears immediately after the original.
7. The carousel smoothly centers the duplicate.
8. Multiple duplicates have unique IDs.
9. Existing swipe and visualizer transitions still work.
10. Uploaded images do not break when duplicated.
11. All buttons work correctly on desktop and mobile.

Please summarize which files changed and explain any limitations.

Append this prompt to AI_PROMPTS.md.

Do not implement unrelated features.
````
