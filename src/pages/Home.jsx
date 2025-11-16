import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";
import pic1 from "../assets/images/pic1.png";
import pic2 from "../assets/images/pic2.png";
import pic3 from "../assets/images/pic3.png";
import pic4 from "../assets/images/pic4.png";
import pic5 from "../assets/images/pic5.png";
import pic6 from "../assets/images/pic6.png";

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <main className="home-content">
        {/* --- Hero Section --- */}
        <section className="hero">
          <div className="hero-text">
            <h1>🌍 Air Pollution Tracker</h1>
            <p>
              Air is essential for life — but every breath we take is now filled
              with invisible threats. This platform helps you track, understand,
              and respond to air pollution in your area, empowering you to take
              control of your health and environment.
            </p>
          </div>
          <div className="hero-image">
            <img src={pic1} alt="City skyline with pollution" />
          </div>
        </section>

        {/* --- What is Air Pollution --- */}
        <section className="info-section">
          <h2>🌫️ What is Air Pollution?</h2>
          <p>
            Air pollution occurs when harmful gases, dust, and smoke enter the
            atmosphere, making it unsafe to breathe. The most concerning
            pollutants include particulate matter (PM2.5 and PM10), nitrogen
            oxides, sulfur dioxide, and carbon monoxide.
          </p>
          <p>
            Major contributors include transportation, industrial processes,
            agricultural burning, and household emissions. Urban areas tend to
            face the highest risk, but rural regions are not immune — pollution
            travels easily through the air.
          </p>
          <img src={pic2} alt="Air pollution sources" />
        </section>

        {/* --- Effects on Human Health --- */}
        <section className="effects-section">
          <h2>🫁 How It Affects the Human Body</h2>
          <p className="effects-intro">
            Prolonged exposure to polluted air can silently damage vital organs,
            leading to long-term health issues that are often underestimated.
          </p>

          <div className="effects-grid">
            <div className="effect-card">
              <img src={pic3} alt="Lungs illustration" />
              <h3>Respiratory Problems</h3>
              <p>
                Particulate matter irritates the lungs, causing chronic
                bronchitis, asthma attacks, and reduced lung function over time.
              </p>
            </div>

            <div className="effect-card">
              <img src={pic4} alt="Heart health" />
              <h3>Cardiovascular Issues</h3>
              <p>
                Pollutants enter the bloodstream, thickening arteries and
                increasing the risk of heart attacks, strokes, and hypertension.
              </p>
            </div>

            <div className="effect-card">
              <img src={pic5} alt="Children's health" />
              <h3>Impacts on Children</h3>
              <p>
                Children breathe faster and absorb more pollutants, resulting in
                developmental delays, allergies, and weakened immune systems.
              </p>
            </div>
          </div>
        </section>

        {/* --- Environmental Impact --- */}
        <section className="impact-section">
          <h2>🌱 The Environmental Toll</h2>
          <p>
            Air pollution doesn’t just harm people — it damages ecosystems too.
            Toxic gases and acid rain destroy forests, reduce crop yields, and
            contaminate water bodies. It also contributes to climate change by
            increasing greenhouse gas concentrations.
          </p>
          <p>
            According to WHO, over 7 million premature deaths occur annually due
            to polluted air. Monitoring air quality is the first step toward
            reducing that number — and protecting both the planet and ourselves.
          </p>
        </section>

        {/* --- How Our System Helps --- */}
        <section className="how-it-works">
          <h2>📊 How Our System Helps</h2>
          <p>
            Our platform connects real-time location data with the OpenWeather
            API to analyze local AQI (Air Quality Index). If pollution levels
            rise, the system sends SMS alerts directly to your phone using
            Twilio integration.
          </p>
          <p>
            You can also manually check any city’s air quality on the map,
            visualize pollution intensity through color indicators, and receive
            personalized advice to minimize exposure.
          </p>
          <img src={pic6} alt="AQI dashboard preview" />
        </section>

        {/* --- Call to Action --- */}
        <section className="cta-section">
          <h2>💡 Take Action — Start Now</h2>
          <p>
            The air you breathe defines your health. Start by monitoring your
            surroundings, reducing emissions, and spreading awareness. Together,
            we can make every breath count.
          </p>
          <button
            className="cta-button"
            onClick={() => (window.location.href = "/register")}
          >
            Get Started
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
