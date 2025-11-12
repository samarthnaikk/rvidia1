# RVIDIA CLI

A command-line interface for the RVIDIA Docker generation system.

## Features

- 🐳 Generate Dockerfiles for specific batches
- 📂 List available files in the data directory
- 👥 List users from the database
- 📊 View generation history
- 💾 Automatic database storage

## Installation

No installation required! The CLI only depends on the backend modules and Python standard library.

## Usage

### Generate a Dockerfile

```bash
python cli.py generate --admin-id <admin_id> --batch <batch_number> --total <total_batches>
```

Example:
```bash
python cli.py generate --admin-id admin123 --batch 2 --total 3
```

### List Available Files

```bash
python cli.py list-files
```

### List Users

```bash
python cli.py list-users
```

### Show Generation History

```bash
# Show all history
python cli.py show-history

# Show history for specific admin
python cli.py show-history --admin-id admin123
```

### Help

```bash
python cli.py --help
python cli.py <command> --help
```

## Examples

```bash
# Generate batch 1 of 5 for admin "john_admin"
python cli.py generate --admin-id john_admin --batch 1 --total 5

# List all available data files
python cli.py list-files

# View all generation history
python cli.py show-history

# View history for specific admin
python cli.py show-history --admin-id john_admin
```

## Directory Structure

```
cli/
├── cli.py              # Main CLI script
├── requirements.txt    # Dependencies (none!)
└── README.md          # This file

backend/                # Required dependency
├── admin.py           # Core functions
├── data/              # Data files
└── dockerfiles.db     # Database
```

## Dependencies

- **Backend**: Requires `../backend/admin.py` and related backend modules
- **Python**: Standard library only (Python 3.6+)
- **Database**: Uses SQLite database from backend

## Output

The CLI provides colored output and clear formatting:

- ✅ Success messages
- ❌ Error messages  
- 🐳 Docker operations
- 📂 File operations
- 👥 User operations
- 📊 History operations
- 💾 Database operations

## Database Integration

All Dockerfile generations are automatically saved to the database with:
- Admin ID
- Generated content
- Timestamp
- Unique entry ID