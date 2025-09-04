#!/usr/bin/env python3

import requests
import sys

def test_user_login(username, password, expected_role):
    """Test login for different user roles"""
    base_url = "https://rail-monitor-app.preview.emergentagent.com"
    api_url = f"{base_url}/api"
    
    print(f"\n🔍 Testing {username} login...")
    
    try:
        response = requests.post(
            f"{api_url}/auth/login",
            json={"username": username, "password": password},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            user_role = data.get('user', {}).get('role')
            
            if user_role == expected_role:
                print(f"✅ {username} login successful - Role: {user_role}")
                return True, data.get('access_token')
            else:
                print(f"❌ {username} role mismatch - Expected: {expected_role}, Got: {user_role}")
                return False, None
        else:
            print(f"❌ {username} login failed - Status: {response.status_code}")
            try:
                error = response.json()
                print(f"   Error: {error}")
            except:
                print(f"   Error: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ {username} login error: {e}")
        return False, None

def test_role_permissions(token, username, role):
    """Test role-based permissions"""
    base_url = "https://rail-monitor-app.preview.emergentagent.com"
    api_url = f"{base_url}/api"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    print(f"\n🔍 Testing {username} ({role}) permissions...")
    
    # Test camera creation (should only work for admin)
    test_camera = {
        "name": f"Permission Test Camera - {username}",
        "location": "Test Location",
        "source": "0",
        "gps_lat": 0.0,
        "gps_lng": 0.0
    }
    
    try:
        response = requests.post(
            f"{api_url}/cameras",
            json=test_camera,
            headers=headers,
            timeout=10
        )
        
        if role == "admin":
            if response.status_code == 200:
                print(f"✅ {username} can create cameras (correct for admin)")
                # Clean up - delete the test camera
                camera_data = response.json()
                camera_id = camera_data.get('id')
                if camera_id:
                    requests.delete(f"{api_url}/cameras/{camera_id}", headers=headers)
                return True
            else:
                print(f"❌ {username} cannot create cameras (should be able to as admin)")
                return False
        else:
            if response.status_code == 403:
                print(f"✅ {username} cannot create cameras (correct for {role})")
                return True
            else:
                print(f"❌ {username} can create cameras (should not be able to as {role})")
                return False
                
    except Exception as e:
        print(f"❌ Permission test error for {username}: {e}")
        return False

def main():
    print("🚂 Railway VSS - Multi-User Authentication Testing")
    print("=" * 60)
    
    # Test users with their expected roles
    test_users = [
        ("admin", "admin123", "admin"),
        ("operator", "operator123", "operator"), 
        ("security", "security123", "security_officer")
    ]
    
    results = []
    
    for username, password, expected_role in test_users:
        success, token = test_user_login(username, password, expected_role)
        
        if success and token:
            # Test permissions
            perm_success = test_role_permissions(token, username, expected_role)
            results.append((username, success and perm_success))
        else:
            results.append((username, False))
    
    # Print final results
    print("\n" + "="*60)
    print("MULTI-USER TEST RESULTS")
    print("="*60)
    
    all_passed = True
    for username, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{username:12} - {status}")
        if not passed:
            all_passed = False
    
    if all_passed:
        print("\n✅ All multi-user authentication tests passed!")
    else:
        print("\n❌ Some multi-user tests failed!")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())