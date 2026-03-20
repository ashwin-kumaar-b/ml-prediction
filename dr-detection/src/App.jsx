import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Brain,
  Upload,
  Target,
  BarChart3,
  Eye,
  Activity,
  ChevronDown,
  Zap,
  Microscope,
  HeartPulse,
  ScanEye,
  FileText,
} from 'lucide-react';
import './App.css';

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.02, transition: { duration: 0.25, ease: 'easeOut' } },
};

/* ─────────────────────────────────────────────
   REUSABLE COMPONENTS
───────────────────────────────────────────── */

/** Stat card used in the Problem section */
function StatCard({ value, label, delay = 0 }) {
  return (
    <motion.div
      className="stat-card"
      variants={popIn}
      custom={delay}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.span className="stat-value" variants={cardHover}>{value}</motion.span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

/** Process card used in How It Works */
function ProcessCard({ icon: Icon, title, desc, index }) {
  return (
    <motion.div
      className="process-card"
      variants={fadeUp}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.div
        className="process-icon"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <Icon size={28} />
      </motion.div>
      <span className="process-step">Step {index + 1}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  );
}

/** Tech badge used in Technology Stack */
function TechBadge({ name, category, delay = 0 }) {
  return (
    <motion.div
      className="tech-badge"
      variants={popIn}
      custom={delay}
      whileHover={{ scale: 1.1, rotate: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <Zap size={14} className="tech-badge-icon" />
      <div>
        <span className="tech-name">{name}</span>
        <span className="tech-category">{category}</span>
      </div>
    </motion.div>
  );
}

/** Metric card used in Results */
function MetricCard({ value, label, color, delay = 0 }) {
  return (
    <motion.div
      className={`metric-card metric-card--${color}`}
      variants={fadeUp}
      custom={delay}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="metric-value"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay }}
        viewport={{ once: true }}
      >
        {value}
      </motion.div>
      <div className="metric-label">{label}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION WRAPPER — triggers animation on scroll
───────────────────────────────────────────── */
function Section({ children, className = '', id = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section ref={ref} className={`section ${className}`} id={id}
      data-inview={inView ? 'true' : 'false'}>
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar-inner">
        <div className="navbar-brand">
          <Eye size={22} className="brand-icon" />
          <span>RetinAI</span>
        </div>
        <div className="navbar-links">
          <a href="#problem">Problem</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#tech">Technology</a>
          <a href="#results">Results</a>
          <a href="#demo" className="nav-cta">Try Demo</a>
        </div>
      </div>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* Left: text */}
        <div className="hero-text">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Activity size={14} /> &nbsp;AI-Powered Medical Imaging
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            AI-Powered <span className="gradient-text">Diabetic Retinopathy</span> Detection
          </motion.h1>

          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            Early detection through deep learning — saving sight, one scan at a time.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <motion.a
              href="#demo"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Try Demo
            </motion.a>
            <motion.a
              href="#problem"
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </div>

        {/* Right: animated retinal scan illustration */}
        <motion.div
          className="hero-illustration"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        >
          {/* Pulsing outer glow ring */}
          <motion.div
            className="scan-ring scan-ring--outer"
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="scan-ring scan-ring--mid"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          {/* Main retinal circle */}
          <motion.div
            className="scan-circle"
            animate={{
              boxShadow: [
                '0 0 40px 8px rgba(239,68,68,0.4), 0 0 80px 20px rgba(239,68,68,0.15)',
                '0 0 60px 16px rgba(239,68,68,0.6), 0 0 120px 40px rgba(239,68,68,0.25)',
                '0 0 40px 8px rgba(239,68,68,0.4), 0 0 80px 20px rgba(239,68,68,0.15)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Retinal vessel lines */}
            <svg className="retinal-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="0.5"/>
              {/* Vessel branches */}
              <path d="M100 100 Q 130 70 160 50" stroke="rgba(220,38,38,0.7)" strokeWidth="1.5" fill="none"/>
              <path d="M100 100 Q 70 70 40 55" stroke="rgba(220,38,38,0.7)" strokeWidth="1.5" fill="none"/>
              <path d="M100 100 Q 140 110 170 130" stroke="rgba(220,38,38,0.6)" strokeWidth="1.2" fill="none"/>
              <path d="M100 100 Q 60 115 35 140" stroke="rgba(220,38,38,0.6)" strokeWidth="1.2" fill="none"/>
              <path d="M100 100 Q 110 140 105 170" stroke="rgba(220,38,38,0.5)" strokeWidth="1" fill="none"/>
              <path d="M100 100 Q 90 140 95 170" stroke="rgba(220,38,38,0.5)" strokeWidth="0.8" fill="none"/>
              {/* Macula */}
              <circle cx="100" cy="100" r="12" fill="rgba(180,20,20,0.5)" />
              <circle cx="100" cy="100" r="5" fill="rgba(255,100,100,0.8)" />
              {/* Sub-branches */}
              <path d="M130 70 Q 145 58 155 48" stroke="rgba(220,38,38,0.4)" strokeWidth="0.8" fill="none"/>
              <path d="M70 70 Q 55 62 42 56" stroke="rgba(220,38,38,0.4)" strokeWidth="0.8" fill="none"/>
              <path d="M140 110 Q 158 118 168 128" stroke="rgba(220,38,38,0.4)" strokeWidth="0.8" fill="none"/>
              <path d="M60 115 Q 42 122 36 138" stroke="rgba(220,38,38,0.4)" strokeWidth="0.8" fill="none"/>
              {/* Scan line */}
              <motion.line
                x1="20" y1="100" x2="180" y2="100"
                stroke="rgba(59,130,246,0.6)" strokeWidth="1.5"
                strokeDasharray="4 4"
                animate={{ y1: [20, 180, 20] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          </motion.div>

          {/* Floating labels */}
          <motion.div
            className="scan-label scan-label--top"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="label-dot label-dot--green" />
            Optic Disc
          </motion.div>
          <motion.div
            className="scan-label scan-label--bottom"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <span className="label-dot label-dot--red" />
            Macula Region
          </motion.div>
          <motion.div
            className="scan-label scan-label--right"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            <span className="label-dot label-dot--blue" />
            AI Scanning…
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll chevron */}
      <motion.div
        className="scroll-hint"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROBLEM SECTION
───────────────────────────────────────────── */
function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Section className="problem-section" id="problem">
      <div className="container" ref={ref}>
        <div className="problem-layout">
          {/* Left: text */}
          <motion.div
            className="problem-text"
            variants={fadeLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <span className="section-tag">The Challenge</span>
            <h2 className="section-title">The Problem</h2>
            <p className="section-body">
              Diabetic Retinopathy (DR) is the leading cause of preventable blindness in working-age
              adults worldwide. It develops silently — by the time vision loss is noticeable, the
              damage is often irreversible. The global healthcare system lacks the ophthalmologist
              capacity to screen the 537 million people living with diabetes.
            </p>
            <p className="section-body">
              Our AI system bridges this gap, enabling mass screening with the accuracy of a
              specialist — at a fraction of the cost and time.
            </p>
          </motion.div>

          {/* Right: stat cards */}
          <motion.div
            className="stat-cards"
            variants={container}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <StatCard value="93M" label="People affected globally" delay={0} />
            <StatCard value="50%" label="Cases go undiagnosed" delay={0.1} />
            <StatCard value="80%" label="Preventable with early detection" delay={0.2} />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   RADAR EFFECT COMPONENTS
───────────────────────────────────────────── */

function RadarCircle({ idx }) {
  const size = `${(idx + 1) * 5}rem`;
  return (
    <motion.div
      className="radar-circle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: idx * 0.1, duration: 0.2 }}
      style={{
        width: size,
        height: size,
        border: `1px solid rgba(71, 85, 105, ${1 - (idx + 1) * 0.1})`,
      }}
    />
  );
}

function RadarSweep() {
  const circles = new Array(8).fill(1);
  return (
    <div className="radar-container">
      {/* Rotating sweep line */}
      <div className="radar-sweep-arm">
        <div className="radar-sweep-line" />
      </div>
      {/* Concentric circles */}
      {circles.map((_, idx) => (
        <RadarCircle key={idx} idx={idx} />
      ))}
    </div>
  );
}

function RadarIcon({ icon: Icon, text, delay = 0 }) {
  return (
    <motion.div
      className="radar-icon-container"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
    >
      <div className="radar-icon-box">
        <Icon size={24} />
      </div>
      <span className="radar-icon-label">{text}</span>
    </motion.div>
  );
}

function RadarSection() {
  return (
    <Section className="radar-section" id="radar">
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-tag">AI Pipeline</span>
          <h2 className="section-title">Detection at a Glance</h2>
          <p className="section-subtitle">
            Our AI scans, analyzes, and classifies retinal pathology in real time.
          </p>
        </motion.div>

        <div className="radar-layout">
          {/* Row 1 — three icons */}
          <div className="radar-row radar-row--wide">
            <RadarIcon icon={ScanEye} text="Retinal Scan" delay={0.2} />
            <RadarIcon icon={Microscope} text="Microaneurysm Detection" delay={0.3} />
            <RadarIcon icon={Brain} text="Deep Learning" delay={0.4} />
          </div>
          {/* Row 2 — two icons */}
          <div className="radar-row radar-row--narrow">
            <RadarIcon icon={HeartPulse} text="Patient Screening" delay={0.5} />
            <RadarIcon icon={Activity} text="Severity Grading" delay={0.6} />
          </div>
          {/* Row 3 — two icons */}
          <div className="radar-row radar-row--wide">
            <RadarIcon icon={Eye} text="Fundus Analysis" delay={0.7} />
            <RadarIcon icon={FileText} text="Clinical Report" delay={0.8} />
          </div>

          {/* Radar centered at bottom */}
          <RadarSweep />
          <div className="radar-bottom-line" />
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS SECTION
───────────────────────────────────────────── */
function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    {
      icon: Upload,
      title: 'Upload Retinal Image',
      desc: 'Submit a fundus photograph captured with standard ophthalmoscopy equipment.',
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      desc: 'EfficientNet-B4 extracts deep features via transfer learning from ImageNet weights.',
    },
    {
      icon: Target,
      title: 'Classification',
      desc: 'The model grades severity into 5 DR stages: No DR, Mild, Moderate, Severe, Proliferative.',
    },
    {
      icon: BarChart3,
      title: 'Clinical Report',
      desc: 'Grad-CAM heatmaps highlight affected regions to support clinician decision-making.',
    },
  ];

  return (
    <Section className="howitworks-section" id="how-it-works">
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-tag">Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From raw retinal image to actionable clinical insight in seconds.
          </p>
        </motion.div>

        <motion.div
          className="process-grid"
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {steps.map((step, i) => (
            <ProcessCard key={i} {...step} index={i} />
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   TECHNOLOGY SECTION
───────────────────────────────────────────── */
function TechStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const techs = [
    { name: 'EfficientNet-B4', category: 'Architecture' },
    { name: 'Transfer Learning', category: 'Technique' },
    { name: 'TensorFlow / Keras', category: 'Framework' },
    { name: 'CLAHE Preprocessing', category: 'Image Processing' },
    { name: 'APTOS 2019 Dataset', category: 'Training Data' },
    { name: 'Grad-CAM', category: 'Explainability' },
  ];

  return (
    <Section className="tech-section" id="tech">
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-tag">Stack</span>
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">
            Built on state-of-the-art deep learning components for medical-grade accuracy.
          </p>
        </motion.div>

        <motion.div
          className="tech-grid"
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {techs.map((t, i) => (
            <TechBadge key={i} name={t.name} category={t.category} delay={i * 0.08} />
          ))}
        </motion.div>

        {/* Architecture diagram text */}
        <motion.div
          className="arch-note"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Brain size={18} />
          <span>
            Input (224×224 RGB) → CLAHE Enhancement → EfficientNet-B4 Backbone →
            Global Average Pooling → Dense (256) → Dropout (0.4) → Softmax (5 classes)
          </span>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   RESULTS SECTION
───────────────────────────────────────────── */
function Results() {
  const metrics = [
    { value: '92.5%', label: 'Overall Accuracy', color: 'green' },
    { value: '0.89', label: 'Quadratic Weighted Kappa', color: 'blue' },
    { value: '94%', label: 'Sensitivity (Recall)', color: 'purple' },
    { value: '91%', label: 'Specificity', color: 'orange' },
  ];

  return (
    <Section className="results-section" id="results">
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-tag">Evaluation</span>
          <h2 className="section-title">Model Performance</h2>
          <p className="section-subtitle">
            Validated on the APTOS 2019 Blindness Detection dataset with 5-fold cross-validation.
          </p>
        </motion.div>

        {/* Metric cards */}
        <motion.div
          className="metrics-grid"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {metrics.map((m, i) => (
            <MetricCard key={i} {...m} delay={i * 0.12} />
          ))}
        </motion.div>

        {/* Confusion matrix placeholder */}
        <motion.div
          className="confusion-matrix"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="cm-header">
            <BarChart3 size={18} />
            <span>Confusion Matrix — Test Set</span>
          </div>
          <div className="cm-body">
            <div className="cm-labels cm-labels--x">
              {['No DR', 'Mild', 'Moderate', 'Severe', 'Prolif.'].map(l => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <div className="cm-row-wrap">
              <div className="cm-labels cm-labels--y">
                {['No DR', 'Mild', 'Mod.', 'Severe', 'Prolif.'].map(l => (
                  <span key={l}>{l}</span>
                ))}
              </div>
              <div className="cm-cells">
                {[
                  [185, 8, 4, 1, 0],
                  [6, 72, 10, 2, 1],
                  [3, 9, 143, 7, 2],
                  [1, 2, 8, 58, 3],
                  [0, 1, 3, 4, 47],
                ].map((row, ri) =>
                  row.map((val, ci) => (
                    <div
                      key={`${ri}-${ci}`}
                      className={`cm-cell ${ri === ci ? 'cm-cell--diag' : ''}`}
                      style={{ opacity: 0.2 + (val / 185) * 0.8 }}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   DEMO SECTION
───────────────────────────────────────────── */
function Demo() {
  return (
    <Section className="demo-section" id="demo">
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-tag">Live Demo</span>
          <h2 className="section-title">Try It Yourself</h2>
          <p className="section-subtitle">
            Upload a retinal fundus image to see the AI in action.
          </p>
        </motion.div>

        <motion.div
          className="demo-upload-wrapper"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            className="upload-zone"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="upload-icon-wrap"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Upload size={44} className="upload-icon" />
            </motion.div>
            <h3 className="upload-heading">Drop your retinal image here</h3>
            <p className="upload-sub">or click to browse from your device</p>
            <div className="upload-formats">
              <span>PNG</span><span>JPG</span><span>JPEG</span><span>TIFF</span>
            </div>
            <motion.button
              className="btn btn-primary upload-btn"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              Select Image
            </motion.button>
          </motion.div>

          {/* Info cards below upload */}
          <motion.div
            className="demo-info-cards"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {[
              { icon: Eye, text: 'Fundus photography input' },
              { icon: Zap, text: 'Results in under 2 seconds' },
              { icon: Brain, text: 'Grad-CAM heatmap included' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div key={i} className="demo-info-card" variants={popIn}>
                <Icon size={20} />
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Eye size={18} />
          <span>RetinAI</span>
        </div>
        <p className="footer-text">
          Built with EfficientNet-B4 · TensorFlow · React · Framer Motion
        </p>
        <p className="footer-sub">Academic research project · Not intended for clinical use</p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Problem />
      <RadarSection />
      <HowItWorks />
      <TechStack />
      <Results />
      <Demo />
      <Footer />
    </div>
  );
}

export default App;

