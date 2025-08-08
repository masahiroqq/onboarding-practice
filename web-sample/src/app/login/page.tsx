"use client";
import { useState } from 'react';
import styles from '@/styles/page/login.module.scss';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json();
      console.log(data)

      if (!res.ok) {
        // APIからのエラーメッセージを表示
        setError(data.message || '認証中にエラーが発生しました');
      } else {
        setMessage(data.message);
      }
    } catch (err: any) {
      setError('通信エラーが発生しました');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.heading}>ログイン</h1>

        <label className={styles.label}>
          ユーザーID
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className={styles.input}
            placeholder="YourUserID"
            required
          />
        </label>

        <label className={styles.label}>
          パスワード
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Password"
            required
          />
        </label>

        <button type="submit" className={styles.button}>
          ログイン
        </button>

        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
