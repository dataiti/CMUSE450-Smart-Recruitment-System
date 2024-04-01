import React, { useEffect, useState } from "react";
import { FlowStories, Search, YamlEditor } from "../../components/chatbot";
import {
  useAddRuleMutation,
  useDeleteRuleMutation,
  useGetAllRulesDataQuery,
  useUpdateRuleMutation,
  useGetRuleQuery,
} from "../../redux/features/apis/rasas/rulesApi";
import jsyaml from "js-yaml";
import { toast } from "react-toastify";
import { Input, Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { Loading } from "../../components/shares";
import Swal from "sweetalert2";

const Rules = () => {
  const [searchValue, setSearchValue] = useState("");
  const [ruleValue, setRuleValue] = useState("");
  const [isAddRuleForm, setIsAddRuleForm] = useState(false);
  const [rulesValue, setRulesValue] = useState([]);
  const [selectedRule, setSelectedRule] = useState("");
  const [ruleItem, setRuleItem] = useState("");

  const { data: rulesData, isFetching } = useGetAllRulesDataQuery({});
  const { data: ruleData, isLoading } = useGetRuleQuery(
    { ruleName: selectedRule },
    { refetchOnMountOrArgChange: true }
  );
  const [addRule] = useAddRuleMutation();
  const [deleteRule] = useDeleteRuleMutation();
  const [updateRule] = useUpdateRuleMutation();

  useEffect(() => {
    if (rulesData && rulesData.data) {
      setRulesValue(rulesData.data);
      setSelectedRule(rulesData.data[0] && rulesData.data[0].rule);
      setIsAddRuleForm(false);
    }
  }, [rulesData]);

  useEffect(() => {
    try {
      if (ruleData && ruleData.data) {
        setIsAddRuleForm(false);
        setRuleItem(jsyaml.dump(ruleData.data));
      }
    } catch (error) {
      toast.error("Sai cu phap kia");
    }
  }, [selectedRule, ruleData]);

  const handleChange = (newValue) => {
    try {
      jsyaml.load(newValue);
      setRuleItem(newValue);
    } catch (error) {
      console.error("YAML Error:", error.message);
      toast.error("Sai cu phap kia");
    }
  };

  const handleSaveRule = async () => {
    try {
      const data = jsyaml.load(ruleItem);
      if (isAddRuleForm) {
        const res = await addRule({ data });
        if (res && res.data && res.data.success) {
          setRulesValue((prev) => {
            if (!prev.find((item) => item?.rule === res.data.data.rule)) {
              return [...prev, res.data.data];
            }
            return prev;
          });
          toast.success("Thêm story thành công");
        }
      } else {
        const res = await updateRule({ data, ruleName: selectedRule });
        if (res && res.data && res.data.success) {
          toast.success("Lưu story thành công");
        }
      }
    } catch (error) {}
  };

  const handleDeleteRule = async () => {
    try {
      Swal.fire({
        title: "Bạn có chắc không ?",
        text: "Bạn sẽ không thể hoàn tác điều này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0B5345 ",
        cancelButtonColor: "#A93226",
        confirmButtonText: "Vâng, xoá !",
        cancelButtonText: "Huỷ",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await deleteRule({ ruleName: selectedRule });
          if (res && res.data && res.data.success) {
            setRulesValue((prev) =>
              prev.filter((item) => item.rule !== selectedRule)
            );
            setSelectedRule(rulesValue[0] && rulesValue[0].rule);
            setRuleItem("");
            toast.success("Xoá thành công");
          }
        }
      });
    } catch (error) {}
  };

  return (
    <div className="w-full flex flex-col bg-white">
      {(isFetching || isLoading) && <Loading />}
      <div className="h-[60px] flex w-full border-b border-blue-gray-300">
        <div className="flex items-center justify-center w-[20%] h-full border-r border-blue-gray-300">
          <Typography className="font-bold">Rules</Typography>
        </div>
        <div className="w-[80%]">
          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setIsAddForm={setIsAddRuleForm}
            placeholder="Tìm kiếm mẫu rule"
            setSelected={setSelectedRule}
            setItem={setRuleItem}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-60px)] flex w-full">
        <div className="w-[20%] h-full border-r border-blue-gray-300">
          <ul>
            {rulesValue?.map((rule, index) => {
              return (
                <li
                  key={rule?.rule}
                  className={`group p-4 flex items-center justify-between border-r-4 text-gray-700 cursor-pointer hover:bg-blue-gray-50 transition-all ${
                    rule?.rule === selectedRule
                      ? "!bg-blue-gray-100 border-blue-gray-700 text-light-blue-600"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedRule(rule?.rule)}
                >
                  <Typography className="text-sm font-bold ">
                    {rule?.rule}
                  </Typography>
                  <button
                    className="hidden group-hover:inline-block text-gray-600"
                    // onClick={() =>
                    //   handleDeleteUtter({
                    //     utterName: story?.utterName,
                    //   })
                    // }
                  >
                    <icons.MdDeleteForever size={20} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-[80%] ">
          <div className="grid grid-cols-2 h-full ">
            <div className="h-full border-r border-blue-gray-300">
              <div className="h-[60px] flex items-center gap-2 justify-between px-4 border-b border-blue-gray-300">
                {isAddRuleForm ? (
                  <Input
                    label="Thêm một story"
                    value={ruleValue}
                    onChange={(e) => setRuleValue(e.target.value)}
                  />
                ) : (
                  <Typography className="text-sm font-bold text-blue-600">
                    {selectedRule}
                  </Typography>
                )}
                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    className="border-2 border-blue-gray-800 text-blue-gray-800 bg-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-100 transition-all"
                    onClick={() => {
                      setIsAddRuleForm(false);
                      setSelectedRule(rulesData.data[0].rule);
                    }}
                  >
                    Huỷ
                  </button>
                  <button
                    className="bg-blue-gray-800 text-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-700 transition-all"
                    onClick={handleSaveRule}
                  >
                    Lưu
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={handleDeleteRule}
                  >
                    <icons.MdDeleteForever size={30} />
                  </button>
                </div>
              </div>
              <div className="h-[calc(100vh-120px)]">
                <YamlEditor
                  yamlValue={ruleItem}
                  setYamlValue={setRuleItem}
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="h-full border-r border-blue-gray-300">
              <div className="h-[60px] flex items-center border-b border-blue-gray-300">
                <Typography className="text-sm font-bold px-4">Flow</Typography>
              </div>
              <div className="h-[calc(100vh-120px)] overflow-y-auto">
                <FlowStories steps={jsyaml.load(ruleItem)?.steps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
