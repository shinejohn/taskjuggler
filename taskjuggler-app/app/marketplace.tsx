import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useMarketplaceStore } from '../stores/marketplace';

export default function MarketplaceScreen() {
  const router = useRouter();
  const { listings, loading, fetchListings } = useMarketplaceStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Marketplace</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded px-4 py-2"
            onPress={() => Alert.alert('Info', 'Create listing coming soon')}
          >
            <Text className="text-white font-semibold">+ New</Text>
          </TouchableOpacity>
        </View>

        {loading && listings.length === 0 ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : listings.length === 0 ? (
          <View className="py-8">
            <Text className="text-gray-500 text-center">No marketplace listings found</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {listings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                onPress={() => Alert.alert('Listing Details', `Viewing "${listing.title}" - Full details coming soon`)}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="text-lg font-semibold flex-1">{listing.title}</Text>
                  <View className={`px-2 py-1 rounded ${getStatusColor(listing.status)}`}>
                    <Text className="text-xs font-medium">{listing.status}</Text>
                  </View>
                </View>
                {listing.description && (
                  <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                    {listing.description}
                  </Text>
                )}
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="bg-gray-100 rounded px-2 py-1">
                    <Text className="text-xs text-gray-700">{listing.category}</Text>
                  </View>
                  {listing.bids && listing.bids.length > 0 && (
                    <Text className="text-xs text-gray-500">{listing.bids.length} bid(s)</Text>
                  )}
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">
                    {listing.budget_type === 'fixed' && listing.budget_min && `$${listing.budget_min}`}
                    {listing.budget_type === 'hourly' && listing.budget_min && `$${listing.budget_min}/hr`}
                    {listing.budget_type === 'quote' && 'Quote required'}
                  </Text>
                  {listing.needed_by && (
                    <Text className="text-xs text-gray-500">
                      Needed: {new Date(listing.needed_by).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
