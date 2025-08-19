// components/sections/contact/FormContact.tsx
import { card } from "../../../styles/card.css";
import { container } from "../../../styles/container.css";
import { center } from "../../../styles/center.css";
import * as styles from "../../../styles/contact/FormContact.css";
import React, { useState } from "react";
import { motion, type Variants, type Transition, useReducedMotion } from "framer-motion";

export function FormContact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Toate câmpurile sunt obligatorii.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error();
      }
    } catch {
      setStatus("error");
    }
  };

  // Framer Motion
  const reduceMotion = useReducedMotion();
  const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, when: "beforeChildren", staggerChildren: 0.06 } },
  };
  const groupVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  };

  const isSending = status === "sending";
  const nameErrId = "err-name";
  const emailErrId = "err-email";
  const msgErrId = "err-message";
  const formMsgId = "form-status";

  return (
    <section className={`${container} ${center}`}>
      <motion.div
        className={card}
        variants={reduceMotion ? undefined : containerVariants}
        initial={reduceMotion ? undefined : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
      >
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-busy={isSending}                        // ✅ status form
          aria-describedby={formMsgId}
          noValidate
        >
          <motion.div className={styles.group} variants={reduceMotion ? undefined : groupVariants}>
            <label htmlFor="name" className={styles.label}>Nume</label>
            <input
              className={styles.input}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
              aria-invalid={!!error && !form.name.trim()}       // ✅ a11y
              aria-describedby={!!error && !form.name.trim() ? nameErrId : undefined}
            />
            {!!error && !form.name.trim() && (
              <span id={nameErrId} className={styles.error}>Completează numele.</span>
            )}
          </motion.div>

          <motion.div className={styles.group} variants={reduceMotion ? undefined : groupVariants}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              aria-invalid={!!error && !form.email.trim()}
              aria-describedby={!!error && !form.email.trim() ? emailErrId : undefined}
            />
            {!!error && !form.email.trim() && (
              <span id={emailErrId} className={styles.error}>Introdu o adresă de email.</span>
            )}
          </motion.div>

          <motion.div className={styles.group} variants={reduceMotion ? undefined : groupVariants}>
            <label htmlFor="message" className={styles.label}>Mesaj</label>
            <textarea
              className={styles.textarea}
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              aria-invalid={!!error && !form.message.trim()}
              aria-describedby={!!error && !form.message.trim() ? msgErrId : undefined}
            />
            {!!error && !form.message.trim() && (
              <span id={msgErrId} className={styles.error}>Te rugăm să scrii mesajul.</span>
            )}
          </motion.div>

          {/* Live region pentru mesaje de stare */}
          <div id={formMsgId} role="status" aria-live="polite" style={{ minHeight: 20 }}>
            {status === "success" && <div className={styles.success}>Mesaj trimis cu succes!</div>}
            {status === "error" && <div className={styles.error}>Eroare la trimitere. Încearcă din nou.</div>}
            {error && <div className={styles.error}>{error}</div>}
          </div>

          <motion.button
            type="submit"
            className={styles.button}
            disabled={isSending}
            variants={reduceMotion ? undefined : groupVariants}
          >
            {isSending ? "Se trimite..." : "Trimite"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

export default FormContact;
