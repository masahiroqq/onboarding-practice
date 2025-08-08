"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/styles/page/login.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setError((data as any).message || "認証中にエラーが発生しました");
        setSubmitting(false);
        return;
      }

      setMessage((data as any).message ?? "ログインしました");

      const rawFrom = sp.get("from");
      const safeFrom =
        rawFrom && rawFrom.startsWith("/") && !rawFrom.startsWith("//")
          ? rawFrom
          : "/";

      const destination =
        safeFrom === "/login" || (safeFrom && safeFrom.startsWith("/login?"))
          ? "/"
          : safeFrom;

      router.replace(destination);
    } catch {
      setError("通信エラーが発生しました");
      setSubmitting(false);
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
            onChange={(e) => setUserId(e.target.value)}
            className={styles.input}
            placeholder="YourUserID"
            required
            autoComplete="username"
            disabled={submitting}
          />
        </label>

        <label className={styles.label}>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Password"
            required
            autoComplete="current-password"
            disabled={submitting}
          />
        </label>

        <button type="submit" className={styles.button} disabled={submitting}>
          {submitting ? "送信中..." : "ログイン"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}