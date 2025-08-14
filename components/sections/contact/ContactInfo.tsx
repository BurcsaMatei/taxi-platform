import React from "react";
import { motion, type Variants, type Transition, useReducedMotion } from "framer-motion";
import {
  contactGridClass,
  contactItemClass,
  cardTitleClass,
  contactIconClass,
  contactTextClass,
} from "../../../styles/contact/contactInfo.css";
import { container } from "../../../styles/container.css";

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1]; // cubic-bezier

// Variants tipate corect
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE,
      delay: i * 0.06,
    } as Transition,
  }),
};

const ContactInfo: React.FC = () => {
  const reduceMotion = useReducedMotion();

  const items: Array<{ icon: React.ReactNode; title: string; text: React.ReactNode }> = [
    {
      icon: (
        <svg className={contactIconClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.61-2.4 6.9-5 10.74C9.4 15.9 7 11.61 7 9z"
          />
          <circle fill="currentColor" cx="12" cy="9" r="2.5" />
        </svg>
      ),
      title: "Adresă",
      text: "Str. Rozelor 12, Baia Mare, Maramureș, România",
    },
    {
      icon: (
        <svg className={contactIconClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24a11.72 11.72 0 0 0 3.68.59c.56 0 1.01.45 1.01 1.01v3.59c0 .56-.45 1.01-1.01 1.01C10.07 21 3 13.93 3 5.01 3 4.45 3.45 4 4.01 4H7.6c.56 0 1.01.45 1.01 1.01 0 1.27.2 2.5.59 3.68.12.35.03.75-.24 1.02l-2.34 2.08z"
          />
        </svg>
      ),
      title: "Telefon",
      text: <a href="tel:+40751234567">+40 751 234 567</a>,
    },
    {
      icon: (
        <svg className={contactIconClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M4 4h16v16H4z" fillOpacity="0" />
          <path
            fill="currentColor"
            d="M22 6.92v10.16c0 .5-.37.92-.86.98C19.64 18.28 16 15.22 12 15.22c-4 0-7.64 3.06-9.14 2.84A1 1 0 0 1 2 17.08V6.92c0-.5.37-.92.86-.98C4.36 5.72 8 8.78 12 8.78c4 0 7.64-3.06 9.14-2.84.49.06.86.48.86.98z"
          />
        </svg>
      ),
      title: "E‑mail",
      text: <a href="mailto:info@konceptid.com">info@konceptid.com</a>,
    },
  ];

  return (
    <section className={container}>
      <div className={contactGridClass}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={contactItemClass}
            // pentru users cu reduced motion, dezactivăm animarea
            variants={reduceMotion ? undefined : cardVariants}
            custom={i}
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
          >
            {item.icon}
            <div>
              <h3 className={cardTitleClass}>{item.title}</h3>
              <p className={contactTextClass}>{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ContactInfo;
