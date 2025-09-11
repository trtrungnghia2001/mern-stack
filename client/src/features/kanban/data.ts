import type { IBoard } from "./types/board.type";
import type { IColumn } from "./types/column.type";
import type { IFile, ITask, ITodo } from "./types/task.type";

// export const boards: IBoard[] = [
//   {
//     _id: "650c829c8a84511a7a67f197",
//     name: "Project Management",
//     favorite: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: "650c82a48a84511a7a67f198",
//     name: "Personal Tasks",
//     favorite: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: "650c90008a84511a7a67f201",
//     name: "Learning",
//     favorite: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: "650c90108a84511a7a67f202",
//     name: "Work Ideas",
//     favorite: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: "650c90208a84511a7a67f203",
//     name: "Shopping List",
//     favorite: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ];

// export const columns: IColumn[] = [
//   {
//     _id: "650c82b08a84511a7a67f199",
//     name: "Todo",
//     board: "650c829c8a84511a7a67f197",
//     position: 1,
//     bgColor: 0,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: "650c82bc8a84511a7a67f19a",
//     name: "In Progress",
//     board: "650c829c8a84511a7a67f197",
//     position: 2,
//     bgColor: 1,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: "650c82c88a84511a7a67f19b",
//     name: "Done",
//     board: "650c829c8a84511a7a67f197",
//     position: 3,
//     bgColor: 6,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   // {
//   //   _id: "650c82d48a84511a7a67f19c",
//   //   name: "Ideas",
//   //   board: "650c82a48a84511a7a67f198",
//   //   position: 1,
//   //   bgColor: 2,
//   //   createdAt: new Date().toISOString(),
//   //   updatedAt: new Date().toISOString(),
//   // },
// ];
//
const defaultContent = `
<h2>Giới thiệu Project Management App</h2>
<p>
  Đây là một ứng dụng <strong>quản lý dự án</strong> được xây dựng với kiến trúc
  <em>microservices</em>, bao gồm các module <u>authentication</u>, <u>product</u>,
  và <u>favorite</u>. Ứng dụng hỗ trợ thao tác trực quan bằng
  <mark>drag & drop</mark> và quản lý công việc theo dạng <strong>Kanban board</strong>.
</p>

<h3>Tính năng chính</h3>
<ul>
  <li>Quản lý người dùng (đăng ký, đăng nhập, đăng xuất, Google OAuth)</li>
  <li>CRUD sản phẩm kèm bộ lọc và tìm kiếm</li>
  <li>Thêm sản phẩm vào danh sách yêu thích</li>
  <li>Hỗ trợ micro frontend: React (Auth) + Angular (Product)</li>
  <li>Tích hợp API Gateway với <code>Express.js</code> và <code>MongoDB</code></li>
</ul>

<h3>Hướng dẫn cài đặt</h3>
<ol>
  <li>Clone repo về máy: <code>git clone https://github.com/example/project.git</code></li>
  <li>Chạy lệnh <code>npm install</code> để cài đặt dependencies</li>
  <li>Khởi động từng service bằng <code>docker-compose up</code></li>
  <li>Mở trình duyệt tại <a href="http://localhost:3000">http://localhost:3000</a></li>
</ol>

<blockquote>
  "Năng suất không chỉ đến từ việc làm việc chăm chỉ, mà còn từ việc
  <strong>sắp xếp công việc thông minh</strong> và sử dụng công cụ hiệu quả."
</blockquote>

<h3>Code ví dụ</h3>
<pre><code class="language-js">
// Kết nối MongoDB
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
</code></pre>

<h3>Ảnh minh họa</h3>
<p>
  <img src="https://placehold.co/600x300" alt="Demo Project Screenshot" />
</p>

<p>
  Với ứng dụng này, bạn có thể dễ dàng quản lý công việc cá nhân lẫn nhóm, 
  theo dõi tiến độ dự án, và tối ưu workflow của mình.
</p>
`;
function fakeObjectId(seed: number): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  return (timestamp + seed.toString(16).padStart(16, "0")).slice(0, 24);
}
export const tasks: ITask[] = [];
const distribution = [10, 8, 7, 5];
const columnIds = [
  "650c82b08a84511a7a67f199", // Todo
  "650c82bc8a84511a7a67f19a", // In Progress
  "650c82c88a84511a7a67f19b", // Done
  "650c82d48a84511a7a67f19c", // Ideas
];

let taskIndex = 0;
distribution.forEach((count, colIdx) => {
  for (let i = 0; i < count; i++) {
    // Subtasks (todos)
    const todos: ITodo[] = Array.from({
      length: Math.floor(Math.random() * 3) + 1,
    }).map((_, j) => ({
      _id: fakeObjectId(taskIndex * 10 + j),
      name: `Subtask ${j + 1} for Task ${taskIndex + 1}`,
      complete: Math.random() > 0.5,
    }));

    // Files
    const files: IFile[] = [
      {
        _id: fakeObjectId(taskIndex * 100),
        name: `spec-doc-${taskIndex + 1}.pdf`,
        url: `https://trello.com/1/cards/68bba2ef744f68a3f0d23c09/attachments/68be91cba582fe32b6243aa9/download/davidbenzal-a886e78b.jpg`,
      },
      {
        _id: fakeObjectId(taskIndex * 100 + 1),
        name: `screenshot-${taskIndex + 1}.png`,
        url: `https://trello.com/1/cards/68bba2ef744f68a3f0d23c09/attachments/68bba2efb774915e8a4a24ec/download/2_20Email%2C_20Slack%2C_20Teams.jpg`,
      },
    ];

    tasks.push({
      _id: fakeObjectId(taskIndex),
      name: `Task ${taskIndex + 1}`,
      column: columnIds[colIdx],
      position: i + 1,
      complete: Math.random() > 0.5,
      description: defaultContent,
      files,
      todos,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    taskIndex++;
  }
});
