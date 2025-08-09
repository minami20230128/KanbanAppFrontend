import { BrowserRouter, Route, Routes } from "react-router-dom";
import TaskBoard from "./TaskBoard";
import TaskDetail from "./TaskDetail";
import TaskRegister from "./TaskRegister";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskBoard />} />
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
        <Route path="/tasks/new/:status" element={<TaskRegister />} />
      </Routes>
    </BrowserRouter>
  );
}
