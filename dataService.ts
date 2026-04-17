// ─────────────────────────────────────────────────────────────────────────────
// dataService.ts  —  Fala Brazil! complete data layer
// ─────────────────────────────────────────────────────────────────────────────
// Drop this file into your /src/services/ folder.
// Import and call these functions anywhere in your app.
// ─────────────────────────────────────────────────────────────────────────────

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp,
    increment,
    Timestamp,
    FieldValue,
  } from 'firebase/firestore';
  import { db, analytics } from './firebase'; // same folder as firebase.ts in /src
  import { logEvent } from 'firebase/analytics';
  import type { User } from 'firebase/auth';
  import { v4 as uuidv4 } from 'uuid';        // npm install uuid @types/uuid
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TYPES
  // ─────────────────────────────────────────────────────────────────────────────
  
  export type Level       = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  export type Subject     = 'grammar' | 'vocabulary' | 'reading' | 'speaking' | 'chat';
  export type SignupTrigger = 'streak_prompt' | 'progress_wall' | 'organic';
  
  export interface UserProfile {
    uid:                      string;
    email:                    string | null;
    displayName:              string | null;
    createdAt:                Timestamp | FieldValue;
    level:                    Level;
    timePreference:           string;
    streak:                   number;
    lastActiveAt:             Timestamp | FieldValue;
    totalMinutes:             number;
    totalXP:                  number;
    isAnonymous:              boolean;
    convertedFromAnonymousId: string | null;
  }
  
  export interface SubjectProgress {
    subject:            Subject;
    level:              Level;
    lessonsCompleted:   number;
    lessonsAttempted:   number;
    accuracy:           number;
    lastPractisedAt:    Timestamp | FieldValue;
    weakAreas:          string[];
    strongAreas:        string[];
    totalTimeSeconds:   number;
  }
  
  export interface ActivityEvent {
    type:            string;
    subject:         Subject;
    level:           Level;
    contentId:       string;
    correct:         boolean | null;
    responseTimeMs:  number | null;
    sessionId:       string;
    timestamp:       Timestamp | FieldValue;
    metadata:        Record<string, unknown>;
  }
  
  export interface Session {
    startedAt:            Timestamp | FieldValue;
    endedAt:              Timestamp | FieldValue | null;
    durationSeconds:      number;
    activitiesCompleted:  number;
    xpEarned:             number;
    level:                Level;
  }
  
  export interface AnonSession {
    createdAt:          Timestamp | FieldValue;
    lastActiveAt:       Timestamp | FieldValue;
    level:              Level | null;
    timePreference:     string | null;
    activity:           ActivityEvent[];
    convertedToUserId:  string | null;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ANONYMOUS SESSION  —  tracks users before they sign up
  // ─────────────────────────────────────────────────────────────────────────────
  
  const ANON_KEY = 'fb_anon_id';
  
  /** Returns existing anon ID from localStorage, or creates a new one */
  export function getAnonId(): string {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = `anon_${uuidv4()}`;
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  }
  
  /**
   * Call this on every app load for non-signed-in users.
   * Creates the Firestore doc on first visit; updates lastActiveAt on return visits.
   */
  export async function initAnonSession(): Promise<void> {
    const anonId = getAnonId();
    const ref    = doc(db, 'anonymousSessions', anonId);
    const snap   = await getDoc(ref);
  
    if (!snap.exists()) {
      await setDoc(ref, {
        createdAt:         serverTimestamp(),
        lastActiveAt:      serverTimestamp(),
        level:             null,
        timePreference:    null,
        activity:          [],
        convertedToUserId: null,
      });
    } else {
      await updateDoc(ref, { lastActiveAt: serverTimestamp() });
    }
  }
  
  /** Saves the level chosen during onboarding (anon user) */
  export async function setAnonLevel(level: Level, timePreference: string): Promise<void> {
    const anonId = getAnonId();
    await updateDoc(doc(db, 'anonymousSessions', anonId), {
      level,
      timePreference,
      lastActiveAt: serverTimestamp(),
    });
  }
  
  /** Appends an activity event to the anonymous session (capped at 50) */
  export async function logAnonActivity(event: Omit<ActivityEvent, 'timestamp'>): Promise<void> {
    const anonId = getAnonId();
    const ref    = doc(db, 'anonymousSessions', anonId);
    const snap   = await getDoc(ref);
  
    if (!snap.exists()) return;
  
    const current: ActivityEvent[] = snap.data().activity ?? [];
    const updated = [
      ...current.slice(-49),          // keep last 49
      { ...event, timestamp: Timestamp.now() },
    ];
  
    await updateDoc(ref, { activity: updated, lastActiveAt: serverTimestamp() });
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // USER PROFILE  —  signed-in users
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Creates a new user profile in Firestore after sign-up.
   * Pass anonId to carry over pre-signup activity.
   */
  export async function createUserProfile(
    uid:           string,
    email:         string | null,
    displayName:   string | null,
    level:         Level,
    timePreference: string,
    anonId?:       string,
  ): Promise<void> {
    const ref = doc(db, 'users', uid);
  
    // Merge in any anonymous session data first
    let preSignupActivity: ActivityEvent[] = [];
    if (anonId) {
      const anonSnap = await getDoc(doc(db, 'anonymousSessions', anonId));
      if (anonSnap.exists()) {
        preSignupActivity = anonSnap.data().activity ?? [];
        // Mark anonymous session as converted
        await updateDoc(doc(db, 'anonymousSessions', anonId), {
          convertedToUserId: uid,
        });
      }
    }
  
    await setDoc(ref, {
      uid,
      email,
      displayName,
      createdAt:                serverTimestamp(),
      level,
      timePreference,
      streak:                   0,
      lastActiveAt:             serverTimestamp(),
      totalMinutes:             0,
      totalXP:                  0,
      isAnonymous:              false,
      convertedFromAnonymousId: anonId ?? null,
    }, { merge: true });
  
    // Replay pre-signup activity into the real activity subcollection
    for (const event of preSignupActivity) {
      await addDoc(collection(db, 'users', uid, 'activity'), event);
    }
  
    // Clean up localStorage
    if (anonId) localStorage.removeItem(ANON_KEY);
  
    logEvent(analytics, 'signup_completed', { method: email ? 'email' : 'google', level });
  }
  
  /** Fetches a user's profile */
  export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  }
  
  /** Updates any top-level profile fields */
  export async function updateUserProfile(
    uid:  string,
    data: Partial<Pick<UserProfile, 'level' | 'timePreference' | 'displayName'>>,
  ): Promise<void> {
    await updateDoc(doc(db, 'users', uid), { ...data, lastActiveAt: serverTimestamp() });
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SESSIONS  —  one document per app visit
  // ─────────────────────────────────────────────────────────────────────────────
  
  let _activeSessionId: string | null = null;
  let _sessionStartTime: number       = Date.now();
  let _sessionXP                      = 0;
  let _sessionActivities              = 0;
  
  /** Call when the user starts a session (app load / sign in). Returns sessionId. */
  export async function startSession(uid: string, level: Level): Promise<string> {
    const ref = await addDoc(collection(db, 'users', uid, 'sessions'), {
      startedAt:           serverTimestamp(),
      endedAt:             null,
      durationSeconds:     0,
      activitiesCompleted: 0,
      xpEarned:            0,
      level,
    });
  
    _activeSessionId  = ref.id;
    _sessionStartTime = Date.now();
    _sessionXP        = 0;
    _sessionActivities = 0;
  
    logEvent(analytics, 'session_start', { level, uid });
    return ref.id;
  }
  
  /** Call when the user leaves or the app unmounts. */
  export async function endSession(uid: string): Promise<void> {
    if (!_activeSessionId) return;
  
    const durationSeconds = Math.round((Date.now() - _sessionStartTime) / 1000);
  
    await updateDoc(doc(db, 'users', uid, 'sessions', _activeSessionId), {
      endedAt:             serverTimestamp(),
      durationSeconds,
      activitiesCompleted: _sessionActivities,
      xpEarned:            _sessionXP,
    });
  
    // Add minutes to the user's total
    await updateDoc(doc(db, 'users', uid), {
      totalMinutes: increment(Math.round(durationSeconds / 60)),
      lastActiveAt: serverTimestamp(),
    });
  
    logEvent(analytics, 'session_end', {
      durationSeconds,
      activitiesCompleted: _sessionActivities,
      xpEarned: _sessionXP,
    });
  
    _activeSessionId = null;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIVITY LOGGING  —  every action the user takes
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Core function — call this every time a user does something meaningful.
   * Also fires the matching Firebase Analytics event automatically.
   */
  export async function logActivity(
    uid:    string,
    event:  Omit<ActivityEvent, 'timestamp' | 'sessionId'>,
    xp = 10,
  ): Promise<void> {
    const sessionId = _activeSessionId ?? 'no_session';
  
    // Write to Firestore activity subcollection
    await addDoc(collection(db, 'users', uid, 'activity'), {
      ...event,
      sessionId,
      timestamp: serverTimestamp(),
    });
  
    // Update session counters
    _sessionActivities++;
    _sessionXP += xp;
  
    // Update XP on user profile
    await updateDoc(doc(db, 'users', uid), { totalXP: increment(xp) });
  
    // Fire matching Analytics event
    logEvent(analytics, event.type, {
      subject:        event.subject,
      level:          event.level,
      contentId:      event.contentId,
      correct:        event.correct,
      responseTimeMs: event.responseTimeMs,
      ...event.metadata,
    });
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SUBJECT PROGRESS  —  accuracy and weak/strong areas per subject
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Call after any exercise attempt.
   * Recalculates accuracy and updates weak/strong area arrays.
   */
  export async function updateSubjectProgress(
    uid:      string,
    subject:  Subject,
    level:    Level,
    correct:  boolean,
    topic:    string,           // e.g. 'subjunctive', 'past_tense', 'articles'
    timeSpentSeconds = 0,
  ): Promise<void> {
    const ref  = doc(db, 'users', uid, 'progress', subject);
    const snap = await getDoc(ref);
  
    if (!snap.exists()) {
      // First time practising this subject
      await setDoc(ref, {
        subject,
        level,
        lessonsCompleted:  correct ? 1 : 0,
        lessonsAttempted:  1,
        accuracy:          correct ? 1 : 0,
        lastPractisedAt:   serverTimestamp(),
        weakAreas:         correct ? [] : [topic],
        strongAreas:       correct ? [topic] : [],
        totalTimeSeconds:  timeSpentSeconds,
      });
      return;
    }
  
    const data            = snap.data() as SubjectProgress;
    const newAttempted    = data.lessonsAttempted + 1;
    const newCompleted    = data.lessonsCompleted + (correct ? 1 : 0);
    const newAccuracy     = newCompleted / newAttempted;
  
    // Update weak/strong area arrays
    let weakAreas   = [...(data.weakAreas ?? [])];
    let strongAreas = [...(data.strongAreas ?? [])];
  
    if (!correct && !weakAreas.includes(topic)) {
      weakAreas = [...weakAreas.slice(-9), topic];   // keep last 10
    }
    if (correct && weakAreas.includes(topic)) {
      weakAreas = weakAreas.filter(t => t !== topic);
      if (!strongAreas.includes(topic)) strongAreas = [...strongAreas.slice(-9), topic];
    }
  
    await updateDoc(ref, {
      lessonsAttempted:  newAttempted,
      lessonsCompleted:  newCompleted,
      accuracy:          newAccuracy,
      lastPractisedAt:   serverTimestamp(),
      weakAreas,
      strongAreas,
      totalTimeSeconds:  increment(timeSpentSeconds),
      level,              // update to current level
    });
  }
  
  /** Fetches progress for all subjects — used for the progress dashboard */
  export async function getAllProgress(
    uid: string,
  ): Promise<Record<Subject, SubjectProgress | null>> {
    const subjects: Subject[] = ['grammar', 'vocabulary', 'reading', 'speaking', 'chat'];
    const results = await Promise.all(
      subjects.map(s => getDoc(doc(db, 'users', uid, 'progress', s))),
    );
  
    return Object.fromEntries(
      subjects.map((s, i) => [s, results[i].exists() ? (results[i].data() as SubjectProgress) : null]),
    ) as Record<Subject, SubjectProgress | null>;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // STREAKS  —  daily practice tracking
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Call once per day when the user completes any activity.
   * Increments streak if they practised yesterday, resets if they missed a day.
   */
  export async function updateStreak(uid: string): Promise<number> {
    const ref  = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return 0;
  
    const { streak, lastActiveAt } = snap.data() as UserProfile;
    const lastDate = (lastActiveAt as Timestamp)?.toDate();
    const today    = new Date();
  
    const daysSinceLast = lastDate
      ? Math.floor((today.getTime() - lastDate.getTime()) / 86_400_000)
      : 999;
  
    let newStreak = streak;
    if (daysSinceLast === 1) {
      newStreak = streak + 1;           // practised yesterday → extend streak
    } else if (daysSinceLast > 1) {
      newStreak = 1;                    // missed a day → reset
    }
    // daysSinceLast === 0 means same day, don't change streak
  
    await updateDoc(ref, { streak: newStreak, lastActiveAt: serverTimestamp() });
  
    if (newStreak > 0 && newStreak % 7 === 0) {
      logEvent(analytics, 'streak_hit', { days: newStreak });
    }
  
    return newStreak;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CONVENIENCE WRAPPERS  —  one call per activity type
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Grammar question answered */
  export async function trackGrammarQuestion(
    uid:           string,
    level:         Level,
    topic:         string,
    contentId:     string,
    correct:       boolean,
    responseTimeMs: number,
  ): Promise<void> {
    await logActivity(uid, {
      type:          'grammar_question_answered',
      subject:       'grammar',
      level,
      contentId,
      correct,
      responseTimeMs,
      metadata:      { topic },
    }, correct ? 15 : 5);
  
    await updateSubjectProgress(uid, 'grammar', level, correct, topic);
  }
  
  /** Vocabulary flashcard seen/answered */
  export async function trackVocabCard(
    uid:       string,
    level:     Level,
    word:      string,
    correct:   boolean,
  ): Promise<void> {
    await logActivity(uid, {
      type:          'vocabulary_card_seen',
      subject:       'vocabulary',
      level,
      contentId:     `vocab_${word}`,
      correct,
      responseTimeMs: null,
      metadata:      { word },
    }, correct ? 10 : 3);
  
    await updateSubjectProgress(uid, 'vocabulary', level, correct, word);
  }
  
  /** Reading article opened */
  export async function trackArticleOpened(
    uid:       string,
    level:     Level,
    articleId: string,
  ): Promise<void> {
    await logActivity(uid, {
      type:          'reading_article_opened',
      subject:       'reading',
      level,
      contentId:     articleId,
      correct:       null,
      responseTimeMs: null,
      metadata:      {},
    }, 5);
  }
  
  /** Reading article finished */
  export async function trackArticleFinished(
    uid:              string,
    level:            Level,
    articleId:        string,
    timeSpentSeconds: number,
  ): Promise<void> {
    await logActivity(uid, {
      type:          'reading_article_finished',
      subject:       'reading',
      level,
      contentId:     articleId,
      correct:       null,
      responseTimeMs: null,
      metadata:      { timeSpentSeconds },
    }, 20);
  
    await updateSubjectProgress(uid, 'reading', level, true, articleId, timeSpentSeconds);
  }
  
  /** Speaking exercise attempted */
  export async function trackSpeakingAttempt(
    uid:         string,
    level:       Level,
    exerciseId:  string,
    score:       number,   // 0–100
  ): Promise<void> {
    const passed = score >= 60;
    await logActivity(uid, {
      type:          'speaking_attempt',
      subject:       'speaking',
      level,
      contentId:     exerciseId,
      correct:       passed,
      responseTimeMs: null,
      metadata:      { score },
    }, Math.round(score / 5));
  
    await updateSubjectProgress(uid, 'speaking', level, passed, exerciseId);
  }
  
  /** Chat message sent to Isabela */
  export async function trackChatMessage(
    uid:        string,
    level:      Level,
    turnNumber: number,
  ): Promise<void> {
    await logActivity(uid, {
      type:          'chat_message_sent',
      subject:       'chat',
      level,
      contentId:     `chat_turn_${turnNumber}`,
      correct:       null,
      responseTimeMs: null,
      metadata:      { turnNumber },
    }, 8);
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ONBOARDING ANALYTICS  —  fire these during the onboarding flow
  // ─────────────────────────────────────────────────────────────────────────────
  
  export function trackOnboardingLevelSelected(level: Level, method: 'manual' | 'test'): void {
    logEvent(analytics, 'onboarding_level_selected', { level, method });
  }
  
  export function trackOnboardingCompleted(level: Level, timePreference: string): void {
    logEvent(analytics, 'onboarding_completed', { level, timePreference });
  }
  
  export function trackSignupStarted(trigger: SignupTrigger): void {
    logEvent(analytics, 'signup_started', { trigger });
  }

  /**
   * Create or update the `users/{uid}` document after Firebase Auth sign-in
   * (email/password or Google). Used by popup, redirect, and post-redirect app init.
   */
  export async function syncAuthUserToFirestore(
    user: User,
    options?: { displayNameOverride?: string }
  ): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);
    const displayName = options?.displayNameOverride ?? user.displayName ?? 'User';
    const emailAddr = user.email || '';

    if (!existing.exists()) {
      const savedLevel = localStorage.getItem('userLevel') || null;
      const savedStreak = parseInt(localStorage.getItem('streak') || '0', 10);
      const savedTotalPts = parseInt(localStorage.getItem('totalPts') || '0', 10);
      const savedCurrentDay = parseInt(localStorage.getItem('currentDay') || '1', 10);
      const savedTimePreference = localStorage.getItem('timePreference') || null;
      const savedLearningGoal = localStorage.getItem('learningGoal') || null;

      await setDoc(userRef, {
        name: displayName,
        email: emailAddr,
        level: savedLevel,
        xp: 0,
        streak: savedStreak,
        totalPts: savedTotalPts,
        currentDay: savedCurrentDay,
        timePreference: savedTimePreference,
        learningGoal: savedLearningGoal,
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      });
    } else {
      await updateDoc(userRef, {
        lastActiveAt: new Date().toISOString(),
      });
    }
  }
  
  export function trackLevelUp(fromLevel: Level, toLevel: Level): void {
    logEvent(analytics, 'level_up', { fromLevel, toLevel });
  }

  export interface IsabelaSessionData {
    timestamp:       Timestamp | FieldValue;
    level:           Level;
    durationSeconds: number;
    rating:          number | null;
    feedback:        string;
    transcript:      { role: 'user' | 'assistant'; content: string }[];
  }

  export async function saveIsabelaSession(
    uid:  string,
    data: Omit<IsabelaSessionData, 'timestamp'>,
  ): Promise<void> {
    await addDoc(collection(db, 'users', uid, 'isabelaSessions'), {
      ...data,
      timestamp: serverTimestamp(),
    });
    logEvent(analytics, 'isabela_session_saved', { level: data.level, rating: data.rating });
  }
  