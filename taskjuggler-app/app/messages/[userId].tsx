import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMessagesStore } from '../../stores/messages';
import { useAuthStore } from '../../stores/auth';
import { showToast } from '../../utils/toast';
import api from '../../utils/api';

export default function DirectMessageScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { directMessages, loading, fetchDirectMessages, sendDirectMessage } = useMessagesStore();
  const { user } = useAuthStore();
  const [messageInput, setMessageInput] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (userId) {
      loadUser();
      fetchDirectMessages(userId);
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      // Try to get user from conversations first
      const { conversations } = useMessagesStore.getState();
      const conv = conversations.find(c => c.user.id === userId);
      if (conv) {
        setOtherUser(conv.user);
        return;
      }
      // Fallback: try API (if endpoint exists)
      try {
        const response = await api.get(`/users/${userId}`);
        setOtherUser(response.data);
      } catch {
        // If endpoint doesn't exist, use basic info
        setOtherUser({ id: userId, name: 'User', email: '' });
      }
    } catch (error) {
      showToast.error('Failed to load user');
      setOtherUser({ id: userId, name: 'User', email: '' });
    }
  };

  const messages = directMessages[userId || ''] || [];
  const currentUserId = user?.id;

  const handleSend = async () => {
    if (!userId || !messageInput.trim()) return;
    try {
      await sendDirectMessage(userId, messageInput);
      setMessageInput('');
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      showToast.error('Failed to send message');
    }
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading && !otherUser) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 p-4">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-blue-600 text-lg">← Back</Text>
            </TouchableOpacity>
            {otherUser && (
              <>
                <View className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Text className="text-white font-semibold">
                    {otherUser.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text className="text-lg font-bold">{otherUser.name}</Text>
                  {otherUser.email && (
                    <Text className="text-sm text-gray-500">{otherUser.email}</Text>
                  )}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View className="py-12 items-center">
              <Text className="text-gray-500">No messages yet. Start the conversation!</Text>
            </View>
          ) : (
            <View className="space-y-3">
              {messages.map((message) => (
                <View
                  key={message.id}
                  className={`flex-row ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <View
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.sender_id === currentUserId
                        ? 'bg-blue-600'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        message.sender_id === currentUserId ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {message.content}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="bg-white border-t border-gray-200 p-4">
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg p-3"
              value={messageInput}
              onChangeText={setMessageInput}
              placeholder="Type a message..."
              multiline
              maxLength={5000}
            />
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-6 py-3 justify-center"
              onPress={handleSend}
            >
              <Text className="text-white font-medium">Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
