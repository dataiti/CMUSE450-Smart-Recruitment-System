import React, { useState } from "react";

const AvatarType = ({ avatarPreview, setAvatarPreview }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    } else {
      setAvatarPreview(null);
      setSelectedFile(null);
    }

    fileInput.value = "";
  };

  return (
    <div>
      <label htmlFor="avatar" className="cursor-pointer">
        <img
          src={avatarPreview}
          alt=""
          className="hover:scale-105 transition-all rounded-md"
        />
      </label>
      <input
        type="file"
        id="avatar"
        hidden
        value={selectedFile ? selectedFile.name : ""} // Set giá trị của input
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarType;
