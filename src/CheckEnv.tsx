import React from 'react';

function CheckEnv() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">環境変数の確認</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {`FIREBASE_API_KEY: ${import.meta.env.VITE_FIREBASE_API_KEY}
FIREBASE_AUTH_DOMAIN: ${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}
FIREBASE_PROJECT_ID: ${import.meta.env.VITE_FIREBASE_PROJECT_ID}
FIREBASE_STORAGE_BUCKET: ${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}
FIREBASE_MESSAGING_SENDER_ID: ${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}
FIREBASE_APP_ID: ${import.meta.env.VITE_FIREBASE_APP_ID}`}
      </pre>
    </div>
  );
}

export default CheckEnv;