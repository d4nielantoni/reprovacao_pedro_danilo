'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

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

  useEffect(() => {
    const targetDate = new Date(2025, 4, 26, 20, 0, 0); 
    
    const updateTimer = () => {
      const now = new Date();
      const isPast = now > targetDate;
      
      if (isPast) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true
        });
        return;
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

    // Atualiza o contador a cada segundo
    const timer = setInterval(updateTimer, 1000);
    updateTimer(); // Chamada inicial

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">
          {timeLeft.isPast 
            ? 'Pedro Danilo foi REPROVADO!'
            : 'Reprovação de Pedro Danilo'}
        </h1>
        
        <h2 className="text-2xl md:text-3xl mb-12">
          {timeLeft.isPast 
            ? 'O dia tão esperado chegou!'
            : 'Dia 26 de Maio de 2025 às 20:00'}
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
          <div className="mt-8 p-6 bg-red-600 rounded-lg shadow-xl animate-pulse">
            <p className="text-2xl md:text-3xl font-bold">
              A reprovação foi confirmada! 🎉
            </p>
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
