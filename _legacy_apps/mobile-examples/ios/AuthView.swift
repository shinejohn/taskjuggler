import SwiftUI

struct AuthView: View {
    @StateObject private var viewModel = AuthViewModel()
    @State private var isLogin = true
    @State private var email = ""
    @State private var password = ""
    @State private var name = ""
    @State private var passwordConfirmation = ""
    @State private var showError = false
    @State private var errorMessage = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                Text(isLogin ? "Login" : "Register")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.bottom, 32)
                
                if showError {
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.red)
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                    .padding()
                    .background(Color.red.opacity(0.1))
                    .cornerRadius(8)
                    .padding(.horizontal)
                }
                
                if !isLogin {
                    TextField("Name", text: $name)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .autocapitalization(.words)
                        .disabled(viewModel.isLoading)
                }
                
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .disabled(viewModel.isLoading)
                
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disabled(viewModel.isLoading)
                
                if !isLogin {
                    SecureField("Confirm Password", text: $passwordConfirmation)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .disabled(viewModel.isLoading)
                }
                
                Button(action: {
                    handleAuth()
                }) {
                    if viewModel.isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                    } else {
                        Text(isLogin ? "Login" : "Register")
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(email.isEmpty || password.isEmpty || viewModel.isLoading)
                .disabled(!isLogin && (name.isEmpty || password != passwordConfirmation))
                
                Button(action: {
                    isLogin.toggle()
                    showError = false
                }) {
                    Text(isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in")
                        .font(.caption)
                        .foregroundColor(.blue)
                }
                
                if isLogin {
                    Button(action: {
                        // Navigate to forgot password
                    }) {
                        Text("Forgot Password?")
                            .font(.caption)
                            .foregroundColor(.blue)
                    }
                }
                
                Spacer()
            }
            .padding()
            .onChange(of: viewModel.errorMessage) { error in
                if let error = error {
                    errorMessage = error
                    showError = true
                }
            }
            .onChange(of: viewModel.isAuthenticated) { authenticated in
                if authenticated {
                    // Navigate to main screen
                }
            }
        }
    }
    
    private func handleAuth() {
        showError = false
        
        if isLogin {
            viewModel.login(email: email, password: password)
        } else {
            if password == passwordConfirmation {
                viewModel.register(name: name, email: email, password: password, passwordConfirmation: passwordConfirmation)
            } else {
                errorMessage = "Passwords do not match"
                showError = true
            }
        }
    }
}

struct AuthView_Previews: PreviewProvider {
    static var previews: some View {
        AuthView()
    }
}
