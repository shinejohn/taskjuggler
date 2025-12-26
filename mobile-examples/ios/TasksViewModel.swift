import Foundation
import Combine

@MainActor
class TasksViewModel: ObservableObject {
    @Published var tasks: [Task] = []
    @Published var filteredTasks: [Task] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiService = ApiService.shared
    private var searchQuery = ""
    private var statusFilter: String?
    private var priorityFilter: String?
    
    func loadTasks() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let fetchedTasks = try await apiService.getTasks(status: statusFilter, priority: priorityFilter)
            self.tasks = fetchedTasks
            applyFilters()
            isLoading = false
        } catch {
            self.errorMessage = handleError(error)
            isLoading = false
        }
    }
    
    func createTask(_ task: CreateTaskRequest) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let newTask = try await apiService.createTask(task)
            self.tasks.append(newTask)
            applyFilters()
            isLoading = false
        } catch {
            self.errorMessage = handleError(error)
            isLoading = false
        }
    }
    
    func completeTask(id: String) {
        Task {
            do {
                let updatedTask = try await apiService.completeTask(id: id)
                if let index = tasks.firstIndex(where: { $0.id == id }) {
                    tasks[index] = updatedTask
                    applyFilters()
                }
            } catch {
                self.errorMessage = handleError(error)
            }
        }
    }
    
    func deleteTask(id: String) {
        Task {
            do {
                try await apiService.deleteTask(id: id)
                tasks.removeAll { $0.id == id }
                applyFilters()
            } catch {
                self.errorMessage = handleError(error)
            }
        }
    }
    
    func searchTasks(query: String) {
        searchQuery = query.lowercased()
        applyFilters()
    }
    
    func filterTasks(status: String?, priority: String?) {
        statusFilter = status
        priorityFilter = priority
        Task {
            await loadTasks()
        }
    }
    
    private func applyFilters() {
        filteredTasks = tasks.filter { task in
            // Search filter
            let matchesSearch = searchQuery.isEmpty ||
                task.title.lowercased().contains(searchQuery) ||
                (task.description?.lowercased().contains(searchQuery) ?? false)
            
            // Status filter
            let matchesStatus = statusFilter == nil || task.status == statusFilter
            
            // Priority filter
            let matchesPriority = priorityFilter == nil || task.priority == priorityFilter
            
            return matchesSearch && matchesStatus && matchesPriority
        }
    }
    
    private func handleError(_ error: Error) -> String {
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
}
