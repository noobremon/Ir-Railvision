#!/usr/bin/env python3
"""
Simple status checker for Railway Video Surveillance System
"""
import requests
import sys

def check_backend():
    try:
        response = requests.get('http://localhost:8000/api/health', timeout=5)
        if response.status_code == 200:
            print("✅ Backend (port 8000): RUNNING")
            return True
        else:
            print(f"❌ Backend (port 8000): HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend (port 8000): NOT RUNNING - {e}")
        return False

def check_frontend():
    try:
        response = requests.get('http://localhost:3001/', timeout=5)
        if response.status_code == 200:
            print("✅ Frontend (port 3001): RUNNING")
            return True
        else:
            print(f"❌ Frontend (port 3001): HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend (port 3001): NOT RUNNING - {e}")
        return False

def check_api_proxy():
    try:
        response = requests.get('http://localhost:3001/api/health', timeout=5)
        if response.status_code == 200:
            print("✅ API Proxy (3001→8000): WORKING")
            return True
        else:
            print(f"❌ API Proxy (3001→8000): HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ API Proxy (3001→8000): NOT WORKING - {e}")
        return False

if __name__ == "__main__":
    print("🚂 Railway Video Surveillance System - Status Check")
    print("=" * 50)
    
    backend_ok = check_backend()
    frontend_ok = check_frontend()
    proxy_ok = check_api_proxy()
    
    print("=" * 50)
    if all([backend_ok, frontend_ok, proxy_ok]):
        print("🎉 All systems are running correctly!")
        sys.exit(0)
    else:
        print("⚠️  Some components are not working properly!")
        sys.exit(1)