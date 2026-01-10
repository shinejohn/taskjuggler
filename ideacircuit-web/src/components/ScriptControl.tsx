import React, { useState, useEffect } from 'react';
import { PlayCircle, PauseCircle, StopCircle, Download, ChevronRight } from 'lucide-react';
import api from '../services/api';

interface Script {
  id: string;
  name: string;
  description: string;
  script_type: string;
  questions: any[];
}

interface ScriptProgress {
  currentQuestion: number;
  totalQuestions: number;
  currentQuestionText: string;
  answers: Record<string, any>;
  state: string;
}

interface ScriptControlProps {
  meetingId: string;
  userId: string;
  canEnableAI: boolean;
}

export const ScriptControl: React.FC<ScriptControlProps> = ({ meetingId, userId, canEnableAI }) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<ScriptProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScripts();
  }, []);

  useEffect(() => {
    if (isRunning) {
      // Poll for progress updates
      const interval = setInterval(async () => {
        try {
          const response = await api.get(`/meetings/${meetingId}/scripts/progress`);
          if (response.data.active) {
            setProgress(response.data.progress);
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning, meetingId]);

  const loadScripts = async () => {
    try {
      const response = await api.get('/scripts/templates');
      setScripts(response.data);
    } catch (error) {
      console.error('Failed to load scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const startScript = async () => {
    if (!selectedScript) return;

    try {
      await api.post(`/meetings/${meetingId}/scripts/start`, {
        script_id: selectedScript,
        user_id: userId
      });
      setIsRunning(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to start script:', error);
      alert('Failed to start script. Ensure AI participant is in the meeting.');
    }
  };

  const pauseScript = async () => {
    try {
      await api.post(`/meetings/${meetingId}/scripts/pause`, {});
      setIsPaused(true);
    } catch (error) {
      console.error('Failed to pause script:', error);
    }
  };

  const resumeScript = async () => {
    try {
      await api.post(`/meetings/${meetingId}/scripts/resume`, {});
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to resume script:', error);
    }
  };

  const stopScript = async () => {
    try {
      const response = await api.post(`/meetings/${meetingId}/scripts/stop`, {});
      setIsRunning(false);
      setIsPaused(false);
      setProgress(null);
      
      if (response.data.summary) {
        alert('Script completed! Check the notes for insights.');
      }
    } catch (error) {
      console.error('Failed to stop script:', error);
    }
  };

  const exportAnswers = () => {
    if (!progress) return;

    const content = JSON.stringify(progress.answers, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-answers-${meetingId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!canEnableAI) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 m-4">
        <h3 className="text-white font-semibold mb-2">AI Script Control</h3>
        <div className="bg-yellow-900/30 border border-yellow-600 rounded p-3">
          <p className="text-yellow-400 text-sm">
            AI Scripts are only available to Tier 1 (Fae Creator) users.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 m-4">
        <p className="text-gray-400">Loading scripts...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 m-4">
      <h3 className="text-white font-semibold mb-4">AI Script Control</h3>

      {/* Script Selection */}
      {!isRunning && (
        <div className="mb-4">
          <select
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedScript}
            onChange={(e) => setSelectedScript(e.target.value)}
          >
            <option value="">Select a script...</option>
            {scripts.map((script) => (
              <option key={script.id} value={script.id}>
                {script.name} ({script.questions.length} questions)
              </option>
            ))}
          </select>

          {selectedScript && (
            <p className="text-gray-400 text-sm mt-2">
              {scripts.find((s) => s.id === selectedScript)?.description}
            </p>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-2 mb-4">
        {!isRunning ? (
          <button
            onClick={startScript}
            disabled={!selectedScript}
            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle size={20} />
            <span>Start Script</span>
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={pauseScript}
                className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                <PauseCircle size={20} />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={resumeScript}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <PlayCircle size={20} />
                <span>Resume</span>
              </button>
            )}
            <button
              onClick={stopScript}
              className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <StopCircle size={20} />
              <span>Stop</span>
            </button>
          </>
        )}

        {progress && Object.keys(progress.answers || {}).length > 0 && (
          <button
            onClick={exportAnswers}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
        )}
      </div>

      {/* Progress Display */}
      {isRunning && progress && (
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="relative">
            <div className="bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    progress.totalQuestions > 0
                      ? (progress.currentQuestion / progress.totalQuestions) * 100
                      : 0
                  }%`
                }}
              />
            </div>
            <span className="text-gray-400 text-xs mt-1 block">
              Question {progress.currentQuestion} of {progress.totalQuestions}
            </span>
          </div>

          {/* Current Question */}
          {progress.currentQuestionText && (
            <div className="bg-gray-700 rounded p-3">
              <div className="flex items-start">
                <ChevronRight size={16} className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
                <p className="text-white text-sm">{progress.currentQuestionText}</p>
              </div>
            </div>
          )}

          {/* Recent Answers */}
          {progress.answers && Object.keys(progress.answers).length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-2">
              <p className="text-gray-400 text-xs mb-2">Recent Answers:</p>
              {Object.entries(progress.answers).slice(-3).map(([questionId, answer]: [string, any]) => (
                <div key={questionId} className="bg-gray-700 rounded p-2">
                  <p className="text-gray-400 text-xs">Q: {answer.question}</p>
                  <p className="text-white text-sm mt-1">A: {answer.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptControl;
