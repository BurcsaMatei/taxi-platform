import { card } from "../../../styles/card.css";
import { container } from "../../../styles/container.css";
import { center } from "../../../styles/center.css";
import * as styles from "../../../styles/contact/FormContact.css";
import React, { useState } from "react";
import {
  motion,
  type Variants,
  type Transition,
  useReducedMotion,
} from "framer-motion";

export function FormContact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validare simplă doar la submit
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

  // ---- Framer Motion (variants + accesibilitate) ----
  const reduceMotion = useReducedMotion();
  const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: EASE,
        when: "beforeChildren",
        staggerChildren: 0.06,
      } as Transition,
    },
  };

  const groupVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: EASE } as Transition,
    },
  };
  // ----------------------------------------------------

  return (
    <section className={`${container} ${center}`}>
      <motion.div
        className={card}
        variants={reduceMotion ? undefined : containerVariants}
        initial={reduceMotion ? undefined : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
      >
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <motion.div
            className={styles.group}
            variants={reduceMotion ? undefined : groupVariants}
          >
            <label htmlFor="name" className={styles.label}>
              Nume
            </label>
            <input
              className={styles.input}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            className={styles.group}
            variants={reduceMotion ? undefined : groupVariants}
          >
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            className={styles.group}
            variants={reduceMotion ? undefined : groupVariants}
          >
            <label htmlFor="message" className={styles.label}>
              Mesaj
            </label>
            <textarea
              className={styles.textarea}
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
          </motion.div>

          {error && <div className={styles.error}>{error}</div>}

          <motion.button
            type="submit"
            className={styles.button}
            disabled={status === "sending"}
            variants={reduceMotion ? undefined : groupVariants}
          >
            {status === "sending" ? "Se trimite..." : "Trimite"}
          </motion.button>

          {status === "success" && (
            <div className={styles.success}>Mesaj trimis cu succes!</div>
          )}
          {status === "error" && (
            <div className={styles.error}>Eroare la trimitere. Încearcă din nou.</div>
          )}
        </form>
      </motion.div>
    </section>
  );
}

export default FormContact;
