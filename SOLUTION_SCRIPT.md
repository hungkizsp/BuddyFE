# BollyEnglish - Kịch Bản Trình Bài Giải Pháp

> **Dành cho nhà đầu tư, mentor, và buổi trình bày sản phẩm**
> Mỗi phần tương ứng trực tiếp với một tính năng đang hoạt động trong sản phẩm.

---

## 1. VẤN ĐỀ (30 giây)

**"Trẻ biết từ vựng tiếng Anh nhưng sợ mở miệng nói."**

- Ứng dụng tiếng Anh truyền thống tập trung vào đọc và chạm — không phải nói
- Trẻ thuộc từ vựng nhưng không ghép được câu trong giao tiếp thật
- Phụ huynh bỏ tiền cho gia sư nhưng trẻ vẫn không chịu nói
- Các ứng dụng hiện tại giống bài tập hơn là trò chơi

**Khoảng trống:** Chưa có sản phẩm nào kết hợp *đồng hành cảm xúc* + *luyện nói có hướng dẫn* + *trải nghiệm giống game* cho trẻ 5–12 tuổi.

---

## 2. GIẢI PHÁP

> **"BollyEnglish giúp trẻ dám mở miệng nói tiếng Anh — thông qua một người bạn đồng hành cảm xúc tên Bolly."**

BollyEnglish là nền tảng web giúp trẻ 6–10 tuổi luyện nói tiếng Anh tại nhà. Thay vì bài tập truyền thống, trẻ chơi game với Bolly — một nhân vật ảo hoạt động như người bạn đồng hành.

**BollyEnglish hoạt động theo 4 bước:**

```
Bolly đưa nhiệm vụ → Trẻ tương tác → Hệ thống phản hồi → Bolly ăn mừng hoặc khuyến khích trẻ thử lại
```

Điểm quan trọng: **Trẻ KHÔNG cần nói hoàn hảo ngay từ đầu.** Ở Level 1, trẻ chỉ cần click — không cần nói. Từ Level 2 trở đi, trẻ có thể nói tên đồ vật qua microphone. Hệ thống kiểm tra trẻ có nói đúng từ không — không chấm điểm phát âm. Giảm áp lực → trẻ dám nói → rồi dần cải thiện.

---

## 3. DEMO SẢN PHẨM

### Màn hình thực tế trông như thế nào?

Mỗi level có layout 3 cột:

```
┌──────────────────┬──────────────────────────┬──────────────────┐
│   SIDEBAR TRÁI   │      PHÒNG CHÍNH         │  PANEL PHẢI      │
│                  │                          │                  │
│  ← Nút quay lại  │   10 vật phẩm rải        │  XP + Coins      │
│  Tên level       │   trong phòng            │  Badge (locked)  │
│  Buddy avatar 😊 │                          │  Next Up         │
│  bubble chat     │   Buddy 😊 trong phòng   │  Buddy's Hint    │
│                  │                          │                  │
│  📋 Missions     │   Feedback toast         │                  │
│  ☐ Tìm đồ ăn    │   (hiển thị khi click)   │                  │
│  ☐ Tìm đồ uống  │                          │                  │
│                  │                          │                  │
│  📚 Từ mới       │   Gợi ý ở dưới          │                  │
│  Eat (v.)        │                          │                  │
│  Drink (n./v.)   │                          │                  │
│  Hungry (adj.)   │                          │                  │
│  Breakfast (n.)  │                          │                  │
└──────────────────┴──────────────────────────┴──────────────────┘
```

---

### Ví dụ minh họa — Siêu Thị Mua Sắm (Phải nói mới qua được)

Đây là level trẻ **phải nói tiếng Anh** mới tiến bộ được. Không chỉ click là qua.

**Code reference:** `src/features/adventure/pages/SupermarketShoppingPage.jsx`

**Bước 1 — Buddy đưa nhiệm vụ:**

Trẻ thấy siêu thị với các quầy: quầy rau, tủ lạnh, quầy thịt. Buddy nói:

> "Let's go shopping! Find the items on the checklist!"

Trẻ click vào quầy → mở ra hình ảnh quầy thật. Trẻ click đúng mặt hàng trên danh sách.

**Bước 2 — Đến bước voice mission, click KHÔNG còn dùng được:**

Buddy nói:

> "Hãy hỏi nhân viên quầy khu vực thịt ở đâu!"

Trên màn hình hiện câu cần nói:

> "Say: excuse me, where is the meat counter"

Trẻ nhấn nút **"🎙️ Bấm để nói"** → microphone bật lên → trẻ phải **nói câu đó thành tiếng**.

**Bước 3 — Hệ thống nhận diện:**

Azure Speech SDK nghe và trả về 4 điểm:
- Phát âm (Pronunciation): 85
- Chính xác (Accuracy): 82
- Lưu loát (Fluency): 78
- Đầy đủ (Completeness): 90

Hệ thống check: **Accuracy >= 80 AND Fluency >= 80**? → Nếu đủ → **Đạt**. Nếu chưa → "Thử lại".

**Bước 4 — Bolly phản hồi:**

Nếu đạt:

> "Tuyệt vời! Quầy thịt ở bên trái!"
> +15 XP, ngôi sao sáng lên, confetti bay

Nếu chưa đạt:

> "Cố gắng lên! Thử lại nhé."
> Trẻ được phép nói lại — không bị phạt, không bị trừ điểm.

**Script trình bày:**

> "Đây là Siêu Thị Mua Sắm. Level đầu tiên trẻ PHẢI nói. Click tìm hàng trên danh sách vẫn dùng được, nhưng đến bước hỏi đường — click không còn hiệu quả. Trẻ phải mở miệng. Và nếu nói chưa đúng? Được nói lại. Không phạt. Không chấm điểm. Chỉ khuyến khích."

---

### Keyword Matching — Vì sao trẻ phải nói?

```
Level 1-2:    Click items      → Không cần nói
Level 3-4:    Click + Speak    → Nói tên đồ vật (Web Speech API)
Kitchen:      Drag & Drop      → Talking Tom echo (background)
Supermarket:  Voice Mission    → PHẢI nói câu đầy đủ (Azure Speech SDK)
Restaurant:   Voice Order      → PHẢI nói câu order (Azure + AI ngữ nghĩa)
```

**Logic ở Supermarket:** Click tìm hàng được, nhưng bước "hỏi đường" → click không qua được. Trẻ bắt buộc phải nói. Hệ thống nghe và chấm — nhưng cho phép nói lại không giới hạn.

**Script trình bày:**

> "Keyword Matching đơn giản là: trẻ nói 'excuse me, where is the meat counter', hệ thống check câu có chứa đúng nội dung không. Không cần phát âm hoàn hảo. Chỉ cần nói được câu có nghĩa. Và trẻ được nói lại bao nhiêu lần cũng được."

---

### Ba yếu tố giá trị

```
1. ĐỒNG HÀNH CẢM XÚC         2. LUYỆN NÓI THẬT              3. TRÒ CHƠI THẬT
   Bolly là bạn, không         Trẻ nói qua micro,              XP, coin, ngôi sao,
   phải thầy giáo.             hệ thống nghe và               confetti, 3D worlds,
   Trẻ giúp Bolly,             phản hồi tức thì.              nhạc nền — tất cả
   không làm bài tập.          Không chỉ đọc/viết.            tạo cảm giác chơi game.
```

**Script trình bày:**

> "Ba yếu tố này kết hợp lại tạo ra trải nghiệm mà trẻ muốn quay lại mỗi ngày — không phải vì bị bắt buộc, mà vì Bolly đang chờ."

---

## 4. MỨC ĐỘ KHÓ TĂNG DẦU (1 phút)

```
Level 1: Click tìm đồ ăn         → Nhận diện từ vựng (không nói)
Level 2: Nói tên đồ vật          → Nói đơn giản (Web Speech API)
Level 3: Kéo thả + echo           → Tương tác vật lý + nói vui (Talking Tom)
Level 4: Điều hướng siêu thị      → Câu giao tiếp tình huống + hotspot (Azure)
Level 5: Gọi món nhà hàng        → Ghép câu hoàn chỉnh + hiểu ngữ nghĩa (AI)
```

**Script trình bày:**

> "Chúng tôi không yêu cầu trẻ nói từ ngày đầu. Level 1 chỉ click — zero áp lực. Đến Level 5, trẻ đang hình thành câu hoàn chỉnh trong nhà hàng. Tiến độ ẩn trong mắt trẻ. Trẻ chỉ nghĩ mình đang chơi game."

---

## 5. CÔNG NGHỆ (1 phút)

| Lớp | Công nghệ | Tại sao chọn |
|-----|-----------|-------------|
| **Nhận diện giọng nói** | Azure Cognitive Services Speech SDK | Đánh giá phát âm hàng đầu, chính xác từng phoneme |
| **Nhân vật 3D** | React Three Fiber + Three.js | Render 3D real-time trong browser, không cần cài app |
| **Tạo nhân vật AI** | Meshy AI API | Tạo mô hình 3D từ văn bản cho nhân vật cá nhân hóa |
| **Chat AI** | Backend LLM | Luyện nói giao tiếp với phản hồi ngữ cảnh |
| **Frontend** | React + Vite + Tailwind CSS | Web app nhanh, hiện đại |
| **Backend** | Java Spring Boot | Quản lý kịch bản, theo dõi tiến độ |

**Script trình bày:**

> "Chúng tôi chọn Azure Speech vì nó cho phép đánh giá từng phoneme — không chỉ 'đúng/sai' mà biết chính xác âm nào cần cải thiện. Và tất cả chạy trong browser. Không cần app store, không cần download. Chỉ cần mở link."

---

## 6. GIÁ TRỊ CỐT LÕI

> **"Giúp trẻ dám mở miệng nói tiếng Anh — thông qua một người bạn đồng hành cảm xúc."**

**Ba trụ cột:**
1. **Đồng hành cảm xúc** — Bolly là bạn, không phải thầy giáo. Trẻ giúp Bolly, không làm bài tập.
2. **Luyện nói không áp lực** — Click trước, nói sau. Keyword matching trước, phát âm sau. Thử lại không giới hạn.
3. **Trải nghiệm giống game** — XP, coin, streaks, thế giới 3D, phần thưởng confetti. Cảm giác như đang chơi.

---

## 7. ƯU THẾ CẠNH TRANH

| so với Duolingo | so với ELSA | so với Gia sư |
|----------------|------------|--------------|
| Tập trung vào NÓI, không phải chạm | Giảm rào cản (keyword matching trước) | Scale đến hàng nghìn trẻ |
| Đồng hành 3D với cảm xúc | Làm cho vui (Talking Tom, confetti) | Sẵn sàng 24/7, chất lượng ổn định |
| Phiêu lưu có cốt truyện | Tập trung trẻ 6–10 | Phù hợp khả năng chi trả gia đình |
| Không cần cài app | Khuyến khích, không phạt | Dữ liệu học tập có phân tích |

---

## 8. LỘ TRÌNH PHÁT TRIỂN

1. **Dashboard phụ huynh** — Theo dõi tiến độ, từ vựng đã học, sự cải thiện phát âm
2. **Thêm thế giới** — Vương quốc Động vật, Trạm Vũ trụ, Đại dương
3. **Chơi đa người** — Trẻ luyện nói cùng nhau, Bolly làm trung gian
4. **Chế độ ngoại tuyến** — Các level cơ bản hoạt động không cần internet
5. **Nội dung premium** — Kịch bản nâng cao, ôn thi, kể chuyện

---

## 9. LỜI KẾT

> "BollyEnglish không phải là một app học tiếng Anh khác. Đây là sản phẩm đầu tiên kết hợp đồng hành AI cảm xúc với đánh giá phát âm thật, bọc gói trong một trò chơi mà trẻ thực sự muốn chơi.
>
> Chúng tôi không dạy tiếng Anh. Chúng tôi cho trẻ một lý do để nói nó.
>
> Mỗi tương tác được thiết kế quanh một câu hỏi: **Trẻ có muốn quay lại ngày mai không?**
>
> Đó là sự khác biệt giữa bài tập và một người bạn."

---

*Tài liệu được tạo từ phân tích mã nguồn BuddyFE. Tất cả tính năng được đề cập đều đã triển khai và hoạt động.*
