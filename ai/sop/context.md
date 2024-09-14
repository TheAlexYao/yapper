# Frontend

## 1. Introduction

The Language Exchange app is an interactive tool designed to help users practice and improve their language skills through simulated conversations. It focuses on both listening comprehension and speaking practice, providing a structured environment for users to engage with realistic dialogue scenarios.

## 2. App Overview

The app simulates a conversation between two parties (in this case, a customer and a barista in a cafe setting) in a target language (French) with translations provided in the user's native language (English). Users go through the conversation twice, once for each role, allowing them to practice both sides of the dialogue.

Key aspects of the app include:
- Audio playback of conversation lines
- Recording functionality for speaking practice
- Progress tracking
- Adaptive exercise types
- Playback speed control
- Simulated pronunciation feedback

## 3. Key Components

The app consists of several key components:
- Conversation Display: Shows the current conversation message, including both target language and native language text.
- Audio Controls: Allow users to play, pause, and adjust the speed of audio playback.
- Recording Interface: Enables users to record their own speech for speaking practice.
- Progress Indicators: Show the user's progress through the conversation and exercise completion status.
- Instruction Panel: Provides context-specific instructions for each exercise.
- Navigation Controls: Allow users to move between conversation sections and start new sessions.

## 4. User Flow

The typical user flow through the app is as follows:

1. Initial Setup:
   - Users are presented with the first message of the conversation.
   - Instructions for the current exercise type are displayed.

2. First Run-through (as Barista):
   - For each message:
     - If it's a "listen" exercise (customer's line), users play the audio and move to the next message.
     - If it's a "listen and repeat" exercise (barista's line):
       - Users listen to the audio.
       - Users record themselves repeating the line.
       - The app provides simulated pronunciation feedback.
   - After completing the first four messages, users proceed to the next section.
   - The process repeats for the remaining messages.

3. Role Switch:
   - After completing all messages, users are prompted to switch roles.
   - The conversation resets to the beginning.

4. Second Run-through (as Customer):
   - The process is similar to the first run-through, but with reversed roles.
   - Users now practice the customer's lines as "listen and repeat" exercises.

5. Completion:
   - After finishing both run-throughs, users see a completion message.
   - They can choose to start a new session and practice again.

## 5. Technical Implementation

The app is built using React and leverages several hooks for state management and side effects:
- `useState`: Manages various pieces of state such as current exercise, completed exercises, audio playback status, etc.
- `useEffect`: Handles side effects like audio preloading and updating completion status.
- `useRef`: Maintains references to audio elements for efficient access and control.

Key technical aspects include:
- Dynamic Exercise Generation: The app dynamically determines the exercise type (listen or listen and repeat) based on the current run-through and speaker role.
- Audio Handling: Audio elements are pre-loaded and managed using `useRef` and `useEffect` to ensure smooth playback and progress tracking.
- State Management: The app uses multiple `useState` hooks to manage different aspects of the app's state, allowing for responsive updates to the UI.
- Modular Design: The app utilizes various UI components (likely from a design system), suggesting a modular and maintainable structure.

## 6. Features and Functionality

- Audio Playback:
  - Users can play and pause audio for each message.
  - A progress bar shows the current position in the audio file.
- Recording Simulation:
  - While actual recording isn't implemented, the app simulates this process.
  - Mock feedback is provided after each recording attempt.
- Playback Speed Control:
  - Users can adjust audio playback speed (0.5x, 0.75x, 1x, 1.25x).
  - The selected speed applies to all audio elements.
- Progress Tracking:
  - A progress bar shows overall progress through the conversation.
  - Completed exercises are marked with green checkmarks.
- Adaptive Instructions:
  - Instructions change based on the current exercise type and user's progress.
- Section Navigation:
  - Users can proceed to the next section after completing the first four messages.
- Role Switching:
  - After the first run-through, users switch roles for a comprehensive practice experience.
- Session Management:
  - Users can start a new session after completing all exercises.

## 7. User Experience and Design

The app incorporates several design elements to enhance user experience:
- Visual Context: An image placeholder for a cafe scene sets the context for the conversation.
- Color Coding: Customer messages use a primary color scheme, while barista messages use a secondary color scheme.
- Active Message Highlighting: The current active message is highlighted and animated to draw user attention.
- Responsive Feedback: The app provides immediate visual feedback for user actions.
- Accessibility: Screen reader-friendly elements are included, such as aria labels for buttons.
- Bilingual Display: Each message shows both the target language (French) and the native language (English) translation.

## Data

TODO:

- Generate scripts (store as JSON) - DONE
- Generate images (store in public/) - DONE
- Write code to generate the audio from the client side using Next.js

### Scripts
- Stored as JSON locally
- Scripts Generated 5 scripts
  1. "gym-sports-center" (Signing Up for a Gym Membership)
  2. "clothing-store" (Returning an Item)
  3. "supermarket" (Shopping at a Local Market)
  4. "cafe-restaurant" (Ordering at a Café)
  5. "public-transportation" (Taking the Bus)

### Audio Files of the Messages (4 languages)
- Generated by the Microsoft Azure API when the exercise is loading, stored locally temporarily
  - fr-Fr
  - es-MX
  - es-ES
  - th-TH

### Images
- Generated by Flux on xAI, stored locally

## Frontend
- Next.js App
- No user authentication needed
- Storing user progress locally - local storage
- Language Selection - Select your language you want to learn.
- Language Practice - Start your language practice.

## API

### Client side
- Microsoft Azure Speech Service
  - Text to Speech
  - Pronunciation Assessment
- Groq.com
  - Llama 3.1 70b