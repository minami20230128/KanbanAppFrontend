import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TaskDetail = () => {
  const { status } = useParams();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("2025-07-31");
  const [dueDate, setDueDate] = useState("2025-08-01");
  const [condition, setCondition] = useState("");
  const [memo, setMemo] = useState("");

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await axios.post(`/api/tasks/new`, {
        title,
        startDate,
        dueDate,
        condition,
        memo,
        status,
      });
      alert("登録しました");
      navigate("/");
    } catch (err) {
      console.error("登録に失敗", err);
      alert("登録に失敗しました");
    }
  };

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>新規タスク登録</h1>

      <div style={styles.formGroup}>
        <label htmlFor="title">タイトル</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="startDate">開始日</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="dueDate">期限</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="completionCondition">完了条件</label>
        <input
          type="text"
          id="completionCondition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="例：レビュー済みであること"
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="notes">メモ</label>
        <textarea
          id="notes"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="自由記入欄（タスクの詳細や補足など）"
          style={styles.textarea}
        />
      </div>

      <div
        style={{
          ...styles.buttonGroup,
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <div style={styles.buttonGroup}>
          <button onClick={handleSave} style={styles.button}>
            保存
          </button>
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={handleReturn} style={styles.button}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
    padding: "20px",
    fontFamily: "sans-serif",
    backgroundColor: "#f9fafb",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.5em",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1em",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1em",
    boxSizing: "border-box",
    resize: "vertical",
  },
  buttonGroup: {
    textAlign: "center",
    marginTop: "20px",
  },
  button: {
    background: "#3182ce",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1em",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
