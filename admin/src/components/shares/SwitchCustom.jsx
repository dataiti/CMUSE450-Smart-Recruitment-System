import { Switch } from "@material-tailwind/react";

const SwitchCustom = ({ _id = "", isChecked = true, onChange }) => {
  return (
    <Switch
      id={_id}
      ripple={true}
      checked={isChecked}
      onChange={onChange}
      className="h-full w-full checked:bg-[#2ec946]"
      containerProps={{
        className: "w-11 h-6",
      }}
      circleProps={{
        className: "before:hidden left-0.5 border-none",
      }}
    />
  );
};

export default SwitchCustom;
