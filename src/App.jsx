import React, { useState, useEffect, useRef } from "react";

// --- EXERCISE DATABASE FOR DYNAMIC GENERATION ---
const EXERCISE_LIBRARY = {
  gym: {
    strength: [
      { name: "Barbell Squats", target: "Legs", defaultSets: 4, defaultReps: 6, weight: 80 },
      { name: "Barbell Bench Press", target: "Chest", defaultSets: 4, defaultReps: 6, weight: 60 },
      { name: "Deadlift", target: "Back/Hamstrings", defaultSets: 3, defaultReps: 5, weight: 100 },
      { name: "Overhead Press", target: "Shoulders", defaultSets: 4, defaultReps: 6, weight: 40 },
      { name: "Weighted Pull-ups", target: "Back", defaultSets: 3, defaultReps: 8, weight: 10 },
    ],
    hypertrophy: [
      { name: "Incline Dumbbell Bench Press", target: "Chest", defaultSets: 3, defaultReps: 10, weight: 22 },
      { name: "Lat Pulldowns", target: "Back", defaultSets: 3, defaultReps: 12, weight: 50 },
      { name: "Leg Press", target: "Quads/Glutes", defaultSets: 3, defaultReps: 12, weight: 120 },
      { name: "Dumbbell Lateral Raises", target: "Shoulders", defaultSets: 4, defaultReps: 15, weight: 8 },
      { name: "Incline Bicep Curls", target: "Biceps", defaultSets: 3, defaultReps: 12, weight: 12 },
      { name: "Tricep Overhead Extensions", target: "Triceps", defaultSets: 3, defaultReps: 12, weight: 16 },
    ],
    endurance: [
      { name: "Kettlebell Swings", target: "Posterior Chain", defaultSets: 4, defaultReps: 20, weight: 16 },
      { name: "Dumbbell Thrusters", target: "Full Body", defaultSets: 3, defaultReps: 15, weight: 10 },
      { name: "Barbell Clean and Press", target: "Full Body", defaultSets: 4, defaultReps: 12, weight: 30 },
      { name: "Goblet Squats", target: "Quads", defaultSets: 3, defaultReps: 20, weight: 20 },
    ]
  },
  dumbbells: {
    strength: [
      { name: "Dumbbell Goblet Squat", target: "Legs", defaultSets: 4, defaultReps: 8, weight: 24 },
      { name: "Dumbbell Floor Press", target: "Chest", defaultSets: 4, defaultReps: 8, weight: 20 },
      { name: "Dumbbell Romanian Deadlift", target: "Hamstrings", defaultSets: 4, defaultReps: 8, weight: 22 },
      { name: "Seated Dumbbell Press", target: "Shoulders", defaultSets: 4, defaultReps: 8, weight: 16 },
      { name: "Single Arm Dumbbell Row", target: "Back", defaultSets: 4, defaultReps: 8, weight: 20 },
    ],
    hypertrophy: [
      { name: "Flat Dumbbell Press", target: "Chest", defaultSets: 3, defaultReps: 12, weight: 18 },
      { name: "Bulgarian Split Squats", target: "Legs", defaultSets: 3, defaultReps: 10, weight: 12 },
      { name: "Dumbbell Chest Flyes", target: "Chest", defaultSets: 3, defaultReps: 12, weight: 10 },
      { name: "Standing Dumbbell Lateral Raise", target: "Shoulders", defaultSets: 4, defaultReps: 15, weight: 6 },
      { name: "Dumbbell Hammer Curls", target: "Biceps", defaultSets: 3, defaultReps: 12, weight: 10 },
      { name: "Lying Dumbbell Tricep Extension", target: "Triceps", defaultSets: 3, defaultReps: 12, weight: 8 },
    ],
    endurance: [
      { name: "Dumbbell Goblet Thruster", target: "Full Body", defaultSets: 4, defaultReps: 25, weight: 8 },
      { name: "Renegade Rows", target: "Back/Core", defaultSets: 3, defaultReps: 16, weight: 10 },
      { name: "Dumbbell Swings", target: "Posterior Chain", defaultSets: 4, defaultReps: 20, weight: 12 },
      { name: "Dumbbell Farmer's Walk", target: "Grip/Core", defaultSets: 3, defaultReps: 30, weight: 16 },
    ]
  },
  bodyweight: {
    strength: [
      { name: "Decline Push-ups", target: "Chest", defaultSets: 4, defaultReps: 10, weight: 0 },
      { name: "Assisted Pistol Squats", target: "Legs", defaultSets: 3, defaultReps: 8, weight: 0 },
      { name: "Pike Push-ups", target: "Shoulders", defaultSets: 4, defaultReps: 8, weight: 0 },
      { name: "Pull-ups / Chin-ups", target: "Back", defaultSets: 4, defaultReps: 6, weight: 0 },
      { name: "Parallel Bar Dips", target: "Triceps/Chest", defaultSets: 4, defaultReps: 8, weight: 0 },
    ],
    hypertrophy: [
      { name: "Standard Push-ups", target: "Chest", defaultSets: 3, defaultReps: 15, weight: 0 },
      { name: "Air Squats", target: "Legs", defaultSets: 4, defaultReps: 22, weight: 0 },
      { name: "Diamond Push-ups", target: "Triceps/Chest", defaultSets: 3, defaultReps: 12, weight: 0 },
      { name: "Walking Lunges", target: "Legs", defaultSets: 3, defaultReps: 16, weight: 0 },
      { name: "Bodyweight Inverted Rows", target: "Back", defaultSets: 3, defaultReps: 12, weight: 0 },
      { name: "Plank Shoulder Taps", target: "Core", defaultSets: 3, defaultReps: 20, weight: 0 },
    ],
    endurance: [
      { name: "Burpees", target: "Full Body", defaultSets: 4, defaultReps: 15, weight: 0 },
      { name: "Mountain Climbers", target: "Core/Cardio", defaultSets: 4, defaultReps: 30, weight: 0 },
      { name: "Jumping Jacks", target: "Cardio", defaultSets: 4, defaultReps: 50, weight: 0 },
      { name: "Bicycle Crunches", target: "Abs", defaultSets: 4, defaultReps: 25, weight: 0 },
    ]
  }
};

const DUMMY_QUOTES = [
  "No matter how slow you go, you are still lapping everyone on the couch.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Action is the foundational key to all success.",
  "What hurts today makes you stronger tomorrow.",
  "Consistency beats intensity every single time."
];

// --- SOUND SYNTHESIS FOR REST TIMER ---
const playBeep = (frequency, duration) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Web Audio API not allowed/supported in this state.", e);
  }
};

export default function App() {
  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("fitflow_theme") === "light" ? false : true
  );

  // --- STATE VARIABLES ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isGuest, setIsGuest] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("fitflow_token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("fitflow_user")) || null);
  const [authMode, setAuthMode] = useState("login"); // login, register

  // Auth form fields
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Health Calculator inputs/results
  const [calcAge, setCalcAge] = useState(25);
  const [calcGender, setCalcGender] = useState("male");
  const [calcWeight, setCalcWeight] = useState(70); // kg
  const [calcHeight, setCalcHeight] = useState(175); // cm
  const [calcActivity, setCalcActivity] = useState("1.55"); // moderate
  const [calcGoal, setCalcGoal] = useState("lose"); // lose, maintain, gain
  const [calcResult, setCalcResult] = useState(null);

  // Routine Generator inputs/results
  const [genGoal, setGenGoal] = useState("hypertrophy");
  const [genEquipment, setGenEquipment] = useState("gym");
  const [genDays, setGenDays] = useState(3);
  const [generatedRoutine, setGeneratedRoutine] = useState(null);

  // Active workout tracking
  const [activeWorkoutList, setActiveWorkoutList] = useState([]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [activeSetsCompleted, setActiveSetsCompleted] = useState({}); // { exerciseIndex: numSets }
  const [timerDuration, setTimerDuration] = useState(60); // default 60s
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const [loggedSetsCount, setLoggedSetsCount] = useState(0);

  // Daily Water Tracker
  const [waterIntake, setWaterIntake] = useState(0); // in ml

  // User Weight Journal (for local graph/logs)
  const [weightLogs, setWeightLogs] = useState([]);
  const [newLogWeight, setNewLogWeight] = useState("");

  // Backend Synchronized Stats & Log History
  const [apiStats, setApiStats] = useState({
    total_workouts: 0,
    total_volume: 0,
    popular_exercise: "None",
    streak: 0
  });
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [workoutLogForm, setWorkoutLogForm] = useState({
    exercise_name: "Barbell Bench Press",
    sets: 3,
    reps: 10,
    weight: 60,
    date: new Date().toISOString().split("T")[0]
  });

  // Daily quote
  const [currentQuote, setCurrentQuote] = useState("");

  const timerRef = useRef(null);

  // --- THEME SYNC EFFECT ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.className = "dark-theme";
      localStorage.setItem("fitflow_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.className = "light-theme";
      localStorage.setItem("fitflow_theme", "light");
    }
  }, [isDarkMode]);

  // --- INITIAL LOAD & SYNC ---
  useEffect(() => {
    // Select daily quote
    const rand = Math.floor(Math.random() * DUMMY_QUOTES.length);
    setCurrentQuote(DUMMY_QUOTES[rand]);

    // Load water target & weight history from localStorage
    const savedWater = localStorage.getItem("fitflow_water");
    const todayStr = new Date().toDateString();
    const savedWaterDay = localStorage.getItem("fitflow_water_day");

    if (savedWater && savedWaterDay === todayStr) {
      setWaterIntake(parseInt(savedWater));
    } else {
      setWaterIntake(0);
      localStorage.setItem("fitflow_water", "0");
      localStorage.setItem("fitflow_water_day", todayStr);
    }

    const savedWeightLogs = localStorage.getItem("fitflow_weight_logs");
    if (savedWeightLogs) {
      setWeightLogs(JSON.parse(savedWeightLogs));
    } else {
      const initialLogs = [
        { date: "06-12", weight: 72.5 },
        { date: "06-14", weight: 71.8 },
        { date: "06-16", weight: 71.2 },
        { date: "06-18", weight: 70.0 }
      ];
      setWeightLogs(initialLogs);
      localStorage.setItem("fitflow_weight_logs", JSON.stringify(initialLogs));
    }

    // If authenticated, fetch from API
    if (token) {
      fetchBackendData();
    }
  }, [token]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (timerIsActive && timerSecondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        const nextSec = timerSecondsLeft - 1;
        setTimerSecondsLeft(nextSec);

        // Sound cues for last 3 seconds and completion
        if (nextSec === 3 || nextSec === 2 || nextSec === 1) {
          playBeep(440, 0.05); // Short low pitch warning
        } else if (nextSec === 0) {
          playBeep(880, 0.2); // Longer high pitch complete
          setTimerIsActive(false);
        }
      }, 1000);
    } else {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerIsActive, timerSecondsLeft]);

  // --- API FETCH WRAPPER ---
  const fetchBackendData = async () => {
    if (!token) return;
    try {
      // Fetch stats
      const statsRes = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setApiStats(statsData);
      }

      // Fetch logs
      const logsRes = await fetch("/api/workouts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setWorkoutLogs(logsData);
      }
    } catch (err) {
      console.error("Error synchronizing backend data:", err);
    }
  };

  // --- REGISTRATION / LOGIN ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setLoading(true);

    const isReg = authMode === "register";
    const endpoint = isReg ? "/api/auth/register" : "/api/auth/login";
    const payload = isReg
      ? { email: authEmail, password: authPassword, name: authName }
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Authentication request failed.");
      }

      // Store auth state
      localStorage.setItem("fitflow_token", data.access_token);
      localStorage.setItem("fitflow_user", JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      setIsGuest(false);
      setAuthSuccess(`Welcome, ${data.user.name}!`);

      // Reset form
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");

      // Redirect to dashboard
      setTimeout(() => {
        setActiveTab("dashboard");
      }, 800);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fitflow_token");
    localStorage.removeItem("fitflow_user");
    setToken("");
    setUser(null);
    setIsGuest(false);
    setActiveTab("dashboard");
  };

  // --- WATER MANAGEMENT ---
  const changeWater = (amount) => {
    const nextVal = Math.max(0, waterIntake + amount);
    setWaterIntake(nextVal);
    localStorage.setItem("fitflow_water", nextVal.toString());
  };

  // --- MANUAL WORKOUT LOGGING ---
  const handleManualWorkoutSubmit = async (e) => {
    e.preventDefault();
    if (!token && !isGuest) {
      alert("Please login or continue as Guest to record workouts!");
      return;
    }

    const newLog = {
      exercise_name: workoutLogForm.exercise_name,
      sets: parseInt(workoutLogForm.sets),
      reps: parseInt(workoutLogForm.reps),
      weight: parseFloat(workoutLogForm.weight),
      date: workoutLogForm.date
    };

    if (isGuest) {
      // Save locally for guest
      const localLogs = JSON.parse(localStorage.getItem("fitflow_guest_workouts") || "[]");
      const guestLog = {
        ...newLog,
        id: Date.now(),
        user_id: 0,
        created_at: new Date().toISOString()
      };
      const updated = [guestLog, ...localLogs];
      localStorage.setItem("fitflow_guest_workouts", JSON.stringify(updated));
      setWorkoutLogs(updated);

      // Recalculate local mock stats
      recalculateGuestStats(updated);
      alert("Workout recorded locally (Guest Mode)!");
    } else {
      // Save to database
      try {
        const res = await fetch("/api/workouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newLog)
        });

        if (!res.ok) throw new Error("Failed to save workout to database.");

        alert("Workout saved successfully to cloud!");
        fetchBackendData(); // refresh API stats & list
      } catch (err) {
        alert("Error logging workout: " + err.message);
      }
    }
  };

  // Deleting logs
  const handleDeleteWorkout = async (logId) => {
    if (isGuest) {
      const localLogs = JSON.parse(localStorage.getItem("fitflow_guest_workouts") || "[]");
      const updated = localLogs.filter((w) => w.id !== logId);
      localStorage.setItem("fitflow_guest_workouts", JSON.stringify(updated));
      setWorkoutLogs(updated);
      recalculateGuestStats(updated);
    } else {
      try {
        const res = await fetch(`/api/workouts/${logId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to delete log from database.");
        fetchBackendData();
      } catch (err) {
        alert("Error deleting workout: " + err.message);
      }
    }
  };

  const recalculateGuestStats = (logs) => {
    const totalW = logs.length;
    const totalV = logs.reduce((acc, curr) => acc + curr.sets * curr.reps * curr.weight, 0);

    const counts = {};
    logs.forEach((w) => {
      counts[w.exercise_name] = (counts[w.exercise_name] || 0) + 1;
    });
    const popEx = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), "None");

    setApiStats({
      total_workouts: totalW,
      total_volume: totalV,
      popular_exercise: popEx,
      streak: totalW > 0 ? 1 : 0 // simple placeholder
    });
  };

  // --- CALORIE & MACRO CALCULATIONS ---
  const handleCalculateTDEE = (e) => {
    e.preventDefault();

    // BMR (Mifflin-St Jeor)
    let bmr = 0;
    if (calcGender === "male") {
      bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge + 5;
    } else {
      bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge - 161;
    }

    // TDEE
    const tdee = Math.round(bmr * parseFloat(calcActivity));

    // Target Calories based on Goal
    let targetCal = tdee;
    if (calcGoal === "lose") targetCal = Math.max(1200, tdee - 500);
    else if (calcGoal === "gain") targetCal = tdee + 300;

    // Macro splits:
    // Protein: 2.0g per kg (4 kcal/g)
    // Fat: 0.9g per kg (9 kcal/g)
    // Carbs: Rest of the calories (4 kcal/g)
    const proteinGrams = Math.round(calcWeight * 2.0);
    const fatGrams = Math.round(calcWeight * 0.9);

    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const carbsCalories = Math.max(0, targetCal - (proteinCalories + fatCalories));
    const carbsGrams = Math.round(carbsCalories / 4);

    const bmi = (calcWeight / ((calcHeight / 100) ** 2)).toFixed(1);
    let bmiCategory = "Normal";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi >= 25 && bmi < 30) bmiCategory = "Overweight";
    else if (bmi >= 30) bmiCategory = "Obese";

    const results = {
      bmi,
      bmiCategory,
      bmr: Math.round(bmr),
      tdee,
      targetCal,
      proteinGrams,
      fatGrams,
      carbsGrams,
      pPct: Math.round((proteinCalories / targetCal) * 100),
      fPct: Math.round((fatCalories / targetCal) * 100),
      cPct: Math.round((carbsCalories / targetCal) * 100)
    };

    setCalcResult(results);

    // Save profile locally
    localStorage.setItem(
      "fitflow_profile",
      JSON.stringify({
        age: calcAge,
        gender: calcGender,
        weight: calcWeight,
        height: calcHeight,
        activity: calcActivity,
        goal: calcGoal,
        targetCal
      })
    );
  };

  // --- DYNAMIC ROUTINE GENERATION ---
  const handleGenerateRoutine = (e) => {
    e.preventDefault();

    const lib = EXERCISE_LIBRARY[genEquipment][genGoal];
    if (!lib) return;

    // Generate training routine splits based on frequency
    const routine = [];
    if (genDays === 3) {
      routine.push({
        day: "Monday: Push (Chest, Shoulders, Triceps)",
        exercises: lib.filter((ex) => ["Chest", "Shoulders", "Triceps", "Full Body"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Wednesday: Pull (Back, Biceps, Core)",
        exercises: lib.filter((ex) => ["Back", "Biceps", "Core/Cardio", "Grip/Core"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Friday: Legs & Abs",
        exercises: lib.filter((ex) => ["Legs", "Quads/Glutes", "Hamstrings", "Quads", "Abs", "Posterior Chain"].includes(ex.target)).slice(0, 4)
      });
    } else if (genDays === 4) {
      routine.push({
        day: "Monday: Upper Body A",
        exercises: lib.filter((ex) => ["Chest", "Shoulders", "Triceps"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Tuesday: Lower Body A",
        exercises: lib.filter((ex) => ["Legs", "Quads/Glutes", "Abs"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Thursday: Upper Body B",
        exercises: lib.filter((ex) => ["Back", "Biceps", "Shoulders"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Friday: Lower Body B & Core",
        exercises: lib.filter((ex) => ["Hamstrings", "Posterior Chain", "Core/Cardio", "Abs"].includes(ex.target)).slice(0, 4)
      });
    } else {
      // 5 Days Bro Split
      routine.push({
        day: "Monday: Chest Day",
        exercises: lib.filter((ex) => ["Chest", "Full Body"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Tuesday: Back Day",
        exercises: lib.filter((ex) => ["Back", "Grip/Core"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Wednesday: Leg Day",
        exercises: lib.filter((ex) => ["Legs", "Quads/Glutes", "Hamstrings", "Quads"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Thursday: Shoulder Day",
        exercises: lib.filter((ex) => ["Shoulders"].includes(ex.target)).slice(0, 4)
      });
      routine.push({
        day: "Friday: Arm & Core Day",
        exercises: lib.filter((ex) => ["Biceps", "Triceps", "Abs"].includes(ex.target)).slice(0, 4)
      });
    }

    // Ensure every day has exercises
    routine.forEach((dayRoutine) => {
      if (dayRoutine.exercises.length === 0) {
        dayRoutine.exercises = lib.slice(0, 3);
      }
    });

    setGeneratedRoutine(routine);
  };

  // --- WORKOUT IN-PROGRESS TRACKER ---
  const startRoutineSession = (dayName, exercises) => {
    setActiveWorkoutList(exercises);
    setActiveExerciseIndex(0);

    const initialCompleted = {};
    exercises.forEach((_, idx) => {
      initialCompleted[idx] = 0;
    });
    setActiveSetsCompleted(initialCompleted);
    setLoggedSetsCount(0);
    setActiveTab("active-workout");
    setTimerSecondsLeft(0);
    setTimerIsActive(false);
  };

  const incrementSetCompleted = (exIdx) => {
    const current = activeSetsCompleted[exIdx] || 0;
    const maxSets = activeWorkoutList[exIdx].defaultSets;
    if (current >= maxSets) return;

    const updated = { ...activeSetsCompleted, [exIdx]: current + 1 };
    setActiveSetsCompleted(updated);
    setLoggedSetsCount((c) => c + 1);

    // Fire timer!
    setTimerSecondsLeft(timerDuration);
    setTimerIsActive(true);
    playBeep(660, 0.1); // Small set complete beep
  };

  // Logging active workout exercise by exercise
  const logActiveExerciseToDatabase = async (exIndex) => {
    const ex = activeWorkoutList[exIndex];
    const completedSets = activeSetsCompleted[exIndex] || 0;
    if (completedSets === 0) {
      alert("Perform at least one set before logging!");
      return;
    }

    const payload = {
      exercise_name: ex.name,
      sets: completedSets,
      reps: ex.defaultReps,
      weight: ex.weight || 0,
      date: new Date().toISOString().split("T")[0]
    };

    if (token) {
      try {
        const res = await fetch("/api/workouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          alert(`Logged: ${ex.name} (${completedSets} sets) synced to Cloud!`);
          fetchBackendData();
        } else {
          throw new Error();
        }
      } catch (err) {
        alert("Failed to sync log online. Saving locally...");
        saveWorkoutLocally(payload);
      }
    } else {
      saveWorkoutLocally(payload);
      alert(`Logged: ${ex.name} (${completedSets} sets) saved locally (Guest Mode)!`);
    }
  };

  const saveWorkoutLocally = (payload) => {
    const localLogs = JSON.parse(localStorage.getItem("fitflow_guest_workouts") || "[]");
    const guestLog = {
      ...payload,
      id: Date.now(),
      user_id: 0,
      created_at: new Date().toISOString()
    };
    const updated = [guestLog, ...localLogs];
    localStorage.setItem("fitflow_guest_workouts", JSON.stringify(updated));
    setWorkoutLogs(updated);
    recalculateGuestStats(updated);
  };

  // --- WEIGHT LOGGING (LOCAL GRAPH) ---
  const handleAddWeightLog = (e) => {
    e.preventDefault();
    if (!newLogWeight || isNaN(newLogWeight)) return;

    const date = new Date();
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const newLog = { date: formattedDate, weight: parseFloat(newLogWeight) };
    const updatedLogs = [...weightLogs, newLog].slice(-7); // Keep last 7 entries
    setWeightLogs(updatedLogs);
    localStorage.setItem("fitflow_weight_logs", JSON.stringify(updatedLogs));
    setNewLogWeight("");
  };

  // --- GUEST LOGIN TOGGLE ---
  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setToken("");
    setUser({ name: "Guest User", email: "guest@fitflow.app" });
    const localLogs = JSON.parse(localStorage.getItem("fitflow_guest_workouts") || "[]");
    setWorkoutLogs(localLogs);
    recalculateGuestStats(localLogs);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* BRAND & HEADER BAR */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/50 dark:border-gray-800 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
                Gs <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">FitFlow</span>
              </span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                PRO
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* MANDATORY BUTTON LABELED EXACTLY "Built for Digital Heroes" */}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 border border-red-500/30 transition-all duration-300 hover:text-white hover:bg-red-600 dark:hover:text-white dark:hover:bg-red-600 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] bg-transparent"
            >
              Built for Digital Heroes
            </a>

            {/* LIGHT / DARK MODE TOGGLE */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700/50 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-700 dark:text-gray-200">{user.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-gray-400">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-500/10 dark:bg-gray-800/80 dark:hover:bg-red-500/10 text-slate-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 border border-slate-200 dark:border-gray-700/50 transition-colors"
                  title="Logout"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("login")}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 transition-all"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* DEVELOPER PROFILE DETAILS (Mandatory Visibility) */}
        <div className="mb-6 p-3 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-gray-400 border border-slate-200/50 dark:border-gray-800/80 shadow-md">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span><strong>Engineer:</strong> Guruprakash S</span>
            <span className="text-slate-300 dark:text-gray-700">|</span>
            <span><strong>Email:</strong> <a href="mailto:guruprakash6999@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">guruprakash6999@gmail.com</a></span>
          </div>
          <div className="mt-2 sm:mt-0 text-center sm:text-right font-medium">
            Database: {isGuest ? <span className="text-yellow-600 dark:text-yellow-500">Local (Guest Mode)</span> : token ? <span className="text-green-600 dark:text-green-400">Connected to Neon Postgres</span> : <span className="text-slate-400 dark:text-gray-500">Unauthenticated</span>}
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-gray-900/80 backdrop-blur border border-slate-200 dark:border-gray-800 rounded-2xl mb-8 overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { id: "calculator", label: "Macro Calc", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
            { id: "workout-generator", label: "Workout Gen", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
            { id: "active-workout", label: "Workout Mode", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { id: "history", label: "Workout Logs", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap border ${
                activeTab === tab.id
                  ? "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/30 shadow-md"
                  : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-200/50 dark:hover:bg-gray-800/40 border-transparent"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
              </svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: AUTHENTICATION */}
        {activeTab === "login" && (
          <div className="max-w-md mx-auto">
            <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white mb-2">
                  {authMode === "login" ? "Welcome Back" : "Join FitFlow"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  {authMode === "login" ? "Sign in to synchronize workouts on Neon Postgres" : "Create an account to keep your fitness dashboard up to date"}
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 font-medium text-center">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-700 dark:text-green-400 font-medium text-center animate-bounce">
                  {authSuccess}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Guruprakash S"
                      className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="guruprakash6999@gmail.com"
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span>{authMode === "login" ? "Sign In" : "Sign Up"}</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <button
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  {authMode === "login" ? "Don't have an account? Sign Up" : "Already registered? Login"}
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-gray-800"></div>
                  <span className="flex-shrink mx-4 text-slate-400 dark:text-gray-500 text-xs font-semibold">or</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-gray-800"></div>
                </div>

                <button
                  onClick={handleContinueAsGuest}
                  className="w-full py-2.5 px-4 bg-slate-200/60 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-slate-300/50 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Continue as Guest (Try Offline)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* HERO MOTIVATION CARD */}
            <div className="relative glass-panel rounded-3xl p-6 md:p-8 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-tr from-red-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none mb-3">
                    Hi, {user ? user.name : "Athlete"}!
                  </h1>
                  <p className="text-slate-500 dark:text-gray-400 text-sm max-w-lg mb-4">
                    "{currentQuote}"
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab("workout-generator")}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                    >
                      Generate New Routine
                    </button>
                    {!user && (
                      <button
                        onClick={() => setActiveTab("login")}
                        className="px-4 py-2 bg-slate-200/80 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 text-xs font-bold rounded-xl border border-slate-300/50 dark:border-gray-700 transition-all"
                      >
                        Enable Cloud Storage
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-auto flex flex-col items-center justify-center p-4 bg-slate-100/50 dark:bg-gray-950/40 rounded-2xl border border-slate-200 dark:border-gray-800/80 max-w-[240px] mx-auto md:mx-0">
                  <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1">DAILY TARGET</span>
                  <span className="text-4xl font-black text-red-600 dark:text-red-400">
                    {localStorage.getItem("fitflow_profile") 
                      ? JSON.parse(localStorage.getItem("fitflow_profile")).targetCal 
                      : "2,000"
                    }
                  </span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 mt-1">kcal (Macros setup below)</span>
                </div>
              </div>
            </div>

            {/* ANALYTICS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Workouts Completed", val: apiStats.total_workouts, desc: "Total sessions logged", color: "from-red-500 to-red-700" },
                { label: "Total Volume", val: `${apiStats.total_volume} kg`, desc: "Accumulated weight", color: "from-blue-500 to-blue-700" },
                { label: "Top Exercise", val: apiStats.popular_exercise, desc: "Most logged movement", color: "from-purple-500 to-purple-700" },
                { label: "Workout Streak", val: `${apiStats.streak} Days`, desc: "Consecutive log days", color: "from-orange-500 to-yellow-500" }
              ].map((stat, i) => (
                <div key={i} className="glass-panel rounded-2xl p-5 shadow-md flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  <div className="my-3">
                    <span className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.val}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs text-slate-500 dark:text-gray-400 font-medium">{stat.desc}</span>
                </div>
              ))}
            </div>

            {/* WATER TRACKER & WEIGHT GRAPH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* WATER TARGET CARD */}
              <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Hydro Hydration Tracker
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">
                    Track your daily fluid intake. Your goal is 3,000ml (3.0L) of water.
                  </p>
                </div>

                <div className="flex flex-col items-center my-4 space-y-4">
                  {/* GLASS VISUAL */}
                  <div className="relative w-28 h-40 border-4 border-slate-300 dark:border-gray-700/80 rounded-b-2xl rounded-t-lg overflow-hidden bg-slate-100/80 dark:bg-gray-950/60 shadow-inner">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-500 transition-all duration-700 ease-out flex items-center justify-center"
                      style={{ height: `${Math.min(100, (waterIntake / 3000) * 100)}%` }}
                    >
                      <div className="w-full h-2 bg-white/20 absolute top-0 blur-xs"></div>
                      {waterIntake > 0 && (
                        <span className="text-[10px] font-extrabold text-white tracking-wider">
                          {Math.round((waterIntake / 3000) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{waterIntake}</span>
                    <span className="text-slate-400 dark:text-gray-400 text-sm font-semibold"> / 3,000 ml</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => changeWater(-250)}
                    className="py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-500/10 active:scale-95 transition-all"
                  >
                    - 250ml
                  </button>
                  <button
                    onClick={() => changeWater(250)}
                    className="py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-md shadow-blue-500/10 transition-all"
                  >
                    + 250ml
                  </button>
                </div>
              </div>

              {/* WEIGHT LOGGER & GRAPH */}
              <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Weight Progress Analysis
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">
                    Monitor body weight fluctuations over the last 7 entries.
                  </p>
                </div>

                <div className="bg-slate-100/50 dark:bg-gray-950/40 border border-slate-200 dark:border-gray-900 rounded-2xl p-3 h-40 flex items-center justify-center relative overflow-hidden">
                  {weightLogs.length > 1 ? (
                    <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                      <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" className="text-slate-200 dark:text-gray-800" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="currentColor" className="text-slate-200 dark:text-gray-800" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" className="text-slate-200 dark:text-gray-800" strokeWidth="0.5" strokeDasharray="3" />

                      {(() => {
                        const weights = weightLogs.map((log) => log.weight);
                        const min = Math.min(...weights) - 1;
                        const max = Math.max(...weights) + 1;
                        const range = max - min || 1;

                        const points = weightLogs.map((log, index) => {
                          const x = (index / (weightLogs.length - 1)) * 260 + 20;
                          const y = 100 - ((log.weight - min) / range) * 80;
                          return { x, y, weight: log.weight, date: log.date };
                        });

                        const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

                        return (
                          <>
                            <polyline
                              fill="none"
                              stroke="url(#chartGrad)"
                              strokeWidth="2.5"
                              points={polylinePoints}
                              className="transition-all duration-500"
                            />
                            {points.map((p, idx) => (
                              <g key={idx}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="4"
                                  fill="#dc2626"
                                  className="cursor-pointer hover:r-6 transition-all"
                                />
                                <text
                                  x={p.x}
                                  y={p.y - 8}
                                  className="fill-slate-700 dark:fill-gray-200"
                                  fontSize="7"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {p.weight}kg
                                </text>
                                <text
                                  x={p.x}
                                  y="115"
                                  className="fill-slate-400 dark:fill-gray-600"
                                  fontSize="6"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {p.date}
                                </text>
                              </g>
                            ))}
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#dc2626" />
                                <stop offset="100%" stopColor="#2563eb" />
                              </linearGradient>
                            </defs>
                          </>
                        );
                      })()}
                    </svg>
                  ) : (
                    <span className="text-xs text-slate-400">Record at least 2 weights to plot progress</span>
                  )}
                </div>

                <form onSubmit={handleAddWeightLog} className="flex gap-2 mt-4">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newLogWeight}
                    onChange={(e) => setNewLogWeight(e.target.value)}
                    placeholder="Log Weight (kg)"
                    className="flex-grow bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white active:scale-95 transition-all"
                  >
                    Save Log
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HEALTH CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* INPUTS CARD */}
            <div className="lg:col-span-1 glass-panel rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">TDEE & Macro Calculator</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">
                Calculate total daily energy expenditure and macronutrient requirements.
              </p>

              <form onSubmit={handleCalculateTDEE} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Age (Years)</label>
                    <input
                      type="number"
                      required
                      value={calcAge}
                      onChange={(e) => setCalcAge(parseInt(e.target.value))}
                      className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Gender</label>
                    <select
                      value={calcGender}
                      onChange={(e) => setCalcGender(e.target.value)}
                      className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      required
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(parseInt(e.target.value))}
                      className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Height (cm)</label>
                    <input
                      type="number"
                      required
                      value={calcHeight}
                      onChange={(e) => setCalcHeight(parseInt(e.target.value))}
                      className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Activity Level</label>
                  <select
                    value={calcActivity}
                    onChange={(e) => setCalcActivity(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="1.2">Sedentary (Little/No Exercise)</option>
                    <option value="1.375">Lightly Active (1-3 Days/Wk)</option>
                    <option value="1.55">Moderately Active (3-5 Days/Wk)</option>
                    <option value="1.725">Very Active (6-7 Days/Wk)</option>
                    <option value="1.9">Super Active (Hard Physical Job)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Fitness Goal</label>
                  <select
                    value={calcGoal}
                    onChange={(e) => setCalcGoal(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="lose">Fat Loss (Deficit -500kcal)</option>
                    <option value="maintain">Maintain Current Weight</option>
                    <option value="gain">Build Muscle (Surplus +300kcal)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg active:scale-98 transition-all text-sm uppercase tracking-wider"
                >
                  Calculate Now
                </button>
              </form>
            </div>

            {/* RESULTS VIEW */}
            <div className="lg:col-span-2 space-y-6">
              {calcResult ? (
                <div className="glass-panel rounded-3xl p-6 shadow-xl space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Caloric & Macro Targets</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-100/50 dark:bg-gray-950/40 border border-slate-200 dark:border-gray-900 rounded-2xl text-center">
                      <div className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase">BMI Score</div>
                      <div className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{calcResult.bmi}</div>
                      <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold mt-1">{calcResult.bmiCategory}</div>
                    </div>
                    <div className="p-4 bg-slate-100/50 dark:bg-gray-950/40 border border-slate-200 dark:border-gray-900 rounded-2xl text-center">
                      <div className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase">Basal Metabolic Rate</div>
                      <div className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{calcResult.bmr}</div>
                      <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-1">kcal (BMR)</div>
                    </div>
                    <div className="p-4 bg-slate-100/50 dark:bg-gray-950/40 border border-slate-200 dark:border-gray-900 rounded-2xl text-center">
                      <div className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase">Maintenance</div>
                      <div className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">{calcResult.tdee}</div>
                      <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-1">kcal (TDEE)</div>
                    </div>
                    <div className="p-4 bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 rounded-2xl text-center">
                      <div className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Daily Calorie Goal</div>
                      <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{calcResult.targetCal}</div>
                      <div className="text-[10px] text-red-500 dark:text-red-400/80 mt-1">kcal / Day</div>
                    </div>
                  </div>

                  {/* MACROS CARD */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Macronutrient Targets</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* PROTEIN */}
                      <div className="p-4 bg-slate-100/50 dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Protein</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400">{calcResult.pPct}% ({calcResult.proteinGrams * 4} kcal)</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white">{calcResult.proteinGrams}g</div>
                        <div className="w-full bg-slate-200 dark:bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-red-600 h-full rounded-full" style={{ width: `${calcResult.pPct}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-gray-500 mt-1 block">Crucial for muscle recovery & repair</span>
                      </div>

                      {/* CARBS */}
                      <div className="p-4 bg-slate-100/50 dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Carbohydrates</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400">{calcResult.cPct}% ({calcResult.carbsGrams * 4} kcal)</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white">{calcResult.carbsGrams}g</div>
                        <div className="w-full bg-slate-200 dark:bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${calcResult.cPct}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-gray-500 mt-1 block">Primary energy source for workouts</span>
                      </div>

                      {/* FATS */}
                      <div className="p-4 bg-slate-100/50 dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Fats</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400">{calcResult.fPct}% ({calcResult.fatGrams * 9} kcal)</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white">{calcResult.fatGrams}g</div>
                        <div className="w-full bg-slate-200 dark:bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-purple-600 h-full rounded-full" style={{ width: `${calcResult.fPct}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-gray-500 mt-1 block">Supports healthy hormone production</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 text-xs text-blue-700 dark:text-blue-400 flex items-start space-x-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      <strong>Recommendation:</strong> Drink at least 3,000ml (3.0L) of water daily when following this diet. You can track this on the Dashboard water visualizer!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="glass-panel rounded-3xl p-10 text-center text-slate-400 dark:text-gray-500 h-full flex flex-col justify-center items-center">
                  <svg className="w-16 h-16 text-slate-300 dark:text-gray-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Calculation Yet</h3>
                  <p className="text-xs max-w-sm">
                    Fill in your demographic details and activity levels on the left panel to output tailored daily calorie and protein breakdowns.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: WORKOUT GENERATOR */}
        {activeTab === "workout-generator" && (
          <div className="space-y-8 animate-fadeIn">
            {/* INPUT PANEL */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Smart Routine Builder</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">
                Auto-generate structured training routines matching your resources and goals.
              </p>

              <form onSubmit={handleGenerateRoutine} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Target Goal</label>
                  <select
                    value={genGoal}
                    onChange={(e) => setGenGoal(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="hypertrophy">Muscle Gain (Hypertrophy)</option>
                    <option value="strength">Raw Power (Strength)</option>
                    <option value="endurance">Stamina & Cardio (Endurance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Available Equipment</label>
                  <select
                    value={genEquipment}
                    onChange={(e) => setGenEquipment(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="gym">Full Gym Equipment</option>
                    <option value="dumbbells">Dumbbells Only</option>
                    <option value="bodyweight">Bodyweight/No Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Frequency (Days / Wk)</label>
                  <select
                    value={genDays}
                    onChange={(e) => setGenDays(parseInt(e.target.value))}
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    <option value={3}>3 Days Split</option>
                    <option value={4}>4 Days Split</option>
                    <option value={5}>5 Days Split</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg active:scale-98 transition-all text-sm uppercase tracking-wider"
                >
                  Build Routine
                </button>
              </form>
            </div>

            {/* GENERATED SPLITS */}
            {generatedRoutine ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Generated Split</h3>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold px-3 py-1 rounded bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm">
                    {genDays} Days split / {genEquipment} Equipment / {genGoal} Goal
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedRoutine.map((routineDay, idx) => (
                    <div key={idx} className="glass-panel rounded-2xl border border-slate-200 dark:border-gray-800 p-5 shadow-md flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-gray-800 pb-2">
                          {routineDay.day}
                        </h4>

                        <div className="space-y-3">
                          {routineDay.exercises.map((ex, exIdx) => (
                            <div key={exIdx} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 dark:bg-gray-950/30 rounded-xl border border-slate-200/50 dark:border-gray-900">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-gray-200 block">{ex.name}</span>
                                <span className="text-[10px] text-slate-400 dark:text-gray-500">{ex.target}</span>
                              </div>
                              <div className="text-right text-slate-500 dark:text-gray-400 font-semibold">
                                {ex.defaultSets} × {ex.defaultReps}
                                {ex.weight > 0 && <span className="text-[10px] text-red-600 dark:text-red-400 block">{ex.weight}kg</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => startRoutineSession(routineDay.day, routineDay.exercises)}
                        className="w-full mt-6 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white hover:scale-101 active:scale-98 transition-all"
                      >
                        Start Workout Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-16 text-center text-slate-400 dark:text-gray-500 flex flex-col items-center">
                <svg className="w-16 h-16 text-slate-300 dark:text-gray-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Routine Generated</h3>
                <p className="text-xs max-w-sm">
                  Select your target objectives, equipment limitations, and workout days to customize and generate a personal training regimen.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ACTIVE WORKOUT */}
        {activeTab === "active-workout" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {activeWorkoutList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* ACTIVE CARD */}
                <div className="md:col-span-2 glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest block mb-2">
                      Exercise {activeExerciseIndex + 1} of {activeWorkoutList.length}
                    </span>

                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                      {activeWorkoutList[activeExerciseIndex].name}
                    </h2>
                    <span className="text-xs bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 px-3 py-1 rounded-full inline-block mb-6">
                      Target: {activeWorkoutList[activeExerciseIndex].target}
                    </span>

                    {/* SET LIST */}
                    <div className="space-y-3">
                      {Array.from({ length: activeWorkoutList[activeExerciseIndex].defaultSets }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            idx < (activeSetsCompleted[activeExerciseIndex] || 0)
                              ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                              : "bg-slate-50 dark:bg-gray-950/40 border-slate-200 dark:border-gray-900 text-slate-400 dark:text-gray-500"
                          }`}
                        >
                          <span className="text-xs font-bold">Set {idx + 1}</span>
                          <span className="text-xs font-semibold">
                            {activeWorkoutList[activeExerciseIndex].defaultReps} Reps 
                            {activeWorkoutList[activeExerciseIndex].weight > 0 && ` @ ${activeWorkoutList[activeExerciseIndex].weight} kg`}
                          </span>
                          {idx < (activeSetsCompleted[activeExerciseIndex] || 0) ? (
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-gray-850"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => incrementSetCompleted(activeExerciseIndex)}
                        disabled={(activeSetsCompleted[activeExerciseIndex] || 0) >= activeWorkoutList[activeExerciseIndex].defaultSets}
                        className="py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 dark:disabled:bg-gray-800 text-white disabled:text-slate-400 dark:disabled:text-gray-500 font-bold rounded-xl active:scale-95 transition-all text-xs uppercase"
                      >
                        Complete Set
                      </button>
                      <button
                        onClick={() => logActiveExerciseToDatabase(activeExerciseIndex)}
                        className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:border-red-500/20 dark:hover:border-red-500/20 text-red-600 dark:text-red-400 font-bold rounded-xl active:scale-95 transition-all text-xs uppercase"
                      >
                        Log to Database
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-gray-800">
                      <button
                        onClick={() => setActiveExerciseIndex(Math.max(0, activeExerciseIndex - 1))}
                        disabled={activeExerciseIndex === 0}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 disabled:opacity-40"
                      >
                        Prev Exercise
                      </button>
                      <button
                        onClick={() => setActiveExerciseIndex(Math.min(activeWorkoutList.length - 1, activeExerciseIndex + 1))}
                        disabled={activeExerciseIndex === activeWorkoutList.length - 1}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 disabled:opacity-40"
                      >
                        Next Exercise
                      </button>
                    </div>
                  </div>
                </div>

                {/* REST TIMER CARD */}
                <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between items-center text-center">
                  <div>
                    <h3 className="text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-4">REST TIMER</h3>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 max-w-[180px] mx-auto">
                      Rest interval counts down after completed sets. Live sound feedback synthesized locally.
                    </p>
                  </div>

                  <div className="relative my-6 w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="currentColor" className="text-slate-200 dark:text-gray-850" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#dc2626"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={
                          timerIsActive
                            ? (2 * Math.PI * 42) * (1 - timerSecondsLeft / timerDuration)
                            : 0
                        }
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-black text-slate-800 dark:text-white">
                        {timerSecondsLeft > 0 ? timerSecondsLeft : timerDuration}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-500 font-bold block">SECONDS</span>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">Timer Interval:</span>
                      <select
                        value={timerDuration}
                        onChange={(e) => setTimerDuration(parseInt(e.target.value))}
                        className="bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-xs text-red-600 dark:text-red-400 font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-red-500"
                      >
                        <option value={30}>30s</option>
                        <option value={45}>45s</option>
                        <option value={60}>60s</option>
                        <option value={90}>90s</option>
                        <option value={120}>120s</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (timerIsActive) setTimerIsActive(false);
                          else {
                            if (timerSecondsLeft === 0) setTimerSecondsLeft(timerDuration);
                            setTimerIsActive(true);
                          }
                        }}
                        className={`flex-grow py-2 rounded-xl text-xs font-bold border transition-all ${
                          timerIsActive
                            ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {timerIsActive ? "Pause" : "Start"}
                      </button>
                      <button
                        onClick={() => {
                          setTimerIsActive(false);
                          setTimerSecondsLeft(0);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-850 rounded-xl text-xs"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-16 text-center text-slate-400 dark:text-gray-500 flex flex-col items-center">
                <svg className="w-16 h-16 text-slate-300 dark:text-gray-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Active Session</h3>
                <p className="text-xs max-w-sm mb-6">
                  Before tracking active sets and rest timers, go to the Workout Generator tab to build a customized training routine, then select "Start Session".
                </p>
                <button
                  onClick={() => setActiveTab("workout-generator")}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Generate Workouts Split
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: WORKOUT LOGS */}
        {activeTab === "history" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* MANUAL LOG */}
            <div className="lg:col-span-1 glass-panel rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Manual Workout Logger</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">
                Directly add an exercise log to your personal history.
              </p>

              <form onSubmit={handleManualWorkoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Exercise Name</label>
                  <input
                    type="text"
                    required
                    value={workoutLogForm.exercise_name}
                    onChange={(e) => setWorkoutLogForm({ ...workoutLogForm, exercise_name: e.target.value })}
                    placeholder="Barbell Bench Press"
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Sets</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={workoutLogForm.sets}
                      onChange={(e) => setWorkoutLogForm({ ...workoutLogForm, sets: e.target.value })}
                      className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Reps</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={workoutLogForm.reps}
                      onChange={(e) => setWorkoutLogForm({ ...workoutLogForm, reps: e.target.value })}
                      className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Wt (kg)</label>
                    <input
                      type="number"
                      required
                      step="0.5"
                      value={workoutLogForm.weight}
                      onChange={(e) => setWorkoutLogForm({ ...workoutLogForm, weight: e.target.value })}
                      className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={workoutLogForm.date}
                    onChange={(e) => setWorkoutLogForm({ ...workoutLogForm, date: e.target.value })}
                    className="w-full bg-slate-100/50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg active:scale-98 transition-all text-sm uppercase tracking-wider"
                >
                  Log Workout
                </button>
              </form>
            </div>

            {/* PREVIOUS LOGS */}
            <div className="lg:col-span-2 glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Logged Exercises History</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">
                  Timeline record of all physical workouts completed on this profile.
                </p>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {workoutLogs.length > 0 ? (
                    workoutLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex justify-between items-center p-4 rounded-2xl bg-slate-100/50 dark:bg-gray-950/40 border border-slate-200/50 dark:border-gray-900 hover:border-red-500/10 transition-colors"
                      >
                        <div>
                          <span className="font-extrabold text-sm text-slate-800 dark:text-white block">{log.exercise_name}</span>
                          <div className="flex space-x-2 text-[10px] text-slate-400 dark:text-gray-550 font-semibold mt-1">
                            <span>{log.date}</span>
                            <span>•</span>
                            <span>{log.sets} sets × {log.reps} reps</span>
                            {log.weight > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-red-600 dark:text-red-450">{log.weight} kg</span>
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteWorkout(log.id)}
                          className="p-2 bg-slate-200/50 hover:bg-red-500/10 dark:bg-gray-900 dark:hover:bg-red-500/10 border border-slate-300/50 dark:border-gray-800 rounded-xl text-slate-500 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                          title="Delete Log"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 dark:text-gray-500 text-xs">
                      No logs logged yet. Generate a workout or log manually!
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-gray-800/80 text-[10px] text-slate-400 dark:text-gray-500 flex justify-between">
                <span>Stored under user session</span>
                <span>FitFlow Engine v1.0</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full py-8 border-t border-slate-200 dark:border-gray-900 bg-slate-100 dark:bg-[#05080e] text-center text-xs text-slate-500 dark:text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center space-x-6">
            <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 dark:hover:text-red-400 font-semibold transition-colors">
              Digital Heroes
            </a>
            <span>•</span>
            <a href="mailto:guruprakash6999@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
              guruprakash6999@gmail.com
            </a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} FitFlow. Designed & Engineered by <span className="text-red-600 dark:text-red-400 font-bold">Guruprakash S</span>.
          </div>
          <div className="text-[10px] text-slate-400 dark:text-gray-600 font-medium">
            This trial application is built and distributed 100% free under license instructions.
          </div>
        </div>
      </footer>
    </div>
  );
}
