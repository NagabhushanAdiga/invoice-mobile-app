require('dotenv').config();

const required = ['MONGODB_URI', 'JWT_SECRET'];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Copy .env.example to .env and set the values.');
    process.exit(1);
  }
}

module.exports = { validateEnv };
