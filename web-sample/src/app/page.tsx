"use client";

import { useEffect, useState } from 'react';
import styles from "@/styles/page/home.module.scss";

export default function Home() {
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserInput(params.get('input') || '');
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>オペ技へ ようこそ！</h1>

        <div
          className={styles.userContent}
          dangerouslySetInnerHTML={{ __html: userInput }}
        />

        <img
          className={styles.logo}
          src="logo.png"
          alt="Company Logo"
        />

      </div>
    </div>
  );
}