import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import IMG from '../../../assets/logo.png';
import './Auths.css';

const PARTICLES = [
  { w: 8,  l: '8%',  d: '0s',   dur: '14s' },
  { w: 5,  l: '18%', d: '3s',   dur: '19s' },
  { w: 11, l: '32%', d: '1.5s', dur: '12s' },
  { w: 4,  l: '48%', d: '6s',   dur: '22s' },
  { w: 9,  l: '63%', d: '2s',   dur: '16s' },
  { w: 6,  l: '78%', d: '8s',   dur: '18s' },
  { w: 5,  l: '91%', d: '4s',   dur: '20s' },
];

const Auth = ({
  title,
  subtitle,
  children,
  buttonText,
  buttonPath,
  formSide = 'right',
}) => {
  const navigate = useNavigate();
  const formOnLeft = formSide === 'left';
  const isCentered = formSide === 'center';

  return (
    <div className="auth-root min-h-screen w-full auth-bg flex items-center justify-center overflow-hidden relative">

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width:             p.w,
            height:            p.w,
            left:              p.l,
            bottom:            '-40px',
            animationDelay:    p.d,
            animationDuration: p.dur,
          }}
        />
      ))}

      <div className="w-full px-4 py-8">

        {isCentered ? (
          <div className="centered-auth-wrap">
            <div className="centered-auth-card">
              <button className="centered-logo-wrap" onClick={() => navigate('/')}>
                <img src={IMG} alt="Farm2Home" />
              </button>
              <div className="centered-form-fade">
                {children}
              </div>
            </div>
          </div>

        ) : (
          <div className={`auth-grid ${formOnLeft ? 'form-left' : 'form-right'}`}>

            <div className="auth-card-col w-full max-w-md mx-auto">
              <div className={`auth-card ${formOnLeft ? 'card-slide-left' : 'card-slide-right'}`}>
                <div className="logo-wrap" onClick={() => navigate('/')}>
                  <img src={IMG} alt="Farm2Home" />
                </div>
                <div className="form-fade">
                  {children}
                </div>
                <div className="mt-5 text-center lg:hidden">
                  <button
                    className="mobile-nav-btn"
                    onClick={() => navigate(buttonPath)}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`auth-panel-col hidden lg:flex flex-col items-start justify-center p-8 space-y-2 relative ${
                formOnLeft ? 'panel-slide-right' : 'panel-slide-left'
              }`}
            >
              <div className={`deco-ring ${formOnLeft ? 'deco-ring-left' : 'deco-ring-right'}`} />
              <h1 className="panel-title">{title}</h1>
              <p className="panel-subtitle">{subtitle}</p>
              <button className="panel-btn" onClick={() => navigate(buttonPath)}>
                {buttonText}
                <HiArrowRight size={14} />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;