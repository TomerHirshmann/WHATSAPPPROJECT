import { useState } from 'react';
import { Chat } from '@/types';

interface ChatInfoProps {
  chat: Chat;
  onUpdate: (updates: Partial<Chat>) => void;
  onClose: () => void;
}

const STATUS_OPTIONS = ['New', 'In Progress', 'Waiting for Client', 'Closed'];

const LABEL_COLORS = [
  '#00A884',
  '#06CF9C',
  '#53BDEB',
  '#027EB5',
  '#8696A0',
  '#F15C6D',
  '#FFC033',
  '#9B59B6',
];

export default function ChatInfo({ chat, onUpdate, onClose }: ChatInfoProps) {
  const [notes, setNotes] = useState(chat.notes || '');
  const [status, setStatus] = useState(chat.status);
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0]);
  const [showLabelInput, setShowLabelInput] = useState(false);

  const handleSaveNotes = () => {
    onUpdate({ notes });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onUpdate({ status: newStatus });
  };

  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;

    try {
      const response = await fetch(`/api/chats/${chat.id}/labels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLabelName,
          color: selectedColor,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate({
          labels: [...chat.labels, data.label],
        });
        setNewLabelName('');
        setShowLabelInput(false);
      }
    } catch (error) {
      console.error('Failed to add label:', error);
    }
  };

  const handleRemoveLabel = async (labelId: string) => {
    try {
      const response = await fetch(
        `/api/chats/${chat.id}/labels?labelId=${labelId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        onUpdate({
          labels: chat.labels.filter((l) => l.id !== labelId),
        });
      }
    } catch (error) {
      console.error('Failed to remove label:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-wa-panel-header px-4 py-3 flex items-center justify-between border-b border-wa-border">
        <h2 className="text-wa-text font-medium">Chat Info</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-wa-hover rounded-full transition-colors"
        >
          <svg
            className="w-5 h-5 text-wa-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Contact Info */}
        <div className="px-4 py-6 text-center border-b border-wa-border">
          <div className="w-24 h-24 bg-wa-text-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-wa-bg text-3xl font-semibold">
            {(chat.contactName || chat.chatId)[0].toUpperCase()}
          </div>
          <h3 className="text-wa-text text-xl font-medium mb-1">
            {chat.contactName || chat.chatId}
          </h3>
          <p className="text-wa-text-secondary text-sm">{chat.chatId}</p>
        </div>

        {/* Status */}
        <div className="px-4 py-4 border-b border-wa-border">
          <h4 className="text-wa-text text-sm font-medium mb-3">Status</h4>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleStatusChange(option)}
                className={`w-full px-4 py-2 rounded-lg text-left text-sm transition-colors ${
                  status === option
                    ? 'bg-wa-primary text-white'
                    : 'bg-wa-bg text-wa-text hover:bg-wa-hover'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="px-4 py-4 border-b border-wa-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-wa-text text-sm font-medium">Labels</h4>
            <button
              onClick={() => setShowLabelInput(!showLabelInput)}
              className="p-1 hover:bg-wa-hover rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-wa-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Label Input */}
          {showLabelInput && (
            <div className="mb-3 space-y-2">
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Label name"
                className="w-full px-3 py-2 bg-wa-bg border border-wa-border rounded-lg text-wa-text text-sm focus:outline-none focus:ring-2 focus:ring-wa-primary"
              />
              <div className="flex items-center space-x-2">
                {LABEL_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      selectedColor === color ? 'scale-110 ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddLabel}
                  className="flex-1 px-4 py-2 bg-wa-primary hover:bg-wa-primary-dark text-white rounded-lg text-sm transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowLabelInput(false);
                    setNewLabelName('');
                  }}
                  className="px-4 py-2 bg-wa-bg hover:bg-wa-hover text-wa-text rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Label List */}
          <div className="space-y-2">
            {chat.labels.length === 0 ? (
              <p className="text-wa-text-secondary text-sm">No labels yet</p>
            ) : (
              chat.labels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: `${label.color}20`,
                  }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: label.color }}
                  >
                    {label.name}
                  </span>
                  <button
                    onClick={() => handleRemoveLabel(label.id)}
                    className="p-1 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      style={{ color: label.color }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="px-4 py-4">
          <h4 className="text-wa-text text-sm font-medium mb-3">Internal Notes</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleSaveNotes}
            placeholder="Add notes about this client..."
            rows={6}
            className="w-full px-3 py-2 bg-wa-bg border border-wa-border rounded-lg text-wa-text text-sm focus:outline-none focus:ring-2 focus:ring-wa-primary resize-none"
          />
          <p className="text-wa-text-secondary text-xs mt-2">
            Notes are shared with your team
          </p>
        </div>
      </div>
    </div>
  );
}
