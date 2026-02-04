<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { teamsApi } from '../../services/api'
import type { Team } from '../../types'

const teams = ref<Team[]>([])
const selectedTeam = ref<Team | null>(null)
const members = ref<any[]>([])
const loading = ref(true)
const inviteEmail = ref('')
const showInviteModal = ref(false)

onMounted(async () => {
    loading.value = true
    try {
        teams.value = await teamsApi.list()
        if (teams.value.length > 0) {
            selectTeam(teams.value[0])
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})

const selectTeam = async (team: Team) => {
    selectedTeam.value = team
    try {
        members.value = await teamsApi.getMembers(team.id)
    } catch (e) {
        console.error(e)
    }
}

const inviteUser = async () => {
    if (!selectedTeam.value) return
    try {
        await teamsApi.invite(selectedTeam.value.id, inviteEmail.value)
        alert('Invitation sent!')
        showInviteModal.value = false
        inviteEmail.value = ''
    } catch (e: any) {
        alert("Failed to invite: " + (e.response?.data?.error || e.message))
    }
}

const removeMember = async (userId: string) => {
    if (!confirm("Remove this member?")) return
    if (!selectedTeam.value) return
    
    try {
        await teamsApi.removeMember(selectedTeam.value.id, userId)
        members.value = members.value.filter(m => m.id !== userId)
    } catch (e: any) {
        alert("Failed to remove: " + (e.response?.data?.error || e.message))
    }
}

const createTeam = async () => {
    const name = prompt("Enter team name:")
    if (!name) return
    try {
        const team = await teamsApi.create(name)
        teams.value.push(team)
        selectTeam(team)
    } catch (e) {
        alert("Failed to create team")
    }
}
</script>

<template>
    <div class="max-w-4xl mx-auto py-8 px-4">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold">Team Management</h1>
            <button @click="createTeam" class="text-blue-600 font-medium hover:underline">+ New Team</button>
        </div>

        <div v-if="loading" class="text-center py-12">Loading...</div>

        <div v-else-if="teams.length === 0" class="text-center py-12 bg-white rounded-lg border">
            <p class="text-gray-500 mb-4">You don't have any teams yet.</p>
            <button @click="createTeam" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Create a Team</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Sidebar list of teams -->
            <div class="col-span-1 space-y-2">
                <h3 class="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-3">Your Teams</h3>
                <button 
                    v-for="team in teams" 
                    :key="team.id"
                    @click="selectTeam(team)"
                    class="w-full text-left px-3 py-2 rounded-md transition-colors"
                    :class="selectedTeam?.id === team.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'"
                >
                    {{ team.name }}
                </button>
            </div>

            <!-- Main Content -->
            <div class="col-span-3 bg-white rounded-xl shadow border border-gray-200" v-if="selectedTeam">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">{{ selectedTeam.name }}</h2>
                        <p class="text-sm text-gray-500">Manage members and permissions</p>
                    </div>
                    <button 
                        @click="showInviteModal = true"
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        Invite Member
                    </button>
                </div>

                <div class="divide-y divide-gray-100">
                    <div v-for="member in members" :key="member.id" class="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {{ member.name.charAt(0) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ member.name }}</p>
                                <p class="text-sm text-gray-500">{{ member.email }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <span v-if="member.is_admin" class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">Admin</span>
                             <button @click="removeMember(member.id)" class="text-red-600 hover:text-red-800 text-sm">Remove</button>
                        </div>
                    </div>
                     <div v-if="members.length === 0" class="p-8 text-center text-gray-500">
                        No members found (which is odd given you should be one).
                    </div>
                </div>
            </div>
        </div>

        <!-- Invite Modal -->
        <div v-if="showInviteModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                <h3 class="text-lg font-bold mb-4">Invite to {{ selectedTeam?.name }}</h3>
                <form @submit.prevent="inviteUser">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input v-model="inviteEmail" type="email" required class="w-full border rounded-lg px-3 py-2 mb-4" placeholder="colleague@example.com" />
                    
                    <div class="flex justify-end gap-3">
                        <button type="button" @click="showInviteModal = false" class="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded transition-colors text-sm font-medium">Cancel</button>
                        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">Send Invitation</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
