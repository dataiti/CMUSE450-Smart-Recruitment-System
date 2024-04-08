import React from "react";
import { FlowStories, ListStories, YamlEditor } from "../../components/rasas";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { 
  Input,
  Button,
  Select, 
  Option} from "@material-tailwind/react";

import { icons } from "../../utils/icons";
import { Loading } from "../../components/shares";

const NLUTrainingPage = () => {
  return (
  <div className="w-full flex bg-white">
      <div className="w-[20%] h-screen">
        NLU.yml
      </div>
      <div className="w-[80%] h-screen">
        <div className="h-[60px] flex items-center gap-4 border-b px-6 border-blue-gray-200">
          <input
            placeholder="Tìm kiếm NLU"
            className="bg-blue-gray-100 outline-none border-none text-sm px-4 py-2 rounded-full w-full placeholder:text-sm placeholder:font-bold placeholder:text-gray-600"
            spellCheck={false}
          />
          <button
            className="text-green-500 hover:text-green-800"          
          >
            <icons.IoAddCircle size={32} />
          </button>
        </div>

        <div className="grid grid-cols-2">
          
      </div>

      <div className="w-[100%] ">
        <div className="h-[60px] flex items-center gap-4 border-b px-6 border-blue-gray-200">
          <div className="w-[70%]">
            <Input label="Nhập một câu để thêm nó vào dữ liệu huấn luyện" />
          </div>
          <div className="flex items-center gap-4">
          <Button variant="outlined" className="rounded-full">
            Hủy bỏ
          </Button>
          <Button className="rounded-full">Nhập</Button>
    </div>
        </div>       
    </div>
    <div>
    <div className="w-[100%] flex">
    <div className="w-[40%]"> <h2>Sentence</h2> </div>
    <div className="w-[60%]"> <h2>Intent</h2> </div>
    </div>
    <div className="w-[100%] flex hover:bg-slate-100">
        <div className="w-[40%]">         
        <div class="inline-flex items-center">
  <label class="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
    <input type="checkbox"
      class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
      id="check" />
    <span
      class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
        stroke="currentColor" stroke-width="1">
        <path fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"></path>
      </svg>
    </span>
  </label>
  <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="check">
    Hello anh long đạt
  </label>
</div> 
        </div>
        <div className="w-[40%]">
        <div className="w-72">
        {/* <Input label="Nhập intent" /> */}
      <Select label="Chọn itent">
        <Option>Material Duyệt HTML</Option>
        <Option>Material Tuấn React</Option>
        <Option>Material Trí Vue</Option>
      </Select>
    </div>
        </div>
        <div className="w-[20%] flex ">
        <button
            className="text-current hover:text-green-500"       
          >
            <icons.IoCheckmarkCircleOutline size={35} />
          </button>
          <button
            className="text-current hover:text-slate-800"          
          >
            <icons.IoTrash   size={35} />
          </button>
        </div>
      </div>
    </div>
      
    </div>
    </div>
  )
  
};

export default NLUTrainingPage;
