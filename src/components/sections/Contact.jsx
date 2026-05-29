import { motion } from "framer-motion";
import SplitText from "../primitives/SplitText";
import ContactAccentSwap from "./ContactAccentSwap";
import ContactMarquee from "./ContactMarquee";

const fadeUp = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.3 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Contact() {
  return (
    <section className="sect contact" id="contact">
      <div className="sect-inner">
        <div className="contact-inner-grid">
          <div>
            <motion.span className="section-tag" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
              <span className="num">06</span> Contact
            </motion.span>
            <div className="contact-headline">
              <span className="contact-line contact-line--sm">
                <SplitText text="LET'S BUILD" splitBy="chars" stagger={0.024} duration={1.0} />
              </span>
              <span className="contact-line contact-line--95 contact-line--stroke">
                <SplitText text="SOMETHING" splitBy="chars" stagger={0.024} duration={1.0} delay={0.18} />
              </span>
              <ContactAccentSwap />
            </div>
          </div>

          <motion.div className="contact-right" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
            <div className="contact-card">
              <div className="contact-card-head">
                <span>// DIRECT LINE</span>
                <span className="lime">● 24h RESPONSE</span>
              </div>
              <div className="contact-detail">
                <span className="k">Email</span>
                <span className="v"><a href="mailto:elendilm2m@gmail.com">elendilm2m@gmail.com</a></span>
              </div>
              <div className="contact-detail">
                <span className="k">Discord</span>
                <span className="v">elendil_x</span>
              </div>
              <div className="contact-detail">
                <span className="k">Region</span>
                <span className="v">NA · EU · APAC</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <ContactMarquee />
    </section>
  );
}
