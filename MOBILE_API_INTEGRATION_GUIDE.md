# Mobile API Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Client Setup](#api-client-setup)
4. [Android Implementation](#android-implementation)
5. [iOS Implementation](#ios-implementation)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## Overview

Task Juggler API is a RESTful JSON API using Laravel Sanctum for authentication. All endpoints return JSON and accept JSON request bodies. The API is platform-agnostic and works seamlessly with native Android and iOS applications.

### Base URL
```
Production: https://api.taskjuggler.com/api
Development: http://localhost:8000/api
```

### API Response Format
```json
{
  "data": { ... },
  "message": "Success message",
  "status": "success"
}
```

### Error Response Format
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error detail"]
  }
}
```

---

## Authentication

### Authentication Flow

1. **Login/Register** → Receive Bearer token
2. **Store token securely** → iOS Keychain / Android Keystore
3. **Include in requests** → `Authorization: Bearer {token}` header
4. **Handle 401** → Refresh token or redirect to login

### Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/user
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/push-token
```

### Request/Response Examples

**Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

Response:
{
  "token": "1|abcdef123456...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "1|abcdef123456...",
  "user": { ... }
}
```

---

## API Client Setup

### Common Headers
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

### Request Interceptor Pattern
- Automatically add Authorization header if token exists
- Handle token refresh on 401 responses
- Add request/response logging for debugging

### Response Interceptor Pattern
- Parse JSON responses
- Handle error responses consistently
- Extract error messages for user display

---

## Android Implementation

### Dependencies (build.gradle)

```gradle
dependencies {
    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'
    
    // Secure Storage
    implementation 'androidx.security:security-crypto:1.1.0-alpha06'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
}
```

### API Service Interface

```kotlin
// ApiService.kt
import retrofit2.http.*

interface ApiService {
    // Auth
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
    
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    @POST("auth/logout")
    suspend fun logout(): Response<ApiResponse>
    
    @GET("auth/user")
    suspend fun getUser(): Response<User>
    
    // Tasks
    @GET("tasks")
    suspend fun getTasks(
        @Query("status") status: String? = null,
        @Query("priority") priority: String? = null
    ): Response<List<Task>>
    
    @GET("tasks/{id}")
    suspend fun getTask(@Path("id") id: String): Response<Task>
    
    @POST("tasks")
    suspend fun createTask(@Body task: CreateTaskRequest): Response<Task>
    
    @PUT("tasks/{id}")
    suspend fun updateTask(@Path("id") id: String, @Body task: UpdateTaskRequest): Response<Task>
    
    @DELETE("tasks/{id}")
    suspend fun deleteTask(@Path("id") id: String): Response<ApiResponse>
    
    @POST("tasks/{id}/complete")
    suspend fun completeTask(@Path("id") id: String): Response<Task>
    
    @POST("tasks/{id}/assign")
    suspend fun assignTask(@Path("id") id: String, @Body request: AssignTaskRequest): Response<Task>
    
    // Inbox
    @GET("inbox")
    suspend fun getInbox(): Response<List<InboxItem>>
    
    @GET("inbox/{id}")
    suspend fun getInboxItem(@Path("id") id: String): Response<InboxItem>
    
    @POST("inbox/{id}/process")
    suspend fun processInboxItem(@Path("id") id: String): Response<ApiResponse>
    
    @POST("inbox/{id}/dismiss")
    suspend fun dismissInboxItem(@Path("id") id: String): Response<ApiResponse>
    
    @POST("inbox/{id}/create-task")
    suspend fun createTaskFromInbox(@Path("id") id: String): Response<Task>
    
    // Teams
    @GET("teams")
    suspend fun getTeams(): Response<List<Team>>
    
    @GET("teams/{id}")
    suspend fun getTeam(@Path("id") id: String): Response<Team>
    
    @POST("teams")
    suspend fun createTeam(@Body team: CreateTeamRequest): Response<Team>
    
    @POST("teams/{id}/invite")
    suspend fun inviteToTeam(@Path("id") id: String, @Body request: InviteRequest): Response<ApiResponse>
    
    // Messages
    @GET("messages/conversations")
    suspend fun getConversations(): Response<List<Conversation>>
    
    @GET("messages/with/{userId}")
    suspend fun getMessages(@Path("userId") userId: String): Response<List<Message>>
    
    @POST("messages/to/{userId}")
    suspend fun sendMessage(@Path("userId") userId: String, @Body request: SendMessageRequest): Response<Message>
    
    // Marketplace
    @GET("marketplace/listings")
    suspend fun getListings(): Response<List<MarketplaceListing>>
    
    @POST("marketplace/listings")
    suspend fun createListing(@Body listing: CreateListingRequest): Response<MarketplaceListing>
    
    @POST("marketplace/listings/{id}/bid")
    suspend fun bidOnListing(@Path("id") id: String, @Body request: BidRequest): Response<ApiResponse>
}
```

### API Client Setup

```kotlin
// ApiClient.kt
import okhttp3.*
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private const val BASE_URL = "https://api.taskjuggler.com/api/"
    private const val TIMEOUT_SECONDS = 30L
    
    private val tokenManager = TokenManager()
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    private val authInterceptor = Interceptor { chain ->
        val request = chain.request().newBuilder()
            .addHeader("Accept", "application/json")
            .addHeader("Content-Type", "application/json")
            .apply {
                tokenManager.getToken()?.let { token ->
                    addHeader("Authorization", "Bearer $token")
                }
            }
            .build()
        
        val response = chain.proceed(request)
        
        // Handle 401 Unauthorized
        if (response.code == 401) {
            tokenManager.clearToken()
            // Trigger logout or token refresh
        }
        
        response
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .readTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .writeTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val apiService: ApiService = retrofit.create(ApiService::class.java)
}
```

### Secure Token Storage

```kotlin
// TokenManager.kt
import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class TokenManager(private val context: Context) {
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()
    
    private val sharedPreferences = EncryptedSharedPreferences.create(
        context,
        "auth_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    fun saveToken(token: String) {
        sharedPreferences.edit().putString("auth_token", token).apply()
    }
    
    fun getToken(): String? {
        return sharedPreferences.getString("auth_token", null)
    }
    
    fun clearToken() {
        sharedPreferences.edit().remove("auth_token").apply()
    }
}
```

### Data Models

```kotlin
// Models.kt
import com.google.gson.annotations.SerializedName

data class AuthResponse(
    @SerializedName("token") val token: String,
    @SerializedName("user") val user: User
)

data class User(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("timezone") val timezone: String = "America/New_York"
)

data class Task(
    @SerializedName("id") val id: String,
    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String?,
    @SerializedName("status") val status: String,
    @SerializedName("priority") val priority: String,
    @SerializedName("due_date") val dueDate: String?,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("updated_at") val updatedAt: String,
    @SerializedName("requestor_id") val requestorId: String,
    @SerializedName("owner_id") val ownerId: String?
)

data class InboxItem(
    @SerializedName("id") val id: String,
    @SerializedName("type") val type: String,
    @SerializedName("subject") val subject: String,
    @SerializedName("body") val body: String,
    @SerializedName("status") val status: String,
    @SerializedName("received_at") val receivedAt: String
)

data class Team(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String?,
    @SerializedName("members") val members: List<TeamMember>
)

data class Message(
    @SerializedName("id") val id: String,
    @SerializedName("sender_id") val senderId: String,
    @SerializedName("receiver_id") val receiverId: String,
    @SerializedName("content") val content: String,
    @SerializedName("read_at") val readAt: String?,
    @SerializedName("created_at") val createdAt: String
)

data class ApiResponse(
    @SerializedName("message") val message: String?,
    @SerializedName("status") val status: String?
)
```

### Repository Pattern

```kotlin
// TaskRepository.kt
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class TaskRepository {
    private val apiService = ApiClient.apiService
    
    suspend fun getTasks(status: String? = null, priority: String? = null): Result<List<Task>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getTasks(status, priority)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception(response.message()))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    suspend fun createTask(task: CreateTaskRequest): Result<Task> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.createTask(task)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception(response.message()))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    suspend fun completeTask(id: String): Result<Task> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.completeTask(id)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception(response.message()))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}
```

### ViewModel Example

```kotlin
// TasksViewModel.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class TasksViewModel : ViewModel() {
    private val repository = TaskRepository()
    
    private val _tasks = MutableStateFlow<List<Task>>(emptyList())
    val tasks: StateFlow<List<Task>> = _tasks
    
    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error
    
    fun loadTasks(status: String? = null, priority: String? = null) {
        viewModelScope.launch {
            _loading.value = true
            _error.value = null
            
            repository.getTasks(status, priority)
                .onSuccess { tasks ->
                    _tasks.value = tasks
                }
                .onFailure { exception ->
                    _error.value = exception.message
                }
            
            _loading.value = false
        }
    }
    
    fun createTask(task: CreateTaskRequest) {
        viewModelScope.launch {
            _loading.value = true
            _error.value = null
            
            repository.createTask(task)
                .onSuccess { newTask ->
                    _tasks.value = _tasks.value + newTask
                }
                .onFailure { exception ->
                    _error.value = exception.message
                }
            
            _loading.value = false
        }
    }
    
    fun completeTask(id: String) {
        viewModelScope.launch {
            repository.completeTask(id)
                .onSuccess { updatedTask ->
                    _tasks.value = _tasks.value.map { 
                        if (it.id == id) updatedTask else it 
                    }
                }
                .onFailure { exception ->
                    _error.value = exception.message
                }
        }
    }
}
```

---

## iOS Implementation

### Dependencies (Package.swift or Podfile)

**Swift Package Manager:**
```swift
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
    .package(url: "https://github.com/apple/swift-crypto.git", from: "2.0.0")
]
```

**CocoaPods:**
```ruby
pod 'Alamofire', '~> 5.8'
pod 'KeychainAccess', '~> 4.2'
```

### API Service

```swift
// ApiService.swift
import Foundation
import Alamofire

enum ApiError: Error {
    case invalidURL
    case invalidResponse
    case unauthorized
    case serverError(String)
    case networkError(Error)
}

class ApiService {
    static let shared = ApiService()
    
    private let baseURL = "https://api.taskjuggler.com/api"
    private let tokenManager = TokenManager.shared
    
    private var headers: HTTPHeaders {
        var headers: HTTPHeaders = [
            "Accept": "application/json",
            "Content-Type": "application/json"
        ]
        
        if let token = tokenManager.getToken() {
            headers["Authorization"] = "Bearer \(token)"
        }
        
        return headers
    }
    
    // MARK: - Authentication
    
    func register(name: String, email: String, password: String, passwordConfirmation: String) async throws -> AuthResponse {
        let parameters: [String: Any] = [
            "name": name,
            "email": email,
            "password": password,
            "password_confirmation": passwordConfirmation
        ]
        
        return try await request(endpoint: "/auth/register", method: .post, parameters: parameters)
    }
    
    func login(email: String, password: String) async throws -> AuthResponse {
        let parameters: [String: Any] = [
            "email": email,
            "password": password
        ]
        
        let response: AuthResponse = try await request(endpoint: "/auth/login", method: .post, parameters: parameters)
        tokenManager.saveToken(response.token)
        return response
    }
    
    func logout() async throws {
        _ = try await request(endpoint: "/auth/logout", method: .post) as EmptyResponse
        tokenManager.clearToken()
    }
    
    func getUser() async throws -> User {
        return try await request(endpoint: "/auth/user", method: .get)
    }
    
    // MARK: - Tasks
    
    func getTasks(status: String? = nil, priority: String? = nil) async throws -> [Task] {
        var parameters: [String: Any] = [:]
        if let status = status { parameters["status"] = status }
        if let priority = priority { parameters["priority"] = priority }
        
        return try await request(endpoint: "/tasks", method: .get, parameters: parameters.isEmpty ? nil : parameters)
    }
    
    func getTask(id: String) async throws -> Task {
        return try await request(endpoint: "/tasks/\(id)", method: .get)
    }
    
    func createTask(_ task: CreateTaskRequest) async throws -> Task {
        return try await request(endpoint: "/tasks", method: .post, parameters: task.toDictionary())
    }
    
    func updateTask(id: String, _ task: UpdateTaskRequest) async throws -> Task {
        return try await request(endpoint: "/tasks/\(id)", method: .put, parameters: task.toDictionary())
    }
    
    func deleteTask(id: String) async throws {
        _ = try await request(endpoint: "/tasks/\(id)", method: .delete) as EmptyResponse
    }
    
    func completeTask(id: String) async throws -> Task {
        return try await request(endpoint: "/tasks/\(id)/complete", method: .post)
    }
    
    func assignTask(id: String, ownerId: String) async throws -> Task {
        let parameters: [String: Any] = ["owner_id": ownerId]
        return try await request(endpoint: "/tasks/\(id)/assign", method: .post, parameters: parameters)
    }
    
    // MARK: - Inbox
    
    func getInbox() async throws -> [InboxItem] {
        return try await request(endpoint: "/inbox", method: .get)
    }
    
    func getInboxItem(id: String) async throws -> InboxItem {
        return try await request(endpoint: "/inbox/\(id)", method: .get)
    }
    
    func processInboxItem(id: String) async throws {
        _ = try await request(endpoint: "/inbox/\(id)/process", method: .post) as EmptyResponse
    }
    
    func dismissInboxItem(id: String) async throws {
        _ = try await request(endpoint: "/inbox/\(id)/dismiss", method: .post) as EmptyResponse
    }
    
    func createTaskFromInbox(id: String) async throws -> Task {
        return try await request(endpoint: "/inbox/\(id)/create-task", method: .post)
    }
    
    // MARK: - Teams
    
    func getTeams() async throws -> [Team] {
        return try await request(endpoint: "/teams", method: .get)
    }
    
    func getTeam(id: String) async throws -> Team {
        return try await request(endpoint: "/teams/\(id)", method: .get)
    }
    
    func createTeam(_ team: CreateTeamRequest) async throws -> Team {
        return try await request(endpoint: "/teams", method: .post, parameters: team.toDictionary())
    }
    
    func inviteToTeam(id: String, email: String) async throws {
        let parameters: [String: Any] = ["email": email]
        _ = try await request(endpoint: "/teams/\(id)/invite", method: .post, parameters: parameters) as EmptyResponse
    }
    
    // MARK: - Messages
    
    func getConversations() async throws -> [Conversation] {
        return try await request(endpoint: "/messages/conversations", method: .get)
    }
    
    func getMessages(userId: String) async throws -> [Message] {
        return try await request(endpoint: "/messages/with/\(userId)", method: .get)
    }
    
    func sendMessage(to userId: String, content: String) async throws -> Message {
        let parameters: [String: Any] = ["content": content]
        return try await request(endpoint: "/messages/to/\(userId)", method: .post, parameters: parameters)
    }
    
    // MARK: - Marketplace
    
    func getListings() async throws -> [MarketplaceListing] {
        return try await request(endpoint: "/marketplace/listings", method: .get)
    }
    
    func createListing(_ listing: CreateListingRequest) async throws -> MarketplaceListing {
        return try await request(endpoint: "/marketplace/listings", method: .post, parameters: listing.toDictionary())
    }
    
    func bidOnListing(id: String, amount: Double) async throws {
        let parameters: [String: Any] = ["amount": amount]
        _ = try await request(endpoint: "/marketplace/listings/\(id)/bid", method: .post, parameters: parameters) as EmptyResponse
    }
    
    // MARK: - Generic Request Method
    
    private func request<T: Decodable>(
        endpoint: String,
        method: HTTPMethod,
        parameters: [String: Any]? = nil
    ) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else {
            throw ApiError.invalidURL
        }
        
        return try await withCheckedThrowingContinuation { continuation in
            AF.request(
                url,
                method: method,
                parameters: parameters,
                encoding: JSONEncoding.default,
                headers: headers
            )
            .validate()
            .responseDecodable(of: T.self) { response in
                switch response.result {
                case .success(let value):
                    continuation.resume(returning: value)
                case .failure(let error):
                    if let statusCode = response.response?.statusCode {
                        switch statusCode {
                        case 401:
                            self.tokenManager.clearToken()
                            continuation.resume(throwing: ApiError.unauthorized)
                        case 422:
                            if let data = response.data,
                               let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                                continuation.resume(throwing: ApiError.serverError(errorResponse.message))
                            } else {
                                continuation.resume(throwing: ApiError.serverError("Validation error"))
                            }
                        default:
                            continuation.resume(throwing: ApiError.serverError(error.localizedDescription))
                        }
                    } else {
                        continuation.resume(throwing: ApiError.networkError(error))
                    }
                }
            }
        }
    }
}
```

### Secure Token Storage

```swift
// TokenManager.swift
import Foundation
import KeychainAccess

class TokenManager {
    static let shared = TokenManager()
    
    private let keychain = Keychain(service: "com.taskjuggler.app")
    private let tokenKey = "auth_token"
    
    func saveToken(_ token: String) {
        try? keychain.set(token, key: tokenKey)
    }
    
    func getToken() -> String? {
        return try? keychain.get(tokenKey)
    }
    
    func clearToken() {
        try? keychain.remove(tokenKey)
    }
    
    var isAuthenticated: Bool {
        return getToken() != nil
    }
}
```

### Data Models

```swift
// Models.swift
import Foundation

struct AuthResponse: Codable {
    let token: String
    let user: User
}

struct User: Codable {
    let id: String
    let name: String
    let email: String
    let phone: String?
    let timezone: String
}

struct Task: Codable, Identifiable {
    let id: String
    let title: String
    let description: String?
    let status: String
    let priority: String
    let dueDate: String?
    let createdAt: String
    let updatedAt: String
    let requestorId: String
    let ownerId: String?
    
    enum CodingKeys: String, CodingKey {
        case id, title, description, status, priority
        case dueDate = "due_date"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case requestorId = "requestor_id"
        case ownerId = "owner_id"
    }
}

struct InboxItem: Codable, Identifiable {
    let id: String
    let type: String
    let subject: String
    let body: String
    let status: String
    let receivedAt: String
    
    enum CodingKeys: String, CodingKey {
        case id, type, subject, body, status
        case receivedAt = "received_at"
    }
}

struct Team: Codable, Identifiable {
    let id: String
    let name: String
    let description: String?
    let members: [TeamMember]
}

struct Message: Codable, Identifiable {
    let id: String
    let senderId: String
    let receiverId: String
    let content: String
    let readAt: String?
    let createdAt: String
    
    enum CodingKeys: String, CodingKey {
        case id, content
        case senderId = "sender_id"
        case receiverId = "receiver_id"
        case readAt = "read_at"
        case createdAt = "created_at"
    }
}

struct ErrorResponse: Codable {
    let message: String
    let errors: [String: [String]]?
}

struct EmptyResponse: Codable {}
```

### ViewModel Example (SwiftUI)

```swift
// TasksViewModel.swift
import Foundation
import Combine

@MainActor
class TasksViewModel: ObservableObject {
    @Published var tasks: [Task] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiService = ApiService.shared
    
    func loadTasks(status: String? = nil, priority: String? = nil) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let fetchedTasks = try await apiService.getTasks(status: status, priority: priority)
                self.tasks = fetchedTasks
                self.isLoading = false
            } catch {
                self.errorMessage = error.localizedDescription
                self.isLoading = false
            }
        }
    }
    
    func createTask(_ task: CreateTaskRequest) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let newTask = try await apiService.createTask(task)
                self.tasks.append(newTask)
                self.isLoading = false
            } catch {
                self.errorMessage = error.localizedDescription
                self.isLoading = false
            }
        }
    }
    
    func completeTask(id: String) {
        Task {
            do {
                let updatedTask = try await apiService.completeTask(id: id)
                if let index = tasks.firstIndex(where: { $0.id == id }) {
                    tasks[index] = updatedTask
                }
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
    
    func deleteTask(id: String) {
        Task {
            do {
                try await apiService.deleteTask(id: id)
                tasks.removeAll { $0.id == id }
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
}
```

---

## Error Handling

### Common HTTP Status Codes

- **200 OK** - Success
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request parameters
- **401 Unauthorized** - Authentication required or token expired
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation errors
- **500 Internal Server Error** - Server error

### Error Handling Pattern

**Android:**
```kotlin
fun handleApiError(error: Throwable): String {
    return when (error) {
        is HttpException -> {
            when (error.code()) {
                401 -> "Session expired. Please login again."
                403 -> "You don't have permission to perform this action."
                404 -> "Resource not found."
                422 -> {
                    val errorBody = error.response()?.errorBody()?.string()
                    parseValidationErrors(errorBody) ?: "Validation error"
                }
                500 -> "Server error. Please try again later."
                else -> "An error occurred: ${error.message()}"
            }
        }
        is IOException -> "Network error. Check your internet connection."
        else -> "An unexpected error occurred: ${error.message}"
    }
}
```

**iOS:**
```swift
func handleApiError(_ error: Error) -> String {
    if let apiError = error as? ApiError {
        switch apiError {
        case .unauthorized:
            return "Session expired. Please login again."
        case .serverError(let message):
            return message
        case .networkError:
            return "Network error. Check your internet connection."
        default:
            return "An error occurred"
        }
    }
    return error.localizedDescription
}
```

---

## Best Practices

### 1. Token Management
- Store tokens securely (Keychain/Keystore)
- Clear tokens on logout
- Handle token expiration gracefully
- Implement token refresh if available

### 2. Network Requests
- Use appropriate timeouts (30 seconds recommended)
- Implement retry logic for network failures
- Show loading indicators during requests
- Cache responses when appropriate

### 3. Error Handling
- Display user-friendly error messages
- Log errors for debugging
- Handle offline scenarios
- Validate input before sending requests

### 4. Performance
- Use pagination for large lists
- Implement pull-to-refresh
- Cache frequently accessed data
- Optimize image loading

### 5. Security
- Never store tokens in UserDefaults/SharedPreferences
- Use HTTPS only
- Validate SSL certificates
- Sanitize user input

### 6. Testing
- Mock API responses for testing
- Test error scenarios
- Test offline behavior
- Test token expiration handling

---

## Complete API Endpoint Reference

See `API_ENDPOINTS.md` for complete endpoint documentation with request/response examples.
