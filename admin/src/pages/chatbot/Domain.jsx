import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import jsyaml from "js-yaml";

import {
  useReadDomainDataQuery,
  useWriteDomainDataMutation,
} from "../../redux/features/apis/rasas/domainApi";
import { ButtonCustom, Loading } from "../../components/shares";
import { HeaderChatbot, YamlEditor } from "../../components/chatbot";

const Domain = () => {
  const [yamlValue, setYamlValue] = useState("");

  const { data: domainData, isFetching } = useReadDomainDataQuery();
  const [writeDomainData, { isLoading }] = useWriteDomainDataMutation();

  useEffect(() => {
    if (domainData && domainData.data) {
      setYamlValue(jsyaml.dump(domainData.data));
    }
  }, [domainData]);

  // Hàm xử lý gọi API ghi file domain.yml
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
        <HeaderChatbot title="domain.yml" />
        <div className="h-[calc(660px-120px)] overflow-y-auto">
          <YamlEditor yamlValue={yamlValue} setYamlValue={setYamlValue} />
        </div>
        <div className="h-[60px] border-t border-blue-gray-300 flex justify-end p-2">
          <ButtonCustom onClick={handleWriteDomainFile}>Lưu</ButtonCustom>
        </div>
      </div>
    </div>
  );
};

export default Domain;
