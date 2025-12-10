import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useContactListsStore } from '../stores/contactLists';
import { showToast } from '../utils/toast';
import * as DocumentPicker from 'expo-document-picker';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactsScreen() {
  const router = useRouter();
  const { contactLists, loading, fetchContactLists, deleteContactList, importContacts } = useContactListsStore();
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchContactLists();
  }, []);

  const handleImport = async (listId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: Platform.OS === 'ios' 
          ? ['public.vcard', 'public.comma-separated-values-text']
          : ['text/vcard', 'text/csv', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      if (!file) {
        showToast.error('No file selected');
        return;
      }

      setImporting(true);
      
      // For React Native, we need to send the file URI directly
      // The backend will need to handle file uploads differently
      // For now, read the file and send as FormData
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType || 'application/octet-stream',
        name: file.name,
      } as any);
      formData.append('list_id', listId);

      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${api.defaults.baseURL}/contact-lists/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to import contacts');
      }

      const result_data = await response.json();
      
      showToast.success(`Imported ${result_data.imported} contacts`);
      setSelectedList(null);
      await fetchContactLists();
    } catch (error: any) {
      showToast.error(error.message || 'Failed to import contacts');
    } finally {
      setImporting(false);
    }
  };


  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Contact List',
      'Are you sure you want to delete this contact list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContactList(id);
              showToast.success('Contact list deleted');
            } catch (error) {
              showToast.error('Failed to delete contact list');
            }
          },
        },
      ]
    );
  };

  if (loading && contactLists.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold">Contact Lists</Text>
          <View style={{ width: 50 }} />
        </View>

        {contactLists.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 mb-4">No contact lists yet</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {contactLists.map((list) => (
              <View key={list.id} className="bg-white rounded-lg p-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold mb-1">{list.name}</Text>
                    {list.description && (
                      <Text className="text-gray-600 text-sm mb-2">{list.description}</Text>
                    )}
                    <Text className="text-sm text-gray-500">
                      {list.members?.length || 0} {list.members?.length === 1 ? 'member' : 'members'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(list.id)}
                    className="ml-2"
                  >
                    <Text className="text-red-600 text-sm">Delete</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row gap-2 mt-3">
                  <TouchableOpacity
                    className="flex-1 bg-blue-600 rounded px-3 py-2"
                    onPress={() => setSelectedList(selectedList === list.id ? null : list.id)}
                  >
                    <Text className="text-white text-center text-sm font-medium">
                      {selectedList === list.id ? 'Hide Members' : 'View Members'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-green-600 rounded px-3 py-2"
                    onPress={() => handleImport(list.id)}
                    disabled={importing}
                  >
                    <Text className="text-white text-center text-sm font-medium">
                      {importing ? 'Importing...' : '📥 Import'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {selectedList === list.id && list.members && list.members.length > 0 && (
                  <View className="mt-4 pt-4 border-t border-gray-200">
                    <Text className="font-semibold mb-2">Members:</Text>
                    {list.members.map((member) => (
                      <View key={member.id} className="bg-gray-50 rounded p-2 mb-2">
                        <Text className="font-medium">{member.name}</Text>
                        {member.email && (
                          <Text className="text-sm text-gray-600">📧 {member.email}</Text>
                        )}
                        {member.phone && (
                          <Text className="text-sm text-gray-600">📞 {member.phone}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
