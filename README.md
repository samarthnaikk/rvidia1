# ⚡ RVIDIA — A Distributed Computing System

> **RVIDIA** is a distributed computing platform that allows multiple computers to **combine their processing power**.  
> When one computer is slow or overloaded, RVIDIA divides its task into smaller parts and distributes them to other connected computers, making the overall execution **faster and more efficient**.

---

## 💡 Why This Project?

In most college labs, personal laptops, or even office setups, computers are often **unevenly powerful** —  
some are idle, while others struggle to handle heavy workloads like **AI models**, **data simulations**, or **video processing**.

That’s when the idea of **RVIDIA** was born:

> “What if every computer in a network could help another — by lending its unused processing power?”

The goal was simple:  
Build a system where **multiple low-end computers work together as one high-end system**,  
without needing expensive servers or supercomputers.

---

## 🔍 How It Works (Simplified)

RVIDIA works on the principle of **distributed computing** — breaking one big task into smaller chunks and processing them **in parallel** across multiple computers.

### 🧩 Step-by-Step Breakdown

1. **Task Submission**  
   A user submits a heavy computation task (like matrix operations or an AI model training) through the web dashboard.

2. **Task Division**  
   The central controller (called the **Master Node**) splits this large task into smaller independent chunks.

3. **Distribution via WebSockets**  
   These chunks are sent to different computers (**Worker Nodes**) that are connected to the network using **real-time WebSocket connections**.

4. **Parallel Processing**  
   Each Worker Node executes its assigned chunk locally — using its CPU or GPU — and sends the result back to the Master Node.

5. **Aggregation**  
   The Master Node collects all partial results and combines them into the final output.

6. **Display & Storage**  
   The completed results are then shown on the **Next.js dashboard** and stored through the **Flask backend**.

> 💬 In simple words, RVIDIA works like a team:  
> Instead of one computer doing 100% of the work, 5 computers do 20% each — together finishing the job much faster.

---

## ⚙️ How It’s Technically Possible

RVIDIA is built on top of several technologies that make this distributed communication and computation **realistic and efficient**:

| Component               | Role                                                                | Technologies Used    |
| ----------------------- | ------------------------------------------------------------------- | -------------------- |
| **Master Node**         | Coordinates all worker computers, assigns tasks, aggregates results | Node.js + WebSockets |
| **Worker Nodes**        | Execute tasks received from the master and send results back        | Python / Node.js     |
| **Backend**             | Handles APIs, logging, and data storage                             | Flask (Python)       |
| **Frontend**            | Provides dashboards for users and admins to monitor systems         | Next.js (React)      |
| **Communication Layer** | Maintains persistent, real-time two-way data exchange               | WebSockets           |
| **Environment**         | Isolates and manages worker execution environments                  | Docker               |

### 🔌 WebSockets — The Backbone

RVIDIA uses **WebSockets** for continuous two-way communication between computers.  
Unlike normal HTTP requests, WebSockets stay **always open**, so both the Master and Workers can send data instantly — like how chat apps send messages in real time.

This allows:

- Sending sub-tasks without restarting the connection each time.
- Receiving live progress updates.
- Automatically detecting disconnected workers.

---

## 🔬 Real-Life Example

Let’s say you’re training an **AI model** that takes 1 hour on a slow laptop.

With RVIDIA:

1. The laptop becomes the **Master Node**.
2. It connects to 4 other idle computers on the same network.
3. The training data is split into 5 equal parts.
4. Each computer trains its portion for 12 minutes.
5. RVIDIA collects the results and merges them — finishing the full training in ~12–15 minutes.

The same logic applies to:

- Simulations 🧪
- File compression 📦
- Image rendering 🎨
- Data analysis 📊

---

## 🧩 System Overview
