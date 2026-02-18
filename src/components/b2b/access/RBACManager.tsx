'use client';

/**
 * RBAC Manager Component (ACCS-02)
 * Multi-role RBAC assignment interface for institutional users
 */

import { useState } from 'react';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { Modal } from '@/components/shared/Modal';
import { B2BRole } from '@/lib/types/roles';
import { ColumnDef } from '@tanstack/react-table';
import { UserPlus, Shield } from 'lucide-react';

interface InstitutionalUser {
  id: string;
  name: string;
  email: string;
  roles: B2BRole[];
  status: 'Active' | 'Pending' | 'Suspended';
  lastLogin: string;
}

// Mock data
const MOCK_USERS: InstitutionalUser[] = [
  {
    id: 'b2b-rm-001-uuid-placeholder',
    name: 'Sarah Chen',
    email: 'sarah.chen@institution.com',
    roles: [B2BRole.RelationshipManager],
    status: 'Active',
    lastLogin: '2026-02-16T08:30:00Z',
  },
  {
    id: 'b2b-banker-001',
    name: 'Michael Thompson',
    email: 'michael.t@institution.com',
    roles: [B2BRole.PrivateBanker],
    status: 'Active',
    lastLogin: '2026-02-15T14:20:00Z',
  },
  {
    id: 'b2b-compliance-001',
    name: 'Jennifer Martinez',
    email: 'j.martinez@institution.com',
    roles: [B2BRole.ComplianceOfficer],
    status: 'Active',
    lastLogin: '2026-02-16T07:45:00Z',
  },
  {
    id: 'b2b-admin-001',
    name: 'David Kim',
    email: 'david.kim@institution.com',
    roles: [B2BRole.InstitutionalAdmin],
    status: 'Active',
    lastLogin: '2026-02-16T09:00:00Z',
  },
  {
    id: 'b2b-director-001',
    name: 'Elena Volkov',
    email: 'elena.v@familyoffice.com',
    roles: [B2BRole.FamilyOfficeDirector],
    status: 'Active',
    lastLogin: '2026-02-14T16:30:00Z',
  },
  {
    id: 'b2b-rm-002',
    name: 'James Anderson',
    email: 'james.anderson@institution.com',
    roles: [B2BRole.RelationshipManager],
    status: 'Active',
    lastLogin: '2026-02-15T10:15:00Z',
  },
];

const B2B_ROLE_OPTIONS = [
  B2BRole.RelationshipManager,
  B2BRole.PrivateBanker,
  B2BRole.FamilyOfficeDirector,
  B2BRole.ComplianceOfficer,
  B2BRole.InstitutionalAdmin,
  B2BRole.UHNIPortal,
];

export function RBACManager() {
  const [users, setUsers] = useState<InstitutionalUser[]>(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<InstitutionalUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: [] as B2BRole[],
  });

  const handleRowClick = (user: InstitutionalUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      roles: user.roles,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, ...formData }
          : u
      ));
    } else {
      // Add new user
      const newUser: InstitutionalUser = {
        id: `user-${Date.now()}`,
        ...formData,
        status: 'Pending',
        lastLogin: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', roles: [] });
  };

  const toggleRole = (role: B2BRole) => {
    setFormData({
      ...formData,
      roles: formData.roles.includes(role)
        ? formData.roles.filter(r => r !== role)
        : [...formData.roles, role],
    });
  };

  const columns: ColumnDef<InstitutionalUser, any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">{row.original.name}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-slate-600">{row.original.email}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map(role => (
            <span
              key={role}
              className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-sans"
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusColors = {
          Active: 'bg-teal-100 text-teal-800',
          Pending: 'bg-gold-100 text-gold-800',
          Suspended: 'bg-rose-100 text-rose-800',
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-sans ${statusColors[row.original.status]}`}
          >
            {row.original.status}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => (
        <span className="text-slate-600 text-xs">
          {new Date(row.original.lastLogin).toLocaleString()}
        </span>
      ),
      enableSorting: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl text-slate-900 mb-1">Role-Based Access Control</h3>
          <p className="font-sans text-sm text-slate-600">
            Manage institutional user role assignments ({users.length} users)
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setFormData({ name: '', email: '', roles: [] });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchColumn="name"
        searchPlaceholder="Search by name..."
        onRowClick={handleRowClick}
      />

      {/* Add/Edit User Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedUser ? 'Edit User Roles' : 'Add New User'}
        description={selectedUser ? 'Modify role assignments for this user' : 'Create a new institutional user with role assignments'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="email@institution.com"
              required
            />
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
              Assign Roles
            </label>
            <div className="space-y-2 p-3 border border-slate-200 rounded-md max-h-64 overflow-y-auto">
              {B2B_ROLE_OPTIONS.map(role => (
                <label key={role} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-2 focus:ring-rose-500"
                  />
                  <div className="flex-1">
                    <span className="font-sans text-sm text-slate-900">{role}</span>
                  </div>
                  <Shield className="w-4 h-4 text-slate-400" />
                </label>
              ))}
            </div>
            {formData.roles.length === 0 && (
              <p className="mt-1 text-xs text-rose-600 font-sans">
                At least one role must be assigned
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-md font-sans text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.roles.length === 0}
              className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
