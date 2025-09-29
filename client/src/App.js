import React from "react";
import FileUpload from "./FileUpload";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>📤 Advanced File Uploader</h1>
        <p>Upload your files securely to the cloud with real-time validation and metadata tracking</p>
      </header>
      <main className="app-main">
        <FileUpload />
      </main>
      <footer className="app-footer">
        <p>© 2024 File Uploader - Deekshith R Prabhu</p>
      </footer>
    </div>
  );
}

export default App;
