# LoginInfo Usage Guide

## How to Use Login Info in Redux

### 1. Login Action
When user logs in, the login response is stored directly in Redux `logininfo`:

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectLoginInfo } from '@/store/reducer';

function LoginComponent() {
  const dispatch = useDispatch();
  const logininfo = useSelector(selectLoginInfo);

  const handleLogin = async (email, password) => {
    const result = await dispatch(loginUser({ 
      email, 
      password, 
      rememberMe: true 
    }));
    
    if (result.payload) {
      console.log("Login successful!");
      console.log("User:", result.payload.user);
      console.log("Token:", result.payload.token);
    }
  };

  return (
    // Your login form
  );
}
```

### 2. Access Login Info in Redux State

```javascript
const logininfo = useSelector(selectLoginInfo);

// logininfo structure:
// {
//   user: {
//     id: "1",
//     firstName: "Admin",
//     lastName: "User",
//     userEmail: "admin@gmail.com",
//     userName: "Admin User",
//     userRole: "Administrator",
//     userStatus: "Active",
//     userPhoneNumber: "+1-555-0001",
//     createdAt: "2024-01-01T00:00:00Z",
//     createdBy: "Admin User - 11/23/2025, 2:30:45 PM",
//     updatedBy: "Admin User - 11/23/2025, 2:30:45 PM"
//   },
//   token: "local_token_1234567890"
// }
```

### 3. Access User Data in Components

```javascript
function Header() {
  const logininfo = useSelector(selectLoginInfo);
  const user = logininfo?.user;

  return (
    <div>
      <p>Welcome, {user?.firstName} {user?.lastName}</p>
      <p>Role: {user?.userRole}</p>
      <p>Email: {user?.userEmail}</p>
    </div>
  );
}
```

### 4. Get First Name and Last Name for createdBy/updatedBy

```javascript
function CreateRecordComponent() {
  const dispatch = useDispatch();
  const logininfo = useSelector(selectLoginInfo);
  const user = logininfo?.user;

  const handleCreate = async (data) => {
    const now = new Date();
    const timestamp = now.toLocaleString();
    const createdBy = user 
      ? `${user.firstName} ${user.lastName} - ${timestamp}`
      : `System - ${timestamp}`;

    const newData = {
      ...data,
      createdBy,
      updatedBy: createdBy,
      createdAt: new Date().toISOString()
    };

    // Send to API
    // Example: Admin User - 11/23/2025, 2:30:45 PM
  };

  return (
    // Your form
  );
}
```

### 5. Logout

```javascript
import { logoutUser } from '@/store/reducer';

function handleLogout() {
  dispatch(logoutUser());
  // logininfo will be cleared automatically
}
```

## Key Points

✅ **Simple**: Direct storage of login response in Redux  
✅ **No LocalStorage**: User data is only in Redux state  
✅ **First Name + Last Name Available**: Use for audit trail (createdBy/updatedBy)  
✅ **Token Stored**: Available for API authentication  
✅ **User Info Persists**: While user is logged in in the session  

## Accessing from selectors

```javascript
export const selectLoginInfo = (state) => state.logininfo;
export const selectLoginUser = (state) => state.logininfo?.user;
export const selectLoginToken = (state) => state.logininfo?.token;
```
