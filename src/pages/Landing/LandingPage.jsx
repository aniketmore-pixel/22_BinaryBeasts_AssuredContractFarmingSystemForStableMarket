import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck,
    Users,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Globe,
    IndianRupee
} from 'lucide-react';
import { Button } from '../../components/ui/Base';
import './Landing.css';
import heroImg from '../../assets/hero.png';
import secureImg from '../../assets/secure.png';

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="logo">
                    <div className="logo-icon">🌾</div>
                    <span>KrishiSetu</span>
                </div>
                <div className="nav-links">
                    <a href="#how-it-works">How it Works</a>
                    <a href="#features">Features</a>
                    <a href="#impact">Social Impact</a>
                    <Link to="/login"><Button variant="secondary">Login</Button></Link>
                    <Link to="/signup"><Button>Join Now</Button></Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <Badge text="India's #1 Contract Farming Platform" />
                    <h1>Ensuring <span>Fair Prices</span> for Every Farmer</h1>
                    <p>KrishiSetu connects farmers directly with corporate buyers using smart contracts, guaranteed escrow payments, and AI-driven risk assessment.</p>
                    <div className="hero-btns">
                        <Button className="cta-btn">Register as Farmer <ArrowRight size={18} /></Button>
                        <Button variant="secondary" className="cta-btn">Company Onboarding</Button>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <strong>50,000+</strong>
                            <span>Verified Farmers</span>
                        </div>
                        <div className="stat">
                            <strong>200+</strong>
                            <span>Corporate Buyers</span>
                        </div>
                        <div className="stat">
                            <strong>₹500Cr+</strong>
                            <span>Contract Volume</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={heroImg} alt="Modern Farming" />
                    <div className="floating-card">
                        <div className="icon"><ShieldCheck color="var(--primary)" /></div>
                        <div>
                            <strong>Payment Secured</strong>
                            <p>Escrow payment locked for Wheat Contract #442</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Impact Metrics */}
            <section className="impact" id="impact">
                <div className="impact-grid">
                    <div className="impact-card">
                        <TrendingUp size={40} color="var(--primary)" />
                        <h3>30% Income Increase</h3>
                        <p>Average increase in farmer income through assured pricing.</p>
                    </div>
                    <div className="impact-card">
                        <Globe size={40} color="var(--primary)" />
                        <h3>Sustainable Farming</h3>
                        <p>15,000+ acres transitioned to organic farming practices.</p>
                    </div>
                    <div className="impact-card">
                        <Users size={40} color="var(--primary)" />
                        <h3>Financial Inclusion</h3>
                        <p>80% of our farmers got their first-ever bank-integrated payment.</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works" id="how-it-works">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Three simple steps to secure your agricultural future.</p>
                </div>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-num">01</div>
                        <h4>Create or Join Offer</h4>
                        <p>Buyers post requirements or farmers browse pre-approved contract offers.</p>
                    </div>
                    <div className="step">
                        <div className="step-num">02</div>
                        <h4>Smart Negotiation</h4>
                        <p>Discuss prices, quality parameters, and delivery dates digitally.</p>
                    </div>
                    <div className="step">
                        <div className="step-num">03</div>
                        <h4>Secure Fulfillment</h4>
                        <p>Produce crops, deliver goods, and get paid instantly via escrow.</p>
                    </div>
                </div>
            </section>

            {/* Features Table Style */}
            <section className="features" id="features">
                <div className="features-main">
                    <div className="features-image">
                        <img src={secureImg} alt="Secure Payments" />
                    </div>
                    <div className="features-content">
                        <h2>Why Choose KrishiSetu?</h2>
                        <ul className="feature-list">
                            <li><CheckCircle2 size={20} color="var(--primary)" /> <span><strong>Guaranteed Escrow:</strong> Money is locked before sowing starts.</span></li>
                            <li><CheckCircle2 size={20} color="var(--primary)" /> <span><strong>Digital KYC:</strong> Verified profiles for both farmers and companies.</span></li>
                            <li><CheckCircle2 size={20} color="var(--primary)" /> <span><strong>Quality Assurance:</strong> Standardized grading and moisture checks.</span></li>
                            <li><CheckCircle2 size={20} color="var(--primary)" /> <span><strong>Dispute Mediation:</strong> Fast legal resolution by our admin experts.</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <h2>Ready to revolutionize your farming?</h2>
                    <Button className="large-btn">Get Started Today</Button>
                    <div className="footer-links">
                        <span>© 2026 KrishiSetu. All rights reserved.</span>
                        <div className="links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const Badge = ({ text }) => (
    <span className="hero-badge">{text}</span>
);

export default LandingPage;
