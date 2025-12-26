import SwiftUI

struct TasksView: View {
    @StateObject private var viewModel = TasksViewModel()
    @State private var searchText = ""
    @State private var selectedStatus: TaskStatus? = nil
    @State private var selectedPriority: TaskPriority? = nil
    @State private var showingCreateTask = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Search Bar
                SearchBar(text: $searchText)
                    .padding(.horizontal)
                    .padding(.top, 8)
                
                // Filter Chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        FilterChip(
                            title: "All",
                            isSelected: selectedStatus == nil,
                            action: { selectedStatus = nil }
                        )
                        FilterChip(
                            title: "Pending",
                            isSelected: selectedStatus == .pending,
                            action: { selectedStatus = .pending }
                        )
                        FilterChip(
                            title: "Active",
                            isSelected: selectedStatus == .inProgress,
                            action: { selectedStatus = .inProgress }
                        )
                        FilterChip(
                            title: "Done",
                            isSelected: selectedStatus == .completed,
                            action: { selectedStatus = .completed }
                        )
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                }
                
                // Priority Filters
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        FilterChip(
                            title: "All Priority",
                            isSelected: selectedPriority == nil,
                            action: { selectedPriority = nil }
                        )
                        FilterChip(
                            title: "Urgent",
                            isSelected: selectedPriority == .urgent,
                            color: .red,
                            action: { selectedPriority = .urgent }
                        )
                        FilterChip(
                            title: "High",
                            isSelected: selectedPriority == .high,
                            color: .orange,
                            action: { selectedPriority = .high }
                        )
                        FilterChip(
                            title: "Normal",
                            isSelected: selectedPriority == .normal,
                            action: { selectedPriority = .normal }
                        )
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 8)
                }
                
                // Tasks List
                if viewModel.isLoading && viewModel.tasks.isEmpty {
                    Spacer()
                    ProgressView()
                    Spacer()
                } else if filteredTasks.isEmpty {
                    EmptyTasksView(onCreateTask: { showingCreateTask = true })
                } else {
                    List(filteredTasks) { task in
                        TaskRow(task: task)
                            .onTapGesture {
                                // Navigate to task detail
                            }
                            .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                                Button(role: .destructive) {
                                    viewModel.deleteTask(id: task.id)
                                } label: {
                                    Label("Delete", systemImage: "trash")
                                }
                                
                                if task.status != "completed" {
                                    Button {
                                        viewModel.completeTask(id: task.id)
                                    } label: {
                                        Label("Complete", systemImage: "checkmark")
                                    }
                                    .tint(.green)
                                }
                            }
                    }
                    .listStyle(PlainListStyle())
                    .refreshable {
                        await viewModel.loadTasks()
                    }
                }
            }
            .navigationTitle("Tasks")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingCreateTask = true }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingCreateTask) {
                CreateTaskView(viewModel: viewModel)
            }
            .onAppear {
                Task {
                    await viewModel.loadTasks()
                }
            }
            .onChange(of: selectedStatus) { _ in
                viewModel.filterTasks(status: selectedStatus?.rawValue, priority: selectedPriority?.rawValue)
            }
            .onChange(of: selectedPriority) { _ in
                viewModel.filterTasks(status: selectedStatus?.rawValue, priority: selectedPriority?.rawValue)
            }
            .onChange(of: searchText) { text in
                viewModel.searchTasks(query: text)
            }
        }
    }
    
    private var filteredTasks: [Task] {
        viewModel.filteredTasks
    }
}

struct TaskRow: View {
    let task: Task
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(task.title)
                    .font(.headline)
                    .lineLimit(2)
                Spacer()
            }
            
            if let description = task.description, !description.isEmpty {
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            
            HStack(spacing: 8) {
                StatusBadge(status: task.status)
                PriorityBadge(priority: task.priority)
                
                if let dueDate = task.dueDate {
                    Text("Due: \(formatDate(dueDate))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
        }
        .padding(.vertical, 4)
    }
}

struct StatusBadge: View {
    let status: String
    
    var body: some View {
        let (color, text) = statusColorAndText(for: status)
        
        Text(text)
            .font(.caption)
            .fontWeight(.medium)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.2))
            .foregroundColor(color)
            .cornerRadius(8)
    }
    
    private func statusColorAndText(for status: String) -> (Color, String) {
        switch status {
        case "pending":
            return (.yellow, "Pending")
        case "completed":
            return (.green, "Completed")
        case "in_progress":
            return (.blue, "In Progress")
        default:
            return (.gray, status.capitalized)
        }
    }
}

struct PriorityBadge: View {
    let priority: String
    
    var body: some View {
        let (color, text) = priorityColorAndText(for: priority)
        
        Text(text)
            .font(.caption)
            .fontWeight(.medium)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.2))
            .foregroundColor(color)
            .cornerRadius(8)
    }
    
    private func priorityColorAndText(for priority: String) -> (Color, String) {
        switch priority {
        case "urgent":
            return (.red, "Urgent")
        case "high":
            return (.orange, "High")
        case "normal":
            return (.blue, "Normal")
        case "low":
            return (.gray, "Low")
        default:
            return (.gray, priority.capitalized)
        }
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    var color: Color = .blue
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? color : Color.gray.opacity(0.2))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(20)
        }
    }
}

struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)
            
            TextField("Search tasks...", text: $text)
                .textFieldStyle(PlainTextFieldStyle())
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(10)
    }
}

struct EmptyTasksView: View {
    let onCreateTask: () -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            Text("📋")
                .font(.system(size: 64))
            
            Text("No tasks yet")
                .font(.title2)
                .fontWeight(.semibold)
            
            Text("Create your first task to get started")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Button(action: onCreateTask) {
                Text("Create Task")
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
            .padding(.horizontal, 32)
            .padding(.top, 16)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

func formatDate(_ dateString: String) -> String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    
    if let date = formatter.date(from: dateString) {
        let displayFormatter = DateFormatter()
        displayFormatter.dateStyle = .medium
        return displayFormatter.string(from: date)
    }
    
    return dateString
}

enum TaskStatus: String {
    case pending
    case inProgress = "in_progress"
    case completed
}

enum TaskPriority: String {
    case urgent
    case high
    case normal
    case low
}

struct TasksView_Previews: PreviewProvider {
    static var previews: some View {
        TasksView()
    }
}
