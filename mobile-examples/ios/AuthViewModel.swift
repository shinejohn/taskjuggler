import Foundation
import Combine

@MainActor
class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var user: User?
    
    private let apiService = ApiService.shared
    private let tokenManager = TokenManager.shared
    
    init() {
        checkAuthStatus()
    }
    
    func login(email: String, password: String) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let response = try await apiService.login(email: email, password: password)
                self.user = response.user
                self.isAuthenticated = true
                self.isLoading = false
            } catch {
                self.errorMessage = handleError(error)
                self.isLoading = false
            }
        }
    }
    
    func register(name: String, email: String, password: String, passwordConfirmation: String) {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let response = try await apiService.register(
                    name: name,
                    email: email,
                    password: password,
                    passwordConfirmation: passwordConfirmation
                )
                self.user = response.user
                self.isAuthenticated = true
                self.isLoading = false
            } catch {
                self.errorMessage = handleError(error)
                self.isLoading = false
            }
        }
    }
    
    func logout() {
        Task {
            do {
                try await apiService.logout()
                self.isAuthenticated = false
                self.user = nil
            } catch {
                self.errorMessage = handleError(error)
            }
        }
    }
    
    func checkAuthStatus() {
        if tokenManager.isAuthenticated {
            Task {
                await fetchUser()
            }
        }
    }
    
    private func fetchUser() async {
        do {
            let user = try await apiService.getUser()
            self.user = user
            self.isAuthenticated = true
        } catch {
            self.isAuthenticated = false
            self.user = nil
        }
    }
    
    private func handleError(_ error: Error) -> String {
        if let apiError = error as? ApiError {
            switch apiError {
            case .unauthorized:
                return "Invalid email or password"
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
}
