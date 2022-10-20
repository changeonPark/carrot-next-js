import useUser from "libs/client/useUser";
import Image from "next/image";
import Link from "next/link";

const MiniProfile = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center mt-4 space-x-3">
      <div className="relative w-16 h-16">
        <Image
          src={`https://imagedelivery.net/GxMj85p4NcJHzSbEXoeCfQ/${user?.avatar}/avatar`}
          layout="fill"
          alt="avatar"
          className="rounded-full"
        />
      </div>

      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{user?.name}</span>
        <Link href="/profile/edit">
          <a className="text-sm text-gray-700">Edit profile &rarr;</a>
        </Link>
      </div>
    </div>
  );
};

export default MiniProfile;
