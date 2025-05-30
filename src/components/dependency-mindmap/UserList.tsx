
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
}

interface UserListProps {
  collaborators?: Collaborator[] | null;
}

const UserList: React.FC<UserListProps> = ({ collaborators }) => {
  const userList = Array.isArray(collaborators) ? collaborators : [];
  
  if (userList.length === 0) {
    return <div className="text-gray-500 text-sm">No collaborators</div>;
  }

  return (
    <div className="flex -space-x-2">
      {userList.map((user) => (
        <Avatar key={user.id} className="h-6 w-6 border-2 border-white">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ))}
      {userList.length > 5 && (
        <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
          +{userList.length - 5}
        </div>
      )}
    </div>
  );
};

export default UserList;
