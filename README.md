# Getting Started with Create React App


# 🔗 Pipeline Editor React

An interactive DAG (Directed Acyclic Graph) editor built with **React**, **React Flow**, and **Dagre**. Create, connect, validate, and auto-layout data processing pipelines visually—perfect for simulating dataflows like Airflow or Prefect.

---

## 📦 Folder Structure

│
├── public/
├── src/
│ ├── App.js
│ ├── App.css
│ └── index.js
│
├── package.json
├── README.md

Architectural Notes
    useState, useCallback, useEffect used for optimal React flow
    
    Custom node types with Handle for clear connection zones
    
    DAG validation built with DFS: detects cycles and orphan nodes
    
    Layout updates and canvas zooming done via fitView()

Features
  ✅ Add Nodes with label prompt
  
  🔗 Connect Nodes with direction enforcement
  
  🚫 Prevent self-connections and invalid links
  
  🔄 Auto-layout with Dagre integration
  
  🧠 DAG validation: detects cycles, minimum nodes, connectivity
  
  🗑️ Delete nodes/edges with Delete key
  
  🎨 Hover feedback with custom styling



npm install


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


Deploy this project

https://nexstemproject.vercel.app/ 

DEMO VIDEO 

https://www.loom.com/share/dcf2cd906a0c4426bf889e8ebf4a03dc?sid=5075da89-5730-4396-b75f-2384cd88cd3e




