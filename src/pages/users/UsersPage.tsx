import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  UserPlus,
  RefreshCw,
  Mail,
  Building,
  Trash2,
} from 'lucide-react';
import { userService } from '../../api/services/user.service';
import { queryKeys } from '../../api/queryKeys';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { usePermissions } from '../../hooks/usePermissions';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, type Column } from '../../components/ui/Table';
import { Badge, type BadgeVariant } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import type { User } from '../../types/auth.types';

export const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { can } = usePermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Pagination hook
  const {
    page,
    pageSize,
    totalPages,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
  } = usePagination({
    totalItems: 30,
    initialPage: 1,
    initialPageSize: 5,
  });

  // TanStack Query for users data
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: queryKeys.users.list({ page, limit: pageSize, search: debouncedSearch }),
    queryFn: ({ signal }) =>
      userService.getUsers(
        { page, limit: pageSize, search: debouncedSearch },
        signal
      ),
  });

  // TanStack Mutation for creating a user
  const createMutation = useMutation({
    mutationFn: (newUser: Partial<User>) => userService.createUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      setIsCreateModalOpen(false);
    },
  });

  // Table Columns Definition
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary font-bold flex items-center justify-center text-xs shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-text-primary text-sm leading-tight">{user.name}</div>
            <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (user) => (
        <span className="text-xs text-text-secondary flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5 text-text-muted" />
          {user.department || 'General'}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      align: 'center',
      render: (user) => {
        const variant: BadgeVariant =
          user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'primary' : 'secondary';
        return (
          <Badge variant={variant} size="sm">
            {user.role.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (user) => {
        const isOnline = user.status === 'active';
        return (
          <Badge
            variant={isOnline ? 'success' : user.status === 'pending' ? 'warning' : 'outline'}
            size="sm"
            dot
          >
            {user.status.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'Joined Date',
      align: 'right',
      render: (user) => (
        <span className="text-xs text-text-muted font-mono">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'manager' | 'user'>('user');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'active',
      department: 'Engineering',
    });
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Compact Unified Action & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-theme border border-border shadow-xs">
        {/* Left: Search input & count pill */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              size="sm"
            />
          </div>

          <span className="text-xs text-text-muted whitespace-nowrap hidden md:inline">
            Total: <strong className="text-text-primary font-semibold">{data?.meta.totalItems ?? 0}</strong> members
          </span>

          {selectedRowKeys.length > 0 && (
            <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-theme text-primary text-xs font-semibold whitespace-nowrap">
              <span>{selectedRowKeys.length} selected</span>
              {can('users:delete') && (
                <button
                  type="button"
                  onClick={() => setSelectedRowKeys([])}
                  className="hover:underline text-danger flex items-center gap-0.5 ml-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>

          {can('users:write') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<UserPlus className="h-3.5 w-3.5" />}
            >
              Add Member
            </Button>
          )}
        </div>
      </div>

      {/* Generic Table Component */}
      <Table<User>
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        selectable
        selectedRowKeys={selectedRowKeys}
        onSelectRows={setSelectedRowKeys}
        emptyMessage="No users match the search criteria"
      />

      {/* Compact Pagination Controls */}
      <div className="flex items-center justify-between px-1 text-xs text-text-muted">
        <div>
          Showing page <span className="font-semibold text-text-primary">{page}</span> of{' '}
          <span className="font-semibold text-text-primary">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={!canPrevPage}
            onClick={prevPage}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={!canNextPage}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Member"
        description="Add a new member to your workspace with role-based access."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <Input
            label="Full Name"
            placeholder="e.g. Jane Foster"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="jane@enterprise.io"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />

          <Select
            label="Assigned Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as 'admin' | 'manager' | 'user')}
            options={[
              { label: 'Standard User (Read-only)', value: 'user' },
              { label: 'Team Manager (Read + Write)', value: 'manager' },
              { label: 'Administrator (Full Access)', value: 'admin' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createMutation.isPending}
            >
              Save Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default UsersPage;
