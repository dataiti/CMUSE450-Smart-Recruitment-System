import React from "react";

const AvatarType = ({ avatarPreview, setAvatarPreview }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
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
      <input type="file" id="avatar" hidden onChange={handleFileChange} />
    </div>
  );
};

export default AvatarType;
