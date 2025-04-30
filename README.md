# Reflexions-Dashboard

A modern, adaptive dashboard for analyzing and improving reflective writing, built with Next.js and TypeScript.
This project implements research-backed design principles for feedback, transparency, and adaptive user experience.

---

## Features

- **Adaptive Dashboard:** Three feedback levels (Einfach, Standard, Detailliert) for different user needs and experience levels.
- **KPI Visualization:** Clean, interactive KPI overview with radar and bar charts.
- **Personalized Feedback:** AI-driven, context-aware feedback and reflection prompts.
- **Transparency:** System info and methodology explanations for advanced users.
- **Responsive UI:** Modern, accessible design with mobile support.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

- Edit pages in `src/app/`
- Main dashboard: `src/app/dashboard/page.tsx`
- Settings: `src/app/settings/page.tsx`
- Reflections: `src/app/reflections/`

---

## Project Structure

```
webapp/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── reflections/
│   │   ├── settings/
│   │   └── ...
│   └── components/
├── public/
├── package.json
└── README.md
```

---

## Design Principles

TDB

## Environment Variables Setup

To use the AI analysis features, you need to set up the following environment variables:

### OpenAI Configuration

The application uses OpenAI API for qualitative analysis of reflections.

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add the following to your `.env.local` file:

```
OPENAI_API_KEY=your-openai-api-key
```

### Google Cloud Natural Language API Configuration

The application uses Google Cloud Natural Language API for quantitative analysis of reflections.

1. Create a Google Cloud project and enable the Natural Language API
2. Create a service account with access to Natural Language API
3. Configure your environment using one of these methods:

#### Option 1: Using a service account key file

Create a service account key file and specify its path:

```
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-file.json
```

#### Option 2: Using service account credentials as environment variables

Extract the credentials from your service account key file:

```
GOOGLE_CLIENT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Content\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your-google-cloud-project-id
```

⚠️ Note: When using the private key in environment variables, make sure the newline characters (`\n`) are preserved correctly.

#### Option 3: Using JSON credentials as a string

Paste the entire service account JSON as a string:

```
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project-id","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYour Private Key Content\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@project-id.iam.gserviceaccount.com","client_id":"client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40project-id.iam.gserviceaccount.com"}
```

The application will automatically use the best available authentication method.