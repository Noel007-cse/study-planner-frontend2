import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSun, FiMoon, FiPlay, FiPause, FiRotateCcw, FiPlus, FiTrash2, FiArrowLeft, FiArrowRight, FiSave, FiClock, FiBook, FiBookmark, FiCheck, FiAlertCircle } from "react-icons/fi";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import "./SmartPlanner.css";

// Progress Tracker Component
function ProgressTracker({ completedTopics, totalTopics }) {
  const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  
  return (
    <div className="glass-card progress-container">
      <h3>Study Progress</h3>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <span className="progress-text">
        {completedTopics}/{totalTopics} topics ({progressPercentage}%)
      </span>
    </div>
  );
}

// Pomodoro Timer Component
function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedTime, setSelectedTime] = useState(25);

  const presetTimes = [15, 25, 30, 45, 60];

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            new Audio('/notification.mp3').play().catch(e => console.log("Audio error:", e));
            setSessionCount(prev => prev + 1);
            setMinutes(5); // Short break
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(selectedTime);
    setSeconds(0);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (!isActive) {
      setMinutes(time);
      setSeconds(0);
    }
  };

  return (
    <div className={`glass-card pomodoro-timer ${isActive ? 'active' : ''}`}>
      <h3>Focus Timer</h3>
      <div className="timer-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="time-presets">
        {presetTimes.map(time => (
          <button
            key={time}
            className={`time-preset ${selectedTime === time ? 'active' : ''}`}
            onClick={() => handleTimeChange(time)}
          >
            {time} min
          </button>
        ))}
      </div>
      <div className="timer-controls">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`timer-button ${isActive ? 'pause' : 'start'}`}
        >
          {isActive ? <><FiPause /> Pause</> : <><FiPlay /> Start</>}
        </button>
        <button 
          onClick={resetTimer}
          className="timer-button reset"
        >
          <FiRotateCcw /> Reset
        </button>
      </div>
      <div className="session-counter">
        Sessions completed: {sessionCount}
      </div>
    </div>
  );
}

// Resource Library Component
function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', url: '', category: '' });

  const addResource = (e) => {
    e.preventDefault();
    if (newResource.title && newResource.url) {
      setResources([...resources, {
        ...newResource,
        id: Date.now()
      }]);
      setNewResource({ title: '', url: '', category: '' });
    }
  };

  return (
    <div className="glass-card resource-library">
      <h3><FiBookmark /> Study Resources</h3>
      <form onSubmit={addResource} className="resource-form">
        <input
          type="text"
          placeholder="Resource title"
          value={newResource.title}
          onChange={(e) => setNewResource({...newResource, title: e.target.value})}
          required
          className="input-field"
        />
        <input
          type="url"
          placeholder="URL"
          value={newResource.url}
          onChange={(e) => setNewResource({...newResource, url: e.target.value})}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Category"
          value={newResource.category}
          onChange={(e) => setNewResource({...newResource, category: e.target.value})}
          required
          className="input-field"
        />
        <button type="submit" className="add-button"><FiPlus /> Add Resource</button>
      </form>
      <div className="resource-list">
        {resources.map((resource, index) => (
          <div key={resource.id} className="resource-item" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="resource-category">{resource.category}</div>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="resource-link"
            >
              {resource.title}
            </a>
            <button 
              onClick={() => setResources(resources.filter(r => r.id !== resource.id))}
              className="delete-button"
              aria-label="Delete resource"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// FlashCards Component
function FlashCards() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ question: '', answer: '' });

  const addCard = (e) => {
    e.preventDefault();
    if (newCard.question && newCard.answer) {
      setCards([...cards, {
        ...newCard,
        id: Date.now()
      }]);
      setNewCard({ question: '', answer: '' });
    }
  };

  const removeCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
    if (currentIndex >= cards.length - 1) {
      setCurrentIndex(Math.max(0, cards.length - 2));
    }
  };

  return (
    <div className="glass-card flashcards-container">
      <h3>Study Flashcards</h3>
      <div className="flashcard-wrapper">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flashcard-front">
            {cards[currentIndex]?.question || "No cards available"}
          </div>
          <div className="flashcard-back">
            {cards[currentIndex]?.answer || "Add cards to get started"}
          </div>
        </div>
      </div>
      <div className="flashcard-controls">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(prev => (prev > 0 ? prev - 1 : cards.length - 1));
            setIsFlipped(false);
          }}
          disabled={cards.length === 0}
          className="flashcard-nav-button"
        >
          <FiArrowLeft /> Previous
        </button>
        <span className="card-counter">
          {cards.length > 0 ? `${currentIndex + 1}/${cards.length}` : "0/0"}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(prev => (prev < cards.length - 1 ? prev + 1 : 0));
            setIsFlipped(false);
          }}
          disabled={cards.length === 0}
          className="flashcard-nav-button"
        >
          Next <FiArrowRight />
        </button>
      </div>
      {cards.length > 0 && (
        <button 
          onClick={() => removeCard(cards[currentIndex].id)}
          className="delete-flashcard"
          aria-label="Delete flashcard"
        >
          <FiTrash2 /> Remove Flashcard
        </button>
      )}
      <form onSubmit={addCard} className="add-card-form">
        <input
          type="text"
          placeholder="Question"
          value={newCard.question}
          onChange={(e) => setNewCard({...newCard, question: e.target.value})}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Answer"
          value={newCard.answer}
          onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
          required
          className="input-field"
        />
        <button type="submit" className="add-flashcard-button"><FiPlus /> Add Flashcard</button>
      </form>
    </div>
  );
}

// Achievement Badges Component
function AchievementBadges() {
  const [achievements, setAchievements] = useState([
    { id: 1, name: "Starter", emoji: "🏁", description: "Created your first study plan", earned: true },
    { id: 2, name: "Scholar", emoji: "🎓", description: "Completed 5 topics", earned: false },
    { id: 3, name: "Marathon", emoji: "🏃", description: "Studied for 10 hours", earned: false },
    { id: 4, name: "Perfectionist", emoji: "✨", description: "Mastered all topics", earned: false }
  ]);

  return (
    <div className="glass-card badges-container">
      <h3>Your Achievements</h3>
      <div className="badges-grid">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`badge ${achievement.earned ? 'earned' : ''}`}
            title={achievement.description}
          >
            <div className="badge-icon">{achievement.emoji}</div>
            <div className="badge-name">{achievement.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dark Mode Toggle Component
function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  return (
    <button 
      className="dark-mode-toggle"
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <><FiSun /> Light Mode</> : <><FiMoon /> Dark Mode</>}
    </button>
  );
}

// Main SmartPlanner Component
export default function SmartPlanner() {
  const [input, setInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [availableTime, setAvailableTime] = useState("");
  const [timetable, setTimetable] = useState("");
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch quote on component mount
  useEffect(() => {
    fetchQuote();
    const history = localStorage.getItem('analysisHistory');
    if (history) setAnalysisHistory(JSON.parse(history));
  }, []);

  const fetchQuote = async () => {
    setIsLoadingQuote(true);
    try {
      const response = await axios.get("https://dummyjson.com/quotes/random");
      setQuote({
        text: response.data.quote,
        author: response.data.author
      });
    } catch (err) {
      console.error("Failed to fetch quote:", err);
      setQuote({
        text: "The expert in anything was once a beginner.",
        author: "Helen Hayes"
      });
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError("Please enter syllabus topics.");
      return;
    }
    setError("");
    setIsAnalyzing(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post("https://study-planner-backend-prss.onrender.com/api/analyze", {
        syllabus: input,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const newAnalysis = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        topics: response.data
      };
      
      setTopics(response.data);
      setAnalysisHistory(prev => {
        const updated = [newAnalysis, ...prev.slice(0, 9)]; // Keep last 10 analyses
        localStorage.setItem('analysisHistory', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Analyze Error:", err);
      setError(err.response?.data?.message || "Failed to analyze topics.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateTimetable = async () => {
    if (!topics.length) {
      setError("Please analyze topics first.");
      return;
    }
    if (!availableTime || isNaN(availableTime)) {
      setError("Please enter a valid number of hours.");
      return;
    }
    setError("");
    setIsGenerating(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "https://study-planner-backend-prss.onrender.com/api/timetable/generate", 
        {
          availableTime: parseInt(availableTime),
          topics
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const formattedTimetable = formatTimetable(response.data.timetable);
      setTimetable(formattedTimetable);
      
    } catch (err) {
      console.error("Timetable Error:", err);
      setError(err.response?.data?.error || "Failed to generate timetable.");
    } finally {
      setIsGenerating(false);
    }
  };

  const loadAnalysis = (id) => {
    const analysisToLoad = analysisHistory.find(a => a.id === id);
    if (analysisToLoad) {
      setTopics(analysisToLoad.topics);
      setShowHistory(false);
    }
  };

  const formatTimetable = (rawTimetable) => {
    const lines = rawTimetable.split('\n').filter(line => line.trim() !== '');
    let inTable = false;
    let tableRows = [];
    let elements = [];
    
    lines.forEach((line, index) => {
      // Handle tables
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line);
        return;
      } else if (inTable) {
        inTable = false;
        elements.push(renderTable(tableRows, index));
      }

      // Handle headers
      if (line.match(/^(#+\s|🗓️|• \*\*)/) || line.includes('Day') || line.includes('DAY') || line.includes('Study Timetable')) {
        elements.push(
          <div key={`header-${index}`} className="timetable-header">
            <strong>{line.replace(/^[#•\*\s]+/, '')}</strong>
          </div>
        );
        return;
      }

      // Handle bullet points
      if (line.startsWith('•') || line.startsWith('-')) {
        elements.push(
          <div key={`item-${index}`} className="timetable-item">
            {line}
          </div>
        );
        return;
      }

      // Handle regular text
      elements.push(
        <div key={`text-${index}`} className="timetable-text">
          {line}
        </div>
      );
    });

    // Add any remaining table data
    if (inTable) {
      elements.push(renderTable(tableRows, lines.length));
    }

    return elements;
  };

  const renderTable = (rows, key) => {
    const headerRow = rows[0] || '';
    const separatorRow = rows[1] || '';
    const dataRows = rows.slice(2);

    return (
      <div key={`table-${key}`} className="timetable-table-container">
        <table className="timetable-table">
          <thead>
            <tr>
              {headerRow.split('|').slice(1, -1).map((cell, index) => (
                <th key={`th-${index}`}>{cell.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr key={`tr-${rowIndex}`}>
                {row.split('|').slice(1, -1).map((cell, cellIndex) => (
                  <td key={`td-${cellIndex}`}>{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const markTopicComplete = (topicId) => {
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
    ));
    setCompletedTopics(topics.filter(t => t.completed).length);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="title-container">
          <h1 className="app-title">📚 <i>Smart Study Planner</i></h1>
        </div>
        <DarkModeToggle />
      </header>
      
      <div className="main-content">
        <div className="sidebar">
          <ProgressTracker 
            completedTopics={topics.filter(t => t.completed).length} 
            totalTopics={topics.length} 
          />
          <PomodoroTimer />
          <ResourceLibrary />
        </div>
        
        <div className="content-area">
          {/* Quote Section */}
          <div className="glass-card quote-section">
            {isLoadingQuote ? (
              <div className="quote-loading">Loading inspiration...</div>
            ) : (
              <>
                <blockquote className="quote-text">
                  <FaQuoteLeft className="quote-icon left" />
                  {quote.text}
                  <FaQuoteRight className="quote-icon right" />
                </blockquote>
                <cite className="quote-author">— {quote.author}</cite>
                <button 
                  onClick={fetchQuote} 
                  className="new-quote-btn"
                  disabled={isLoadingQuote}
                  aria-label="Get new quote"
                >
                  {isLoadingQuote ? "Loading..." : "New Quote"}
                </button>
              </>
            )}
          </div>

          {/* Input Section */}
          <div className="glass-card input-section">
            <textarea
              rows={5}
              placeholder="Enter your syllabus topics (separated by commas or new lines)..."
              className="syllabus-input input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Syllabus input"
            />
            <div className="input-buttons">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`analyze-btn ${isAnalyzing ? 'processing' : ''}`}
                aria-label="Analyze topics"
              >
                {isAnalyzing ? <><FiClock /> Analyzing...</> : <><FiBook /> Analyze Topics</>}
              </button>
              {analysisHistory.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="history-btn"
                  aria-label="Show analysis history"
                >
                  {showHistory ? "Hide History" : "Show History"}
                </button>
              )}
            </div>
          </div>

          {error && <div className="error-message"><FiAlertCircle /> {error}</div>}

          {showHistory && (
            <div className="glass-card history-section">
              <h2 className="section-title">Analysis History</h2>
              <div className="history-list">
                {analysisHistory.map(item => (
                  <div key={item.id} className="history-item">
                    <div className="history-date">{item.date}</div>
                    <div className="history-topics-count">{item.topics.length} topics</div>
                    <button 
                      onClick={() => loadAnalysis(item.id)}
                      className="load-history-btn"
                    >
                      Load
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topics.length > 0 && !showHistory && (
            <div className="glass-card analysis-section">
              <h2 className="section-title">📊 Analysis Results</h2>
              <div className="topics-grid">
                {topics.map((t, index) => (
                  <div 
                    key={index} 
                    className={`topic-card ${t.difficulty.toLowerCase()} ${t.completed ? 'completed' : ''}`}
                    onClick={() => markTopicComplete(t.id)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="topic-name">
                      {t.topic}
                      {t.completed && <span className="checkmark"><FiCheck /></span>}
                    </div>
                    <div className="topic-difficulty">{t.difficulty}</div>
                    <div className="topic-time">Estimated: {t.estimatedTime} mins</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showHistory && (
            <div className="glass-card generator-section">
              <h2 className="section-title">⏱️ Generate Timetable</h2>
              <div className="time-input-group">
                <input
                  type="number"
                  placeholder="Total available hours"
                  className="time-input input-field"
                  min="1"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  aria-label="Available study hours"
                />
                <button
                  onClick={handleGenerateTimetable}
                  disabled={isGenerating || !topics.length}
                  className={`generate-btn ${isGenerating ? 'pulse' : ''}`}
                  aria-label="Generate timetable"
                >
                  {isGenerating ? "⏳ Generating..." : "✨ Generate Timetable"}
                </button>
              </div>
            </div>
          )}

          {timetable && !showHistory && (
            <div className="glass-card timetable-section">
              <h2 className="section-title">🗓️ Your Study Plan</h2>
              <div className="timetable-output">
                {timetable}
              </div>
            </div>
          )}
        </div>
        
        <div className="right-sidebar">
          <FlashCards />
          <AchievementBadges />
        </div>
      </div>
    </div>
  );
}
