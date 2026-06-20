# WealthOS Home 🏠💰

> **Smart Financial Management for Home & Business** — The all-in-one platform to track, analyze, and optimize your personal and business finances.
>
> [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
> [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
> [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)
> [![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://cloudflare.com)
>
> ---
>
> ## ✨ Features
>
> ### 🏡 Home Financial Management
> - **Smart Bank Statement Import** — Upload PDF/CSV from your bank or credit card; AI auto-categorizes every transaction
> - - **Learning Categorization Engine** — Once you classify a transaction, the system remembers and auto-classifies it forever
>   - - **Monthly Dashboard** — Full picture of income vs expenses, savings potential, and trends
>     - - **Cash Transactions** — Manually add cash income/expenses alongside digital records
>       - - **Recurring Payments** — Auto-detect and track monthly subscriptions, utilities, and standing orders
>        
>         - ### 🏢 Business Module
>         - - **Business Profiles** — Add one or more businesses linked to your account
>           - - **Business Expense Tracking** — Separate or mixed bank accounts — all unified in one view
>             - - **Business Income** — Log revenue, invoices, and irregular income streams
>               - - **Combined View** — See your full financial picture: home + business together
>                
>                 - ### 🏘️ Assets & Properties
>                 - - **Property Management** — Add owned real estate with value tracking
>                   - - **Rental Income** — Track rental payments per property
>                     - - **Mortgage Tracking** — Monitor outstanding balance, monthly payments, interest rates
>                      
>                       - ### 💳 Loans & Liabilities
>                       - - **Loan Register** — Track all personal and business loans
>                         - - **Amortization View** — See remaining balance, monthly cost, total interest
>                           - - **Early Payoff Simulator** — Calculate savings from early repayment
>                            
>                             - ### 🤖 AI-Powered Insights
>                             - - **Savings Opportunities** — AI identifies where you can cut costs
>                               - - **Monthly Summary Report** — Automated end-of-month analysis
>                                 - - **Budget Forecasting** — Predict next month based on historical patterns
>                                   - - **Anomaly Detection** — Alert when unusual spending detected
>                                    
>                                     - ---
>
> ## 🛠️ Tech Stack
>
> | Layer | Technology |
> |-------|------------|
> | Frontend | Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI |
> | Backend | Supabase (PostgreSQL + Auth + Storage + Realtime) |
> | API / Edge | Cloudflare Workers |
> | AI | OpenAI GPT-4o (document parsing + insights) |
> | Design System | Antigravity Design |
> | Hosting | Cloudflare Pages |
>
> ---
>
> ## 🗄️ Database Schema Overview
>
> ```
> users → profiles
> profiles → businesses (1:many)
> profiles → properties (1:many)
> profiles → loans (1:many)
> profiles → accounts (bank/credit, 1:many)
> accounts → transactions (1:many)
> transactions → categories (many:1)
> categories → auto_rules (learning engine)
> properties → rental_income (1:many)
> properties → mortgages (1:1)
> ```
>
> ---
>
> ## 🚀 Getting Started
>
> ```bash
> # Clone the repository
> git clone https://github.com/mlegostudio/wealthos-home.git
> cd wealthos-home
>
> # Install dependencies
> npm install
>
> # Copy environment variables
> cp .env.example .env.local
>
> # Run development server
> npm run dev
> ```
>
> ### Environment Variables
>
> ```env
> NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
> NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
> SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
> OPENAI_API_KEY=your_openai_key
> CLOUDFLARE_ACCOUNT_ID=your_cf_account_id
> ```
>
> ---
>
> ## 📁 Project Structure
>
> ```
> wealthos-home/
> ├── app/                    # Next.js 14 App Router
> │   ├── (auth)/             # Authentication pages
> │   ├── (dashboard)/        # Main app pages
> │   │   ├── overview/       # Monthly dashboard
> │   │   ├── transactions/   # Transaction management
> │   │   ├── business/       # Business module
> │   │   ├── properties/     # Assets & properties
> │   │   ├── loans/          # Loans & liabilities
> │   │   └── insights/       # AI insights
> │   └── api/                # API routes
> ├── components/             # Reusable UI components
> │   ├── ui/                 # Shadcn/UI components
> │   ├── charts/             # Financial charts
> │   ├── forms/              # Form components
> │   └── layout/             # Layout components
> ├── lib/
> │   ├── supabase/           # Supabase client & types
> │   ├── ai/                 # OpenAI integration
> │   ├── parsers/            # Bank statement parsers
> │   └── utils/              # Utility functions
> ├── supabase/
> │   ├── migrations/         # Database migrations
> │   └── seed.sql            # Initial seed data
> └── workers/                # Cloudflare Workers
>     ├── statement-parser/   # PDF/CSV processing
>     └── insights-engine/    # AI insights generation
> ```
>
> ---
>
> ## 🎨 Design System
>
> Designed with **Antigravity** — premium design system featuring:
> - Dark/Light mode with financial-grade color palette
> - - Glassmorphism UI components
>   - - Responsive mobile-first layout
>     - - Micro-animations for data transitions
>       - - Hebrew RTL support
>        
>         - ---
>
> ## 📊 Key User Flows
>
> 1. **Monthly Import Flow**: Upload statement → AI parses → Review unknowns → Confirm → Dashboard updated
> 2. 2. **First-Time Setup**: Create profile → Add accounts → Add business (optional) → Add properties/loans
>    3. 3. **Insights Flow**: View dashboard → AI suggestions → Drill down into category → Set budget goal
>      
>       4. ---
>      
>       5. ## 🗺️ Roadmap
>      
>       6. - [ ] v1.0 — Core transactions, import, categorization
> - [ ] v1.1 — Business module
> - [ ] - [ ] v1.2 — Properties & loans
> - [ ] - [ ] v1.3 — AI insights engine
> - [ ] - [ ] v2.0 — Mobile app (React Native)
> - [ ] - [ ] v2.1 — Bank API direct connection (Open Banking)
>
> - [ ] ---
>
> - [ ] *Built with ❤️ by mlegostudio*
