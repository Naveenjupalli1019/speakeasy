import React, { useState } from 'react';
import { Languages } from 'lucide-react';

export default function LoginPortal({ onLoginSuccess }) {
  const [view, setView] = useState('signin'); // 'signin' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    setMousePos({ x, y });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const users = JSON.parse(localStorage.getItem('translationUsers') || '[]');

      if (view === 'signup') {
        const userExists = users.some(u => u.email === email);
        if (userExists) {
          setError('An account with this email already exists');
          return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('translationUsers', JSON.stringify(users));

        setView('signin');
        setPassword('');
        setError('');
        alert('Account created successfully! Please sign in.');
      } else {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          setError('Invalid email or password');
          return;
        }
        
        onLoginSuccess({ email: user.email, name: user.name }, rememberMe);
      }
    }, 1200);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 font-sans overflow-hidden"
      style={{ backgroundImage: 'url("/sky_bg.png")', backgroundColor: '#b3d8f1' }}
      onMouseMove={handleMouseMove}
    >
      
      {/* Main Card */}
      <div className="w-full max-w-[900px] h-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl bg-white/95 border border-white/40">
        
        {/* Left Side: Image Banner */}
        <div className="hidden md:block w-1/2 p-2.5">
          <div className="relative w-full h-full rounded-[14px] overflow-hidden shadow-inner">
            <img 
              src="/yeti.png" 
              alt="Mascot" 
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{
                transform: `perspective(800px) rotateY(${mousePos.x * 15}deg) rotateX(${mousePos.y * -15}deg) scale(1.15)`,
                transition: 'transform 0.1s ease-out',
                transformOrigin: 'center'
              }}
            />
            {/* Gradient overlay to make text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-8 left-6 text-white tracking-tight">
              <h1 className="text-4xl font-black leading-none drop-shadow-md">CONNECT.</h1>
              <h1 className="text-4xl font-black leading-none drop-shadow-md">TRANSLATE. UNITE.</h1>
            </div>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-10 py-12 bg-white relative">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <Languages className="w-8 h-8 text-black mb-1" strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-widest text-black">SPEAKEASY</span>
          </div>

          <h2 className="text-[22px] font-black tracking-tight text-black mb-1 uppercase">
            {view === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[10px] text-gray-500 mb-8 font-medium">
            {view === 'signin' 
              ? 'Enter your email and password to access your account' 
              : 'Enter your details below to create your free account'}
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-[320px]">
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 text-center shadow-sm">
                {error}
              </div>
            )}
            
            {view === 'signup' && (
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name" 
                  className="w-full bg-[#f4f5f7] text-gray-900 placeholder:text-gray-400 text-xs rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-black/10 transition-shadow font-medium"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[10px] font-bold text-gray-700 mb-1.5 ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-[#f4f5f7] text-gray-900 placeholder:text-gray-400 text-xs rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-black/10 transition-shadow font-medium"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-gray-700 mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={view === 'signin' ? "Enter your password" : "Create a password"} 
                className="w-full bg-[#f4f5f7] text-gray-900 placeholder:text-gray-400 text-xs rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-black/10 transition-shadow font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-8 px-1">
              <label className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm border-gray-300 text-black focus:ring-black/20 accent-black cursor-pointer"
                  required={view === 'signup'}
                />
                <span className="ml-2 text-[10px] font-bold text-gray-600 group-hover:text-black transition-colors">
                  {view === 'signin' ? 'Remember me' : 'I agree to Terms'}
                </span>
              </label>
              {view === 'signin' && (
                <a href="#" className="text-[10px] font-bold text-gray-800 hover:underline">Forgot Password</a>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white rounded-lg py-3 text-xs font-bold hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-black shadow-lg shadow-black/10"
            >
              {isLoading ? 'Processing...' : (view === 'signin' ? 'Sign In' : 'Create Account')}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 text-[10px] text-gray-500 font-medium text-center">
            {view === 'signin' ? (
              <>Don't have an account? <button type="button" onClick={() => { setView('signup'); setError(''); }} className="text-black font-bold ml-1 hover:underline">Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => { setView('signin'); setError(''); }} className="text-black font-bold ml-1 hover:underline">Sign in</button></>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
