#!/usr/bin/env python3
"""
RVIDIA CLI - Command Line Interface for Docker Generation

Usage:
    python cli.py generate --admin-id <id> --batch <number> --total <n>
    python cli.py list-files
    python cli.py list-users
    python cli.py show-history --admin-id <id>

Commands:
    generate        Generate a Dockerfile for a specific batch
    list-files      List all available files in the data folder
    list-users      List all users from the database
    show-history    Show generation history for an admin
"""

import sys
import os
import argparse
import sqlite3
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from admin import generatedocker, print_users, getfilelist
except ImportError as e:
    print(f"Error: Could not import backend modules: {e}")
    print("Make sure the backend directory exists and contains admin.py")
    sys.exit(1)

class RvidiaCLI:
    def __init__(self):
        self.backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
        self.data_dir = os.path.join(self.backend_dir, 'data')
        self.db_path = os.path.join(self.backend_dir, 'dockerfiles.db')
        
    def generate_docker(self, admin_id, batch_number, n):
        """Generate a Dockerfile for the specified batch"""
        print(f"🐳 Generating Dockerfile for Admin ID: {admin_id}")
        print(f"📦 Batch: {batch_number}/{n}")
        print("-" * 50)
        
        try:
            # Change to backend directory for relative paths
            original_cwd = os.getcwd()
            os.chdir(self.backend_dir)
            
            # Generate the docker file
            generatedocker('data', n, batch_number, admin_id)
            
            # Read and display the generated Dockerfile
            dockerfile_path = os.path.join('data', 'Dockerfile')
            if os.path.exists(dockerfile_path):
                print("\n✅ Dockerfile generated successfully!")
                print("\n📄 Generated Dockerfile content:")
                print("-" * 40)
                with open(dockerfile_path, 'r') as f:
                    content = f.read()
                    print(content)
                print("-" * 40)
                print(f"📍 Dockerfile saved at: {os.path.abspath(dockerfile_path)}")
                
                # Show database entry
                self._show_latest_entry(admin_id)
            else:
                print("❌ Error: Dockerfile was not generated")
                
        except Exception as e:
            print(f"❌ Error generating Dockerfile: {e}")
        finally:
            os.chdir(original_cwd)
    
    def list_files(self):
        """List all available files in the data/files directory"""
        files_dir = os.path.join(self.data_dir, 'files')
        
        if not os.path.exists(files_dir):
            print(f"❌ Files directory not found: {files_dir}")
            return
            
        try:
            files = sorted([f for f in os.listdir(files_dir) 
                           if os.path.isfile(os.path.join(files_dir, f))])
            
            print("📂 Available files in data/files directory:")
            print("-" * 40)
            for i, file in enumerate(files, 1):
                file_path = os.path.join(files_dir, file)
                file_size = os.path.getsize(file_path)
                print(f"{i:2d}. {file:<20} ({file_size} bytes)")
            
            print(f"\nTotal files: {len(files)}")
            
        except Exception as e:
            print(f"❌ Error listing files: {e}")
    
    def list_users(self):
        """List all users from the database"""
        print("👥 Listing all users from database:")
        print("-" * 50)
        try:
            print_users()
        except Exception as e:
            print(f"❌ Error listing users: {e}")
    
    def show_history(self, admin_id=None):
        """Show Dockerfile generation history"""
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            
            if admin_id:
                print(f"📊 Generation history for Admin ID: {admin_id}")
                c.execute('SELECT id, adminid, content, created_at FROM fileinfo WHERE adminid = ? ORDER BY created_at DESC', (str(admin_id),))
            else:
                print("📊 All generation history:")
                c.execute('SELECT id, adminid, content, created_at FROM fileinfo ORDER BY created_at DESC')
                
            rows = c.fetchall()
            
            if not rows:
                print("No generation history found.")
                return
                
            print("-" * 80)
            print(f"{'ID':<5} {'Admin ID':<10} {'Generated At':<20} {'Content Preview':<30}")
            print("-" * 80)
            
            for row in rows:
                entry_id, admin_id_db, content, created_at = row
                content_preview = content[:30].replace('\n', ' ') + "..." if len(content) > 30 else content.replace('\n', ' ')
                print(f"{entry_id:<5} {admin_id_db:<10} {created_at:<20} {content_preview:<30}")
            
            print(f"\nTotal entries: {len(rows)}")
            conn.close()
            
        except Exception as e:
            print(f"❌ Error showing history: {e}")
    
    def _show_latest_entry(self, admin_id):
        """Show the latest database entry for an admin"""
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute('SELECT created_at FROM fileinfo WHERE adminid = ? ORDER BY created_at DESC LIMIT 1', (str(admin_id),))
            row = c.fetchone()
            if row:
                print(f"💾 Saved to database at: {row[0]}")
            conn.close()
        except Exception as e:
            print(f"Warning: Could not verify database entry: {e}")

def main():
    parser = argparse.ArgumentParser(
        description='RVIDIA CLI - Docker Generation Tool',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Generate command
    generate_parser = subparsers.add_parser('generate', help='Generate a Dockerfile')
    generate_parser.add_argument('--admin-id', required=True, help='Admin ID')
    generate_parser.add_argument('--batch', type=int, required=True, help='Batch number')
    generate_parser.add_argument('--total', type=int, required=True, help='Total number of batches')
    
    # List files command
    subparsers.add_parser('list-files', help='List all available files')
    
    # List users command
    subparsers.add_parser('list-users', help='List all users from database')
    
    # Show history command
    history_parser = subparsers.add_parser('show-history', help='Show generation history')
    history_parser.add_argument('--admin-id', help='Filter by admin ID (optional)')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    cli = RvidiaCLI()
    
    if args.command == 'generate':
        cli.generate_docker(args.admin_id, args.batch, args.total)
    elif args.command == 'list-files':
        cli.list_files()
    elif args.command == 'list-users':
        cli.list_users()
    elif args.command == 'show-history':
        cli.show_history(args.admin_id)

if __name__ == '__main__':
    main()