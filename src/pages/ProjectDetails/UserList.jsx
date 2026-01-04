import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserList = () => {
  return (
    <div className="space-y-2">
      <div className="border rounded-md bg-gray-700 text-white">
        <p className="py-2 px-3">
          {"Hostor143" || "Unassignee"}
        </p>
      </div>

      {[1, 1, 1, 1].map((item, index) => (
        <div key={index} className="py-2 px-3 flex items-center space-x-2 bg-gray-700 cursor-pointer">
          <Avatar>
            <AvatarFallback className="bg-gray-900 text-white">
              B
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm leading-none text-white">Bhavani Prasad</p>
            <p className="text-sm text-muted-foreground-white ">@Bhavani Prasad</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
