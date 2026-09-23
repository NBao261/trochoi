import type { Question } from './types'

export const QUESTIONS: Question[] = [
  {
    id: 8,
    prompt: 'Phương châm thực hiện dân chủ ở cơ sở tại Việt Nam hiện nay gồm những nội dung nào?',
    options: {
      A: 'Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng',
      B: 'Dân biết, dân bàn, dân làm, dân tự quyết, dân chịu trách nhiệm',
      C: 'Dân bàn, dân làm, dân nộp thuế, dân tuân thủ',
      D: 'Dân bầu cử, dân đóng góp, dân theo dõi, dân hưởng thụ',
    },
    correct: 'A',
    explanation: 'Phương châm đầy đủ nhấn mạnh cả quyền tham gia, giám sát và thụ hưởng của nhân dân.',
  },
  {
    id: 9,
    prompt: 'Nhân dân bầu đại biểu Quốc hội và Hội đồng nhân dân các cấp là hình thức dân chủ nào?',
    options: {
      A: 'Dân chủ trực tiếp',
      B: 'Dân chủ gián tiếp (dân chủ đại diện)',
      C: 'Dân chủ nguyên thủy',
      D: 'Dân chủ phi thể chế',
    },
    correct: 'B',
    explanation: 'Người dân thực hiện quyền lực thông qua các đại biểu do mình bầu ra.',
  },
  {
    id: 10,
    prompt: 'Điều 4 Hiến pháp năm 2013 khẳng định vai trò nào của Đảng Cộng sản Việt Nam?',
    options: {
      A: 'Là lực lượng lãnh đạo Nhà nước và xã hội',
      B: 'Là tổ chức chính trị tham gia tranh cử định kỳ',
      C: 'Là cơ quan hành chính nhà nước cao nhất',
      D: 'Là cơ quan xét xử tư pháp tối cao',
    },
    correct: 'A',
    explanation: 'Điều 4 xác định Đảng Cộng sản Việt Nam là lực lượng lãnh đạo Nhà nước và xã hội.',
  },
  {
    id: 11,
    prompt: 'Khác biệt căn bản về bản chất chính trị giữa dân chủ XHCN và dân chủ tư sản là gì?',
    options: {
      A: 'Dân chủ XHCN nhất nguyên do Đảng Cộng sản lãnh đạo; dân chủ tư sản đa nguyên, đa đảng',
      B: 'Dân chủ XHCN không dùng pháp luật; dân chủ tư sản dùng pháp luật',
      C: 'Dân chủ tư sản phục vụ đại đa số; dân chủ XHCN phục vụ thiểu số',
      D: 'Dân chủ XHCN bãi bỏ hoàn toàn các cuộc bầu cử',
    },
    correct: 'A',
    explanation: 'Sự khác biệt nằm ở bản chất giai cấp và cơ chế tổ chức quyền lực chính trị.',
  },
  {
    id: 12,
    prompt: 'Vì sao quan điểm “phải đa đảng mới có dân chủ” không đúng về lý luận và thực tiễn?',
    options: {
      A: 'Số lượng đảng không quyết định bản chất dân chủ; cốt lõi là quyền lực thuộc về ai và phục vụ ai',
      B: 'Các quốc gia đa đảng đều không tổ chức bầu cử',
      C: 'Chế độ một đảng không bao giờ có bất kỳ hạn chế nào',
      D: 'Đa đảng chỉ tồn tại trong thời kỳ phong kiến',
    },
    correct: 'A',
    explanation: 'Bản chất dân chủ được đánh giá qua chủ thể nắm quyền lực và lợi ích mà quyền lực phục vụ.',
  },
  {
    id: 13,
    prompt: 'Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam được tổ chức và hoạt động theo nguyên tắc cốt lõi nào?',
    options: {
      A: 'Tam quyền phân lập',
      B: 'Tập trung dân chủ',
      C: 'Tự do tuyệt đối',
      D: 'Phân quyền khép kín',
    },
    correct: 'B',
    explanation: 'Tập trung dân chủ là nguyên tắc cốt lõi trong tổ chức và hoạt động của bộ máy nhà nước.',
  },
  {
    id: 14,
    prompt: 'Luận điệu “đa nguyên chính trị, đa đảng đối lập” ở Việt Nam được cổ xúy nhằm mục đích gì?',
    options: {
      A: 'Mở rộng quyền làm chủ thực sự cho nhân dân lao động',
      B: 'Thực hiện “diễn biến hòa bình”, xóa bỏ vai trò lãnh đạo của Đảng và chế độ XHCN',
      C: 'Thúc đẩy tăng trưởng kinh tế nhanh hơn',
      D: 'Nâng cao trình độ dân trí cho người dân',
    },
    correct: 'B',
    explanation: 'Mục tiêu được xác định là tác động đến vai trò lãnh đạo của Đảng và nền tảng của chế độ XHCN.',
  },
  {
    id: 15,
    prompt: 'Trong nền dân chủ XHCN ở Việt Nam, dân chủ có vị trí thế nào với sự phát triển đất nước?',
    options: {
      A: 'Vừa là mục tiêu, vừa là động lực của sự phát triển đất nước',
      B: 'Chỉ là công cụ hình thức',
      C: 'Là yếu tố phụ thuộc hoàn toàn vào bên ngoài',
      D: 'Tách rời khỏi kỷ cương và pháp luật',
    },
    correct: 'A',
    explanation: 'Dân chủ vừa định hướng kết quả cần đạt, vừa tạo động lực huy động sức dân cho phát triển.',
  },
]
