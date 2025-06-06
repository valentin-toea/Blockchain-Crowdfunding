# 🌍 Blockchain Funding — A Web3 Crowdfunding Platform

Blockchain Funding is a full-stack crowdfunding platform built on **Web3 and Supabase**, where users can **explore, support, and create projects backed by smart contracts**. It integrates blockchain for secure, transparent transactions and includes rich analytics and community features.

Demo: https://blockchain-crowdfunding-56031.web.app/

Test account:

Email:admin@admin.com

Password:admin

> ⚠️ **Note**: In the demo version, smart contract features are disabled as they were deployed only on a local development network.

---

## 🚀 Features

### 👥 Users

- Create an account and link your wallet
- View and search for active crowdfunding projects
- Donate to projects with a minimum contribution
- Comment on campaigns and ask questions
- Save or back campaigns to your personal dashboard

### 🎯 Project Creators

- Launch campaigns with images, goal amounts, deadlines, and reward tiers
- Track donations and backers via a creator dashboard
- View live analytics and growth trends with visual graphs
- Receive **success predictions** using **ARIMA time-series forecasting**
- Use **early funding requests** via smart contracts with voting from backers

### 💬 Social & Community

- Built-in **commenting system** on each campaign
- Donators can leave feedback or ask creators questions
- Creators can engage with their backers directly

---

## 🛠️ Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Frontend   | React, Redux, Radix UI (custom components) |
| Backend    | Supabase (PostgreSQL, Auth, Storage)       |
| Blockchain | Solidity Smart Contract (local testnet)    |
| Analytics  | ARIMA forecasting for project prediction   |

---

## 🔐 Smart Contract Functionality

- **Donation logic** is handled via a Solidity smart contract
- **Early payout requests** allow creators to request funds before the campaign ends
- **Backer voting system** determines if the requested funds can be released

> ⚠️ **Note**: In the demo version, smart contract features are disabled as they were deployed only on a local development network.

---

## 🧪 Local Development

### 🧷 Requirements

- Node.js ≥ 16.x
- Supabase project (for backend)
- MetaMask or similar wallet (for local blockchain testing)

---

### ⚙️ Setup Instructions

1. **Clone the repository:**

Create a .env file in the root directory and add the following:

REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co

REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key

```bash
npm install
npm run start
```
