'use client';

import { useState, useEffect} from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    // ===== MODO DE TESTE =====
    // Para testar com 5 segundos, descomente a linha abaixo e comente a linha targetDate
    // const targetDate = new Date(new Date().getTime() + 5000); // 5 segundos a partir de agora
    
    // ===== MODO PRODUÇÃO =====
    // const targetDate = new Date(2025, 4, 26, 20, 0, 0);
    const targetDate = new Date(2025, 5, 7, 18, 0, 0);

    const updateTimer = () => {
      const now = new Date();
      const isPast = now > targetDate;
      
      if (isPast) {
        setShowConfetti(true);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true
        });
        return;
      } else {
        setShowConfetti(false);
      }

      const days = differenceInDays(targetDate, now);
      const hours = differenceInHours(targetDate, now) % 24;
      const minutes = differenceInMinutes(targetDate, now) % 60;
      const seconds = differenceInSeconds(targetDate, now) % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false
      });
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">
          {timeLeft.isPast 
            ? 'Pedro Danilo foi REPROVADO!'
            : 'Reprovação de Pedro Danilo'}
        </h1>
        
        <h2 className="text-2xl md:text-3xl mb-12">
          {timeLeft.isPast 
            ? 'O dia tão esperado chegou!'
            : 'Dia 7 de Junho de 2025 às 18:00'}
        </h2>

        {!timeLeft.isPast && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <TimeBox value={timeLeft.days} label="Dias" />
            <TimeBox value={timeLeft.hours} label="Horas" />
            <TimeBox value={timeLeft.minutes} label="Minutos" />
            <TimeBox value={timeLeft.seconds} label="Segundos" />
          </div>
        )}

        {timeLeft.isPast && (
          <div className="w-full max-w-4xl mt-8">
            <div className="p-6 bg-red-600 rounded-lg shadow-xl animate-pulse mb-8">
              <p className="text-2xl md:text-3xl font-bold text-center">
                A reprovação foi confirmada! 🎉
              </p>
            </div>
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                width="100%"
                height="500"
                src="https://www.youtube.com/embed/5SKl6-hxtzA?autoplay=1&mute=0&enablejsapi=1&controls=1&playsinline=1&rel=0&modestbranding=1&origin=http://localhost:3000"
                title="Pedro Danilo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-2xl"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-lg hover:bg-gray-800 transition-colors">
      <div className="text-4xl md:text-6xl font-bold text-white">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-lg md:text-xl mt-2 text-gray-300">{label}</div>
    </div>
  );
}
