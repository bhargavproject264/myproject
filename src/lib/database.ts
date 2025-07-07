import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function initDatabase() {
  const db = await open({
    filename: path.join(process.cwd(), 'mental_health.db'),
    driver: sqlite3.Database,
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      preferences TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_assessments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      stress_level INTEGER NOT NULL,
      mood_level INTEGER NOT NULL,
      sleep_hours REAL NOT NULL,
      work_hours REAL NOT NULL,
      exercise_minutes INTEGER DEFAULT 0,
      social_interaction INTEGER NOT NULL,
      screen_time REAL DEFAULT 0,
      caffeine INTEGER DEFAULT 0,
      alcohol INTEGER DEFAULT 0,
      symptoms TEXT DEFAULT '[]',
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS stress_patterns (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      pattern_type TEXT NOT NULL,
      triggers TEXT NOT NULL,
      intensity INTEGER NOT NULL,
      frequency INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS risk_assessments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      factors TEXT NOT NULL,
      score INTEGER NOT NULL,
      recommendations TEXT NOT NULL,
      needs_professional_help BOOLEAN NOT NULL,
      assessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS interventions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration INTEGER NOT NULL,
      effectiveness REAL NOT NULL,
      culturally_adapted BOOLEAN DEFAULT FALSE,
      instructions TEXT NOT NULL,
      resources TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_daily_assessments_user_date ON daily_assessments(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_stress_patterns_user ON stress_patterns(user_id);
    CREATE INDEX IF NOT EXISTS idx_risk_assessments_user ON risk_assessments(user_id);
  `);

  // Insert default interventions
  await db.run(`
    INSERT OR IGNORE INTO interventions (id, type, title, description, duration, effectiveness, culturally_adapted, instructions, resources)
    VALUES 
    ('breathing-1', 'breathing', '4-7-8 Breathing Technique', 'A simple breathing exercise to reduce stress and anxiety', 5, 0.85, true, '["Inhale for 4 counts", "Hold for 7 counts", "Exhale for 8 counts", "Repeat 4-6 times"]', '["https://www.healthline.com/health/4-7-8-breathing"]'),
    ('meditation-1', 'meditation', 'Mindfulness Meditation', 'Basic mindfulness practice for stress reduction', 10, 0.78, true, '["Find a quiet space", "Sit comfortably", "Focus on your breath", "Notice thoughts without judgment", "Return focus to breath"]', '["https://www.headspace.com/meditation/mindfulness"]'),
    ('exercise-1', 'exercise', 'Quick Stress-Relief Walk', 'A brief walk to clear your mind and reduce tension', 15, 0.72, true, '["Step outside if possible", "Walk at a comfortable pace", "Focus on your surroundings", "Take deep breaths", "Notice how you feel"]', '["https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/exercise-and-stress/art-20044469"]'),
    ('social-1', 'social', 'Connect with a Friend', 'Reach out to someone you trust for support', 20, 0.68, true, '["Choose someone you feel comfortable with", "Share how you are feeling", "Listen actively", "Ask for specific support if needed"]', '["https://www.mentalhealth.gov/get-help/immediate-help"]'),
    ('professional-1', 'professional', 'Professional Mental Health Support', 'Connect with a mental health professional', 60, 0.95, true, '["Contact your healthcare provider", "Use online therapy platforms", "Call a mental health hotline", "Visit a local mental health center"]', '["https://www.mentalhealth.gov/get-help/immediate-help", "https://www.psychologytoday.com/us/therapists"]]')
  `);

  return db;
}