import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useState, useEffect } from "react";
import "../styles/Home.css";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      id: 1,
      src: "/src/assets/tecnologia.jpeg",
      alt: "Eventos de Tecnología",
      title: "Eventos de Tecnología",
      description: "Conferencias, talleres y meetups tech",
    },
    {
      id: 2,
      src: "/src/assets/culturales.jpg",
      alt: "Eventos Culturales",
      title: "Eventos Culturales",
      description: "Arte, música y expresiones culturales",
    },
    {
      id: 3,
      src: "/src/assets/deportivos.jpg",
      alt: "Eventos Deportivos",
      title: "Eventos Deportivos",
      description: "Competencias y actividades deportivas",
    },
    {
      id: 4,
      src: "/src/assets/empresariales.jpg",
      alt: "Eventos Empresariales",
      title: "Eventos Empresariales",
      description: "Networking y desarrollo profesional",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home">
      <div className="container">
        <div className="home-content">
          <div className="hero-section">
            <h1>Eventutti</h1>
            <p className="hero-subtitle">
              Descubre, organiza y participa en eventos increíbles
            </p>
            <p className="hero-description">
              Encuentra eventos que te interesen, conecta con otras personas y
              crea experiencias inolvidables.
            </p>
          </div>

          <div className="carousel-container">
            <div className="carousel">
              <div
                className="carousel-slides"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselImages.map((image) => (
                  <div key={image.id} className="carousel-slide">
                    <img src={image.src} alt={image.alt} />
                    <div className="carousel-content">
                      <h3>{image.title}</h3>
                      <p>{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-btn carousel-prev"
                onClick={prevSlide}
              >
                &#8249;
              </button>
              <button
                className="carousel-btn carousel-next"
                onClick={nextSlide}
              >
                &#8250;
              </button>

              <div className="carousel-dots">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${
                      index === currentSlide ? "active" : ""
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="features-simple">
            <div className="feature">
              <div className="feature-icon">🔍</div>
              <h3>Descubre Eventos</h3>
              <p>
                Explora una amplia variedad de eventos cerca de ti. Desde
                conferencias hasta conciertos.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">⭐</div>
              <h3>Crea Eventos</h3>
              <p>
                Organiza tus propios eventos de manera sencilla y comparte con
                tu comunidad.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">🤝</div>
              <h3>Conecta</h3>
              <p>
                Conoce personas con intereses similares y amplía tu red social.
              </p>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Eventos Organizados</p>
            </div>
            <div className="stat-item">
              <h3>5000+</h3>
              <p>Usuarios Activos</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Ciudades</p>
            </div>
          </div>

          {!isAuthenticated ? (
            <>
              <div className="cta-section">
                <h2>¿Listo para comenzar?</h2>
                <p>
                  Únete a miles de personas que ya disfrutan de eventos
                  increíbles
                </p>
              </div>
              <div className="home-actions">
                <Link to="/register" className="btn btn-primary">
                  Comenzar Ahora
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Ya tengo cuenta
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="cta-section">
                <h2>¡Bienvenido de vuelta!</h2>
                <p>Explora nuevos eventos y gestiona los tuyos</p>
              </div>
              <div className="home-actions">
                <Link to="/events" className="btn btn-primary">
                  Ver Eventos
                </Link>
                <Link to="/create-event" className="btn btn-secondary">
                  Crear Evento
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
