# Form Management System

A clean, organized system for creating and updating Users, Tasks, Projects, and Teams with a sliding sidebar UI.

## 📁 Project Structure

```
task-manager-frontend/
├── types/
│   └── index.ts                 # All TypeScript interfaces and enums
├── lib/
│   ├── axios.ts                 # Axios instance with auth
│   └── api.ts                   # API service functions
├── components/
│   ├── Sidebar.tsx              # Reusable sidebar component (30% width)
│   ├── UserForm.tsx             # User create/update form
│   ├── TaskForm.tsx             # Task create/update form
│   ├── ProjectForm.tsx          # Project create/update form
│   └── TeamForm.tsx             # Team create/update form
└── app/
    └── example/
        └── page.tsx             # Example usage
```

## 🚀 Quick Start

### 1. View the Example Page

Visit `/example` to see all forms in action:

```bash
npm run dev
# Open http://localhost:4000/example
```

### 2. Using Forms in Your Pages

```tsx
'use client';

import { useState } from 'react';
import UserForm from '@/components/UserForm';

export default function YourPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button onClick={() => setShowForm(true)}>Create User</button>

      <UserForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          // Refresh your data
          console.log('User created!');
        }}
      />
    </>
  );
}
```

## 📝 Form Components

### UserForm

**Fields:**

- Email (required)
- Password (required for create, optional for update)
- Name (required)
- Role (optional: ADMIN, MANAGER, MEMBER)

**API:**

- Create: `POST /users`
- Update: `PATCH /users/:id`

**Usage:**

```tsx
// Create mode
<UserForm
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  onSuccess={() => refreshData()}
/>

// Update mode
<UserForm
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  user={existingUser}
  onSuccess={() => refreshData()}
/>
```

### TaskForm

**Fields:**

- Title (required)
- Description (optional)
- Status (optional: TODO, IN_PROGRESS, DONE)
- Project ID (required)
- Assigned To (User ID, required)
- Deadline (optional)

**API:**

- Create: `POST /tasks`
- Update: `PATCH /tasks/:id`

**Usage:**

```tsx
<TaskForm
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  task={existingTask} // Optional for update
  onSuccess={() => refreshData()}
/>
```

### ProjectForm

**Fields:**

- Name (required)
- Description (optional)
- Team ID (required)

**API:**

- Create: `POST /projects`
- Update: `PATCH /projects/:id`

**Usage:**

```tsx
<ProjectForm
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  project={existingProject} // Optional for update
  onSuccess={() => refreshData()}
/>
```

### TeamForm

**Fields:**

- Name (required)
- Owner ID (User ID, required)

**API:**

- Create: `POST /teams`
- Update: `PATCH /teams/:id`

**Usage:**

```tsx
<TeamForm
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  team={existingTeam} // Optional for update
  onSuccess={() => refreshData()}
/>
```

## 🛠️ API Service

All API calls are centralized in `lib/api.ts`:

```tsx
import { userApi, taskApi, projectApi, teamApi } from '@/lib/api';

// Users
await userApi.getAll();
await userApi.getById(id);
await userApi.create(data);
await userApi.update(id, data);
await userApi.delete(id);

// Tasks
await taskApi.getAll();
await taskApi.create(data);
// ... etc

// Projects
await projectApi.getAll();
await projectApi.create(data);
// ... etc

// Teams
await teamApi.getAll();
await teamApi.create(data);
// ... etc
```

## 🎨 Sidebar Features

- **30% width** with minimum 400px
- **Slides from left to right**
- **Dark mode support**
- **Backdrop overlay**
- **Close on Escape key**
- **Close on backdrop click**
- **Smooth animations**

## 🔒 Authentication

The axios instance automatically adds the JWT token from localStorage:

```tsx
// The token is automatically added to all requests
const token = localStorage.getItem('token');
```

## 📦 TypeScript Types

All types are in `types/index.ts`:

```tsx
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
  Task,
  CreateTaskDto,
  TaskStatus,
  Project,
  Team,
  // ... etc
} from '@/types';
```

## 🎯 Features

✅ **Create & Update** for all entities  
✅ **Sliding sidebar UI** (30% width)  
✅ **API endpoint display** on each form  
✅ **Error handling** with user feedback  
✅ **Loading states** on form submission  
✅ **Dark mode support**  
✅ **Form validation** (required fields, email format, password length)  
✅ **TypeScript** for type safety  
✅ **Organized structure** for easy maintenance

## 🔄 Complete Example: User CRUD

```tsx
'use client';

import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { User } from '@/types';
import UserForm from '@/components/UserForm';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    const response = await userApi.getAll();
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await userApi.delete(id);
    fetchUsers();
  };

  return (
    <div>
      <button onClick={handleCreate}>Create User</button>

      <div>
        {users.map((user) => (
          <div key={user.id}>
            <span>{user.name}</span>
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))}
      </div>

      <UserForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
```

## 🎨 Customization

### Change Sidebar Width

Edit [components/Sidebar.tsx](components/Sidebar.tsx):

```tsx
// Change from w-[30%] to your preferred width
<div className="w-[40%] min-w-[500px]">
```

### Customize Colors

All forms use Tailwind classes. Change the button colors:

```tsx
// Blue button
className = 'bg-blue-600 hover:bg-blue-700';

// Green button
className = 'bg-green-600 hover:bg-green-700';
```

## 📱 Responsive Design

The sidebar is responsive but optimized for desktop. For mobile, consider:

```tsx
// Make sidebar full width on mobile
<div className="w-full md:w-[30%] md:min-w-[400px]">
```

---

**Built with Next.js 16 + TypeScript + Tailwind CSS** 🚀
