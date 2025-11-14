'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [webhookChatRecordUrl, setWebhookChatRecordUrl] = useState('');
  const [webhookSendMessageUrl, setWebhookSendMessageUrl] = useState('');
  const [webhookUserReplyUrl, setWebhookUserReplyUrl] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/business/settings');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      const { business } = data;
      setBusinessName(business.name);
      setWebhookChatRecordUrl(business.webhookChatRecordUrl || '');
      setWebhookSendMessageUrl(business.webhookSendMessageUrl || '');
      setWebhookUserReplyUrl(business.webhookUserReplyUrl || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/business/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookChatRecordUrl,
          webhookSendMessageUrl,
          webhookUserReplyUrl,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-wa-bg-light">
        <div className="text-wa-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wa-bg-light">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="p-2 hover:bg-wa-hover rounded-full transition-colors mr-4"
          >
            <svg
              className="w-6 h-6 text-wa-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-wa-text">Settings</h1>
        </div>

        {/* Settings Form */}
        <div className="bg-wa-panel rounded-lg shadow-xl p-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Business Info */}
            <div>
              <h2 className="text-lg font-medium text-wa-text mb-4">
                Business Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-wa-text mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  disabled
                  className="w-full px-4 py-3 bg-wa-bg border border-wa-border rounded-lg text-wa-text-secondary"
                />
              </div>
            </div>

            <div className="border-t border-wa-border pt-6">
              <h2 className="text-lg font-medium text-wa-text mb-4">
                Webhook URLs
              </h2>
              <p className="text-wa-text-secondary text-sm mb-4">
                Configure webhook endpoints for your n8n automation workflows
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-wa-text mb-2">
                    Chat Record URL
                  </label>
                  <input
                    type="url"
                    value={webhookChatRecordUrl}
                    onChange={(e) => setWebhookChatRecordUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/chat-record"
                    className="w-full px-4 py-3 bg-wa-bg border border-wa-border rounded-lg text-wa-text focus:outline-none focus:ring-2 focus:ring-wa-primary"
                  />
                  <p className="text-wa-text-secondary text-xs mt-1">
                    Endpoint to receive chat message recordings
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wa-text mb-2">
                    Send Message URL
                  </label>
                  <input
                    type="url"
                    value={webhookSendMessageUrl}
                    onChange={(e) => setWebhookSendMessageUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/send-message"
                    className="w-full px-4 py-3 bg-wa-bg border border-wa-border rounded-lg text-wa-text focus:outline-none focus:ring-2 focus:ring-wa-primary"
                  />
                  <p className="text-wa-text-secondary text-xs mt-1">
                    Endpoint to send agent messages to WhatsApp
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wa-text mb-2">
                    User Reply URL
                  </label>
                  <input
                    type="url"
                    value={webhookUserReplyUrl}
                    onChange={(e) => setWebhookUserReplyUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/user-reply"
                    className="w-full px-4 py-3 bg-wa-bg border border-wa-border rounded-lg text-wa-text focus:outline-none focus:ring-2 focus:ring-wa-primary"
                  />
                  <p className="text-wa-text-secondary text-xs mt-1">
                    Endpoint to receive user replies from WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-900/30 border border-green-500 text-green-200'
                    : 'bg-red-900/30 border border-red-500 text-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Link
                href="/"
                className="px-6 py-3 bg-wa-bg hover:bg-wa-hover text-wa-text rounded-lg transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-wa-primary hover:bg-wa-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* API Documentation */}
        <div className="mt-8 bg-wa-panel rounded-lg shadow-xl p-6">
          <h2 className="text-lg font-medium text-wa-text mb-4">
            Webhook API Documentation
          </h2>
          <div className="space-y-4 text-sm">
            <div className="bg-wa-bg rounded-lg p-4">
              <h3 className="text-wa-primary font-medium mb-2">
                POST /api/webhook/chat-record
              </h3>
              <p className="text-wa-text-secondary mb-2">
                Record incoming and bot messages
              </p>
              <pre className="bg-wa-bg-light p-3 rounded text-wa-text overflow-x-auto">
{`{
  "businessId": "your-business-id",
  "chatId": "phone-number",
  "direction": "incoming_or_outgoing",
  "message": "message content",
  "timestamp": "2025-01-01T12:00:00Z"
}`}
              </pre>
            </div>

            <div className="bg-wa-bg rounded-lg p-4">
              <h3 className="text-wa-primary font-medium mb-2">
                POST /api/webhook/user-reply
              </h3>
              <p className="text-wa-text-secondary mb-2">
                Receive user replies from WhatsApp
              </p>
              <pre className="bg-wa-bg-light p-3 rounded text-wa-text overflow-x-auto">
{`{
  "businessId": "your-business-id",
  "chatId": "phone-number",
  "message": "user message",
  "timestamp": "2025-01-01T12:00:00Z"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
