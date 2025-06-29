// src/pages/Inicio.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './Inicio.css';                //  ← estilos extra (abajo)

const slides = [
  '/inicio/antisana-01.jpg',
  '/inicio/antisana-03.jpg',
  '/inicio/antisana-04.jpg'
];

export default function Inicio() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      loop
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      speed={1200}
      className="hero-swiper"
    >
      {slides.map((src, i) => (
        <SwiperSlide key={i}>
          <img src={src} alt={`Antisana ${i + 1}`} />
          {/* (opcional) capa de texto */}
          {/* <div className="caption">Antisana, guardián del agua</div> */}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
