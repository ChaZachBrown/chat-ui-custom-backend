# ChatUI Custom Frontend

This is a modified version of the Hugging Face [chat-ui](https://github.com/huggingface/chat-ui) designed to interface with a custom backend for LLM (Large Language Model) projects. The purpose of this frontend is to provide a simple and efficient user interface for LLM projects, allowing users to prototype without needing to create a UI from scratch. There is an example custom backend showcasing how to interface with this application found here: __URL__

## Overview

This ChatUI application connects to a custom backend for handling agentic tasks instead of directly connecting to an LLM. It simplifies the process of building a frontend for LLM projects by providing a ready-to-use interface that can easily integrate with any backend. This frontend is not intended for deployment or scaling but serves as a tool for quick and easy integration during the development phase.

### Features

- **User Interface**: A clean and intuitive interface for interacting with backend services.
- **Modularity**: Easily integrate with various backend services by modifying the connection module.
- **Prototyping**: Designed to expedite the development process for LLM projects by providing a ready-made frontend.

## Installation

### Prerequisites

- Node.js and npm installed

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd chatui-frontend
2. **Modify .env.local:**
  Modify this to connect to the proper MongoDB and custom backend
3. **Start the MongoDB:**
  ```docker run -d -p 27017:27017 --name mongo-chatui mongo:latest```
4. **Install dependencies:**
  ```npm install```
5. **Run**
  ```npm run dev```



### Changes made
There are several changes made is this application from the base chat-ui to allow it to connect to a custom backend. Look at the commit history to see.
