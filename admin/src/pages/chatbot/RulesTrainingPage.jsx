import React, { useEffect, useState } from "react";
import { FlowRules, ListRules, YamlEditor } from "../../components/rasas";
import {
  useGetRulesDataQuery,
  useDeleteRuleMutation,
  useUpdateRuleMutation,
} from "../../redux/features/apis/rasaApi";
import jsyaml from "js-yaml";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setListRules,
  rulesSelect,
  updateRuleItem,
  removeRuleItem,
} from "../../redux/features/slices/rulesRasaSlice";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { Loading } from "../../components/shares";

const RulesTrainingPage = () => {
  const dispatch = useDispatch();

  const { listRules, selectRule } = useSelector(rulesSelect);

  const { data: rulesData } = useGetRulesDataQuery();
  const [updateRule, { isLoading }] = useUpdateRuleMutation();
  const [deleteRule, { isLoading: isLoadingDelete }] =
    useDeleteRuleMutation();

  const [yamlValue, setYamlValue] = useState("");

  const handleChange = (newValue) => {
    try {
      jsyaml.load(newValue);
      setYamlValue(newValue);
    } catch (error) {
      console.error("YAML Error:", error.message);
      toast.error("Sai cu phap kia");
    }
  };

  useEffect(() => {
    if (rulesData?.data) {
      dispatch(setListRules({ data: rulesData?.data }));
      setYamlValue(jsyaml.dump(selectRule));
    }
  }, [rulesData, dispatch, setYamlValue, selectRule]);

  const handleUpdateRule = async () => {
    try {
      const res = await updateRule({
        data: jsyaml.load(yamlValue),
        ruleName: selectRule?.rule,
      });
      if (res && res.data) {
        console.log(res);
        dispatch(updateRuleItem({ data: res?.data?.data }));
        toast.success("Lưu rule thành công");
      }
    } catch (error) {}
  };

  const handleAddRule = async () => {
    try {
    } catch (error) {}
  };

  const handleDeleteRule = async () => {
    try {
      const res = await deleteRule({
        ruleName: selectRule?.rule,
      });
      if (res && res.data) {
        dispatch(removeRuleItem({ data: res?.data?.data }));
        toast.success("Xoá rule thành công");
      }
    } catch (error) {}
  };

  return (
    <div className="w-full flex bg-white">
      {(isLoading || isLoadingDelete) && <Loading />}
      <div className="w-[20%] h-screen">
        <ListRules data={listRules} setYamlValue={setYamlValue} />
      </div>
      <div className="w-[80%] h-screen">
        <div className="h-[60px] flex items-center gap-4 border-b px-6 border-blue-gray-200">
          <input
            placeholder="Tìm kiếm rules"
            className="bg-blue-gray-100 outline-none border-none text-sm px-4 py-2 rounded-full w-full placeholder:text-sm placeholder:font-bold placeholder:text-gray-600"
            spellCheck={false}
          />
          <button
            className="text-green-500 hover:text-green-800"
            onClick={handleAddRule}
          >
            <icons.IoAddCircle size={32} />
          </button>
        </div>

        <div className="grid grid-cols-2">
          <div className=" border-r border-blue-gray-200">
            <div className="h-[60px] flex items-center justify-between gap-4 border-b px-6 border-blue-gray-200">
              <Typography className="font-bold text-blue-gray-900">
                {selectRule?.rule}
              </Typography>
              <div className="flex items-center gap-2">
                <button
                  className="text-blue-500 hover:text-blue-800"
                  onClick={handleUpdateRule}
                >
                  <icons.IoIosSave size={30} />
                </button>
                <button
                  className="text-red-500 hover:text-red-800"
                  onClick={handleDeleteRule}
                >
                  <icons.MdDeleteForever size={34} />
                </button>
              </div>
            </div>
            <div className="h-[calc(100vh-120px)]">
              <YamlEditor
                yamlValue={yamlValue}
                setYamlValue={setYamlValue}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className="h-[calc(100vh-60px)] overflow-y-auto">
            <FlowRules steps={selectRule?.steps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesTrainingPage;
