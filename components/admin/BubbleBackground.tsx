<<<<<<< HEAD
'use client'

export default function BubbleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>
      <div className="bubble bubble-5"></div>
      <div className="bubble bubble-6"></div>
      <style jsx>{`
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(255, 0, 0, 0.3));
          animation: float 6s ease-in-out infinite;
        }
        
        .bubble-1 {
          width: 80px;
          height: 80px;
          left: 10%;
          top: 20%;
          animation-delay: 0s;
        }
        
        .bubble-2 {
          width: 60px;
          height: 60px;
          left: 20%;
          top: 80%;
          animation-delay: 2s;
        }
        
        .bubble-3 {
          width: 100px;
          height: 100px;
          right: 20%;
          top: 10%;
          animation-delay: 4s;
        }
        
        .bubble-4 {
          width: 40px;
          height: 40px;
          right: 10%;
          top: 60%;
          animation-delay: 1s;
        }
        
        .bubble-5 {
          width: 70px;
          height: 70px;
          left: 50%;
          top: 50%;
          animation-delay: 3s;
        }
        
        .bubble-6 {
          width: 50px;
          height: 50px;
          right: 40%;
          bottom: 20%;
          animation-delay: 5s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
=======
'use client'

export default function BubbleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>
      <div className="bubble bubble-5"></div>
      <div className="bubble bubble-6"></div>
      <style jsx>{`
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(255, 0, 0, 0.3));
          animation: float 6s ease-in-out infinite;
        }
        
        .bubble-1 {
          width: 80px;
          height: 80px;
          left: 10%;
          top: 20%;
          animation-delay: 0s;
        }
        
        .bubble-2 {
          width: 60px;
          height: 60px;
          left: 20%;
          top: 80%;
          animation-delay: 2s;
        }
        
        .bubble-3 {
          width: 100px;
          height: 100px;
          right: 20%;
          top: 10%;
          animation-delay: 4s;
        }
        
        .bubble-4 {
          width: 40px;
          height: 40px;
          right: 10%;
          top: 60%;
          animation-delay: 1s;
        }
        
        .bubble-5 {
          width: 70px;
          height: 70px;
          left: 50%;
          top: 50%;
          animation-delay: 3s;
        }
        
        .bubble-6 {
          width: 50px;
          height: 50px;
          right: 40%;
          bottom: 20%;
          animation-delay: 5s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
>>>>>>> 77ce5e5 (Cambios 2.0)
}