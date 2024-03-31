import * as yup from "yup";

export const jobSchema = yup.object().shape({
  recruitmentCampaignName: yup
    .string()
    .required("Vui lòng nhập tên chiến dịch tuyển dụng"),
  jobPosition: yup.string().required("Vui lòng nhập vị trí tuyển dụng"),
  province: yup.string().required("Vui lòng nhập tỉnh/thành phố"),
  district: yup.string().required("Vui lòng nhập quận/huyện"),
  ward: yup.string().required("Vui lòng nhập phường/xã"),
  exactAddress: yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
  recruitmentTitle: yup
    .string()
    .required("Vui lòng nhập tiêu đề tin tuyển dụng"),
  industry: yup.string().required("Vui lòng chọn ngành nghề chính"),
  vacancyCount: yup
    .number()
    .typeError("Số lượng tuyển phải là số")
    .positive("Số lượng tuyển phải là số dương")
    .integer("Số lượng tuyển phải là số nguyên")
    .required("Vui lòng nhập số lượng tuyển"),
  jobType: yup.string().required("Vui lòng chọn loại công việc"),
  gender: yup.string().required("Vui lòng chọn giới tính"),
  level: yup.string().required("Vui lòng chọn cấp bậc"),
  experience: yup.string().required("Vui lòng chọn kinh nghiệm"),
  currencyType: yup.string().required("Vui lòng chọn loại tiền tệ"),
  salaryType: yup.string().required("Vui lòng chọn kiểu lương"),
  salaryFrom: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương"),
  salaryTo: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương"),
  jobDescription: yup.string().required("Vui lòng nhập mô tả công việc"),
  candidateRequirements: yup
    .string()
    .required("Vui lòng nhập mô tả yêu cầu ứng viên"),
  candidateBenefits: yup
    .string()
    .required("Vui lòng nhập mô tả quyền lợi ứng viên"),
  applicationDeadline: yup.string().required("Vui lòng nhập hạn chót nhận CV"),
  receiverFullName: yup
    .string()
    .required("Vui lòng nhập họ và tên người nhận CV"),
  receiverEmail: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập địa chỉ email người nhận CV"),
  receiverPhone: yup
    .string()
    .required("Vui lòng nhập số điện thoại người nhận CV"),
});
