"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isDisabled = useMemo(() => {
    return loading || !username.trim() || !password;
  }, [loading, username, password]);

  const normalizeError = (message?: string) => {
    switch (message) {
      case "AUTH_FAILURE":
      case "INVALID_CREDENTIALS":
        return "Invalid username or password.";
      case "SYSTEM_ERROR_RETRY":
        return "System error. Please try again.";
      case "TOO_MANY_ATTEMPTS":
        return "Too many attempts. Please wait and try again.";
      default:
        return message || "Unable to sign in.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      setError("Username and password are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          password,
        }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setError(normalizeError(data?.error));
        return;
      }

      if (data?.token && data?.expiresAt) {
        try {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("adminTokenExpiry", String(data.expiresAt));
        } catch {}
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("System error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black overflow-hidden flex flex-col lg:flex-row">
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white !important;
          -webkit-box-shadow: 0 0 0px 1000px black inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Left Section */}
      <section className="lg:w-1/2 border-r border-white/10 relative p-8 md:p-16 flex flex-col justify-between min-h-[42vh] lg:min-h-screen bg-black overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            className="absolute -top-24 -left-24 h-72 w-72 rounded-full border border-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-[-6rem] right-[-6rem] h-96 w-96 rounded-full border border-white/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.div
          className="z-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="group flex items-center gap-2 w-fit">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              whileHover={{ scale: 2.8 }}
              transition={{ duration: 0.35 }}
            />
            <span className="text-[10px] font-mono tracking-[0.6em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
              System_Home
            </span>
          </Link>
        </motion.div>

        <div className="relative z-10">
          <motion.h1
            className="text-[15vw] lg:text-[12vw] font-[1000] leading-[0.7] tracking-[-0.08em] uppercase select-none text-white"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            CORE
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}
            >
              P
            </span>
            ORTAL
          </motion.h1>

          <motion.div
            className="mt-8 flex items-center gap-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            <motion.div
              className="h-[1px] w-12 bg-white"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            />
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.4em]">
              Root_Access_Sequence Active
            </p>
          </motion.div>
        </div>

        <motion.div
          className="z-10 font-mono text-[9px] opacity-30 uppercase tracking-[0.2em] space-y-1 hidden md:block text-white"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          <p>Encrypted_Tunnel: AES-256</p>
          <p>Admin_Node: Primary_Socket</p>
          <p>Status: Awaiting_Authorization...</p>
        </motion.div>
      </section>

      {/* Right Section */}
      <section className="lg:w-1/2 relative p-8 md:p-16 flex flex-col justify-center bg-black overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1 }}
        />

        <motion.div
          className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-md w-full mx-auto space-y-16 relative z-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key={error}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-[10px] font-mono text-white tracking-widest uppercase border border-white/20 p-4 bg-white/5"
                >
                  Warning: {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white opacity-0 group-focus-within:opacity-100 transition-all">
                01
              </span>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ADMIN_ID"
                className="w-full bg-transparent border-b border-white/10 py-6 text-2xl font-light tracking-[0.18em] outline-none focus:border-white transition-all placeholder:text-white/20 text-white"
                required
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </motion.div>

            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
            >
              <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white opacity-0 group-focus-within:opacity-100 transition-all">
                02
              </span>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="SECURE_PASS"
                className="w-full bg-transparent border-b border-white/10 py-6 text-2xl font-light tracking-[0.18em] outline-none focus:border-white transition-all placeholder:text-white/20 text-white"
                required
                autoComplete="current-password"
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            disabled={isDisabled}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.5 }}
            whileHover={!isDisabled ? { y: -2 } : undefined}
            whileTap={!isDisabled ? { scale: 0.995 } : undefined}
            className="w-full h-24 border border-white/10 relative group overflow-hidden flex items-center justify-center transition-all hover:border-white disabled:opacity-30 disabled:cursor-not-allowed bg-black"
          >
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ y: "100%" }}
              whileHover={!isDisabled ? { y: "0%" } : undefined}
              transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            />

            <AnimatePresence mode="wait">
              <motion.span
                key={loading ? "loading" : "idle"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 text-[11px] font-black tracking-[1em] uppercase text-white"
              >
                {loading ? "DECRYPTING..." : "AUTHORIZE"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.p
            className="text-center text-[9px] font-mono opacity-40 tracking-widest uppercase cursor-default text-white"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.5 }}
          >
            Master Override Portal
          </motion.p>
        </motion.form>
      </section>
    </main>
  );
}

