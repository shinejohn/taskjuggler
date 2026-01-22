import os
import re
import json
import glob

# Configuration
BASE_DIR = '/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api'
MIGRATIONS_DIR = os.path.join(BASE_DIR, 'database/migrations')
MODELS_DIRS = [
    os.path.join(BASE_DIR, 'app/Models'),
    os.path.join(BASE_DIR, 'app/Modules')  # Recursive search needed here
]

def find_files(directory, pattern):
    return glob.glob(os.path.join(directory, pattern), recursive=True)

def parse_migration(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Extract table name
    table_match = re.search(r"Schema::create\(['\"](\w+)['\"]", content)
    if not table_match:
        return None

    table_name = table_match.group(1)
    
    # Extract columns
    # Look for $table->type('name', ...);
    columns = []
    # This regex is a bit simplistic but catches standard definitions
    # Matches: $table->string('email')->unique();
    column_matches = re.finditer(r"\$table->(\w+)\(['\"]([^'\"]+)['\"]", content)
    
    for match in column_matches:
        col_type = match.group(1)
        col_name = match.group(2)
        if col_type not in ['foreign', 'index', 'unique', 'primary']: # Skip constraints defined as methods for now
            columns.append({
                'name': col_name,
                'type': col_type
            })
            
    # Capture timestamps and softDeletes
    if '$table->timestamps()' in content:
        columns.append({'name': 'created_at', 'type': 'timestamp'})
        columns.append({'name': 'updated_at', 'type': 'timestamp'})
    if '$table->softDeletes()' in content:
        columns.append({'name': 'deleted_at', 'type': 'timestamp'})

    return {
        'table': table_name,
        'migration_file': os.path.basename(file_path),
        'columns': columns
    }

def parse_model(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    class_match = re.search(r"class\s+(\w+)\s+extends", content)
    if not class_match:
        return None

    class_name = class_match.group(1)
    
    # Model Namespace parsing
    namespace_match = re.search(r"namespace\s+(.+);", content)
    namespace = namespace_match.group(1) if namespace_match else ""
    full_class_name = f"{namespace}\\{class_name}"

    # Table name
    table_match = re.search(r"protected\s+\$table\s*=\s*['\"](\w+)['\"]", content)
    table_name = table_match.group(1) if table_match else None 
    # If no table defined, assume snake_case plural (simplification)
    if not table_name:
        # Simple pluralizer: CamelCase -> snake_case + s
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', class_name)
        table_name = re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower() + 's'

    # Fillable
    fillable = []
    fillable_match = re.search(r"protected\s+\$fillable\s*=\s*\[(.*?)\]", content, re.DOTALL)
    if fillable_match:
        raw_fillable = fillable_match.group(1)
        fillable = re.findall(r"['\"](\w+)['\"]", raw_fillable)

    # Relationships
    relationships = []
    # Matches: public function name() { return $this->hasMany(...); }
    # This is tricky with regex, assuming standard formatting
    rel_methods = re.finditer(r"public\s+function\s+(\w+)\s*\([^)]*\)\s*\{(?:[^{}]*)\$this->(\w+)\(", content, re.DOTALL)
    
    # Simple regex often fails on multiline methods or braces. 
    # Let's try to match function definition and content loosely
    # method name ... return $this->relationshipType
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        # Look for function definition
        func_match = re.search(r"public\s+function\s+(\w+)\s*\(", line)
        if func_match:
            method_name = func_match.group(1)
            # Look ahead a few lines for return $this->relType
            for j in range(i, min(i+10, len(lines))):
                rel_match = re.search(r"return\s+\$this->(hasOne|hasMany|belongsTo|belongsToMany|morphTo|morphMany|hasOneThrough|hasManyThrough)", lines[j])
                if rel_match:
                    relationships.append({
                        'method': method_name,
                        'type': rel_match.group(1)
                    })
                    break

    return {
        'model': class_name,
        'class': full_class_name,
        'table': table_name,
        'fillable': fillable,
        'relationships': relationships,
        'file_path': file_path
    }

def main():
    data = {
        'database': {},
        'migrations': [],
        'models': {}
    }

    # 1. Parse Migrations
    migration_files = glob.glob(os.path.join(MIGRATIONS_DIR, '**/*.php'), recursive=True)
    print(f"Found {len(migration_files)} migration files.")
    
    for mf in migration_files:
        migration_data = parse_migration(mf)
        if migration_data:
            table_name = migration_data['table']
            data['database'][table_name] = {
                'columns': migration_data['columns'],
                'defined_in_migration': migration_data['migration_file']
            }
            data['migrations'].append(migration_data['migration_file'])

    # 2. Parse Models
    model_files = []
    # app/Models
    model_files.extend(glob.glob(os.path.join(MODELS_DIRS[0], '*.php')))
    # app/Modules/*/Models
    model_files.extend(glob.glob(os.path.join(MODELS_DIRS[1], '*/Models/*.php')))
    
    print(f"Found {len(model_files)} model files.")

    for mf in model_files:
        model_data = parse_model(mf)
        if model_data:
            data['models'][model_data['model']] = model_data
            
            # Cross-reference Model with Table
            tbl = model_data['table']
            if tbl in data['database']:
                data['database'][tbl]['model'] = model_data['class']
            else:
                 # Migration might not be found or table created dynamically, add entry
                 if tbl not in data['database']:
                     data['database'][tbl] = {'columns': [], 'model': model_data['class'], 'note': 'No migration found'}

    # Write output
    output_path = os.path.join(BASE_DIR, 'data_dictionary.json')
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Data dictionary generated at: {output_path}")

if __name__ == "__main__":
    main()
