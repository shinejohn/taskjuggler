import json
import os

projects = {
    "4doctors-web": "4doctors-web",
    "coordinator-web": "4calls-ai-web",
    "ideacircuit-web": "frontend",
    "official-notice-web": "official-notice-web",
    "process-web": "process-web",
    "projects-web": "projects-web",
    "scanner-web": "scanner-web",
    "taskjuggler-web": "taskjuggler-web",
    "urpa-web": "urpa-web"
}

for folder, pkg_name in projects.items():
    file_path = os.path.join(folder, "railway.json")
    if os.path.exists(file_path):
        try:
            with open(file_path, "r") as f:
                data = json.load(f)
            
            # Update build configuration
            data["build"] = {
                "builder": "NIXPACKS",
                "buildCommand": f"npm install && npm run build -w {pkg_name}",
                "startCommand": f"npm run start -w {pkg_name}"
            }
            
            with open(file_path, "w") as f:
                json.dump(data, f, indent=4)
                f.write("\n")  # Add trailing newline
            
            print(f"Updated {file_path}")
        except Exception as e:
            print(f"Error updating {file_path}: {e}")
    else:
        print(f"Skipping {folder} (no railway.json found)")

