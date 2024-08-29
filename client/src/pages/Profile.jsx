import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

const Profile = () => {
  const user = useSelector((state) => state.user.userData);
  const [userFiles, setUserFiles] = useState([]);
  const userId = user._id;

  useEffect(() => {
    const getUserFiles = async () => {
      try {
        const result = await axios.get(`http://localhost:6969/notes/getFiles/${userId}`);
        console.log(result.data);
        setUserFiles(result.data.data);
      } catch (error) {
        console.error("Error fetching user files:", error);
      }
    };

    getUserFiles();
  }, [userId]);

  const numberofFiles = userFiles.length;

  return (
    <div className="lg:h-heightWithoutNavbar flex flex-col items-center justify-center lg:flex-row">
      <div className="flex w-full flex-col items-center justify-center py-4 lg:h-full lg:w-[40%]">
        <div className="grid h-[200px] w-[200px] place-content-center overflow-hidden rounded-full bg-gray-400 text-2xl font-black">
          <img src={user.profileImage || "/path/to/placeholder.jpg"} alt="userprofile" />
        </div>
        <div className="my-2 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-black">
            <span>{user.firstName}</span> <span>{user.lastName}</span>
          </h2>
          <p className="mt-1 text-center">{user.userName}</p>
          <p className="mt-1 text-center">{user.userBio}</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="grid h-[80px] w-[100px] place-content-center">
            <p className="text-center text-[12px] font-bold">No. of Uploads :</p>
            <p className="text-center text-5xl font-black">{numberofFiles}</p>
          </div>
          <span className="h-[60px] w-[1px] bg-gray-400" />
        </div>
      </div>
      <div className="h-auto w-full p-5 lg:h-full lg:w-[60%]">
        <h1 className="mb-3 text-xl font-black">My Documents :</h1>
        <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 md:grid-cols-3">
          {userFiles.map((file) => (
            <a
              href={`http://localhost:6969/files/${file.files}`}
              key={file._id}
              className="mb-3 flex h-[35px] max-w-[250px] items-center justify-between gap-10 rounded-xl border border-black px-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="font-semibold">{file.fileName}</p>
              <FaExternalLinkAlt />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
