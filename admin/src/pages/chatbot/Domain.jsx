import React from "react";
import { useState, useEffect } from "react";
import { YamlEditor } from "../../components/chatbot";
import { Typography } from "@material-tailwind/react";
import {
  useReadDomainDataQuery,
  useWriteDomainDataMutation,
} from "../../redux/features/apis/rasas/domainApi";
import { Loading } from "../../components/shares";
import { toast } from "react-toastify";
import jsyaml from "js-yaml";

const Domain = () => {
  const [yamlValue, setYamlValue] = useState("");

  const { data: domainData, isFetching } = useReadDomainDataQuery();
  const [writeDomainData, { isLoading }] = useWriteDomainDataMutation();

  useEffect(() => {
    if (domainData && domainData.data) {
      setYamlValue(jsyaml.dump(domainData.data));
    }
  }, [domainData]);

  const handleChange = (newValue) => {
    try {
      setYamlValue(newValue);
    } catch (error) {
      console.error("YAML Error:", error.message);
      toast.error("Sai cu phap kia");
    }
  };

  const handleWriteDomainFile = async () => {
    try {
      const res = await writeDomainData({ data: jsyaml.load(yamlValue) });
      if (res && res.success) {
        toast.success("Lưu file domain.yml thành công !");
      }
    } catch (error) {}
  };

  return (
    <div className="h-screen w-full p-10">
      {(isFetching || isLoading) && <Loading />}
      <div className="h-[660px] bg-white rounded-md">
        <div className="h-[60px] border-b border-blue-gray-300 px-4 flex items-center">
          <Typography className="text-gray-600 font-bold">
            domain.yml
          </Typography>
        </div>
        <div className="h-[calc(660px-120px)] overflow-y-auto">
          <YamlEditor
            yamlValue={yamlValue}
            setYamlValue={setYamlValue}
            handleChange={handleChange}
          />
        </div>
        <div className="h-[60px] border-t border-blue-gray-300 flex justify-end p-2">
          <button
            className="px-6 py-1 rounded-md bg-blue-gray-900 text-sm font-bold text-white"
            onClick={handleWriteDomainFile}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Domain;
