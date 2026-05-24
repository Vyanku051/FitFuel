import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/Final_Logo-removebg-preview.png';

const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) navigate('/');
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mealsRes, workoutsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/meals/today', { headers }),
        axios.get('http://localhost:5000/api/workouts', { headers })
      ]);
      setMeals(mealsRes.data);
      setWorkouts(workoutsRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const totalProtein = meals.reduce((acc, meal) => acc + meal.protein, 0);
  const totalCarbs = meals.reduce((acc, meal) => acc + meal.carbs, 0);
  const totalFat = meals.reduce((acc, meal) => acc + meal.fat, 0);
  const calorieGoal = 2500;
  const proteinGoal = 150;
  const caloriesLeft = calorieGoal - totalCalories;
  const totalCaloriesBurned = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const caloriePercent = Math.min((totalCalories / calorieGoal) * 100, 100);

  const cardStyle = {
    background: '#141414',
    border: '1px solid #222',
    borderRadius: '16px',
    padding: '20px'
  };

  const NavIcon = ({ path, label, color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color || '#A6F882'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      color: 'white',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Top Nav */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 32px',
        borderBottom: '1px solid #1a1a1a',
        background: '#0A0A0A',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="FitFuel" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '22px', letterSpacing: '2px', color: '#A6F882'
          }}>FITFUEL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: '#A6F882', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#080808',
            fontWeight: '700', fontSize: '14px'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} style={{
            background: '#141414', border: '1px solid #222',
            color: '#888', borderRadius: '10px',
            padding: '8px 16px', cursor: 'pointer',
            fontSize: '13px', fontFamily: "'Space Grotesk', sans-serif"
          }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 4px' }}>
            Good morning, <span style={{ color: '#A6F882' }}>{user?.name}</span>
          </h1>
          <p style={{ color: '#FFFFFF', margin: 0, fontSize: '14px' }}>
            Here's your fitness summary for today
          </p>
        </div>

        {/* Top Row — Calories + Workouts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* Calorie Card */}
          <div style={cardStyle}>
            <p style={{ color: '#FFFFFF', fontSize: '13px', margin: '0 0 12px', fontWeight: '500' }}>Daily Calories</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 4px', color: 'white' }}>
                  {totalCalories}
                  <span style={{ fontSize: '16px', color: '#D7D7D7', fontWeight: '500' }}> / {calorieGoal}</span>
                </p>
                <p style={{ color: '#D7D7D7', fontSize: '13px', margin: '0 0 16px', fontWeight: '500' }}>
                  {caloriesLeft > 0 ? `${caloriesLeft} kcal remaining` : 'Goal reached!'}
                </p>
              </div>
              {/* Circle */}
              <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#222" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#A6F882" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - caloriePercent / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)', textAlign: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#A6F882' }}>
                    {Math.round(caloriePercent)}%
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#222', borderRadius: '999px', height: '6px' }}>
              <div style={{
                background: '#A6F882', height: '6px', borderRadius: '999px',
                width: `${caloriePercent}%`, transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Workout Card */}
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p style={{ color: '#FFFFFF', fontSize: '13px', margin: '0 0 16px', fontWeight: '500' }}>This Week</p>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <p style={{ fontSize: '36px', fontWeight: '700', color: 'white', margin: '0 0 4px' }}>{workouts.length}</p>
                <p style={{ color: '#D7D7D7', fontSize: '13px', margin: 0, fontWeight: '500' }}>Workouts</p>
              </div>
              <div style={{ width: '1px', background: '#222' }} />
              <div>
                <p style={{ fontSize: '36px', fontWeight: '700', color: 'white', margin: '0 0 4px' }}>{totalCaloriesBurned}</p>
                <p style={{ color: '#D7D7D7', fontSize: '13px', margin: 0, fontWeight: '500' }}>Kcal burned</p>
              </div>
            </div>
            <button onClick={() => navigate('/workouts')} style={{
              background: 'transparent', border: '1px solid #222',
              color: '#A6F882', borderRadius: '10px', padding: '10px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              fontFamily: "'Space Grotesk', sans-serif", marginTop: '16px'
            }}>
              View Workouts →
            </button>
          </div>
        </div>

        {/* Macros Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
          {[
            { label: 'Protein', value: totalProtein, goal: proteinGoal, unit: 'g' },
            { label: 'Carbs', value: totalCarbs, goal: 300, unit: 'g' },
            { label: 'Fat', value: totalFat, goal: 80, unit: 'g' },
          ].map((macro) => (
            <div key={macro.label} style={cardStyle}>
              <p style={{ color: '#FFFFFF', fontSize: '13px', margin: '0 0 8px', fontWeight: '500' }}>{macro.label}</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: '0 0 10px' }}>
                {macro.value}
                <span style={{ fontSize: '18px', color: '#D7D7D7', fontWeight: '500' }}> / {macro.goal}{macro.unit}</span>
              </p>
              <div style={{ background: '#222', borderRadius: '999px', height: '4px' }}>
                <div style={{
                  background: '#A6F882', height: '4px', borderRadius: '999px',
                  width: `${Math.min((macro.value / macro.goal) * 100, 100)}%`
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
          {[
            {
              label: 'Log Meal', path: '/log-meal', desc: 'Track your food',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A6F882" strokeWidth="2" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
            },
            {
              label: 'Log Workout', path: '/workouts', desc: 'Record your session',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A6F882" strokeWidth="2" strokeLinecap="round"><path d="M6 4v16M18 4v16M3 8h4M17 8h4M3 16h4M17 16h4"/></svg>
            },
            {
              label: 'AI Suggest', path: '/ai-suggest', desc: 'Get meal ideas',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A6F882" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            },
          ].map((card) => (
            <button
              key={card.label}
              onClick={() => navigate(card.path)}
              style={{
                background: '#141414', border: '1px solid #222',
                borderRadius: '16px', padding: '20px',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#A6F882'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#222'}
            >
              <div style={{ marginBottom: '12px' }}>{card.icon}</div>
              <p style={{ color: 'white', fontWeight: '600', margin: '0 0 4px', fontSize: '15px' }}>{card.label}</p>
              <p style={{ color: '#D7D7D7', margin: 0, fontSize: '13px', fontWeight: '500' }}>{card.desc}</p>
            </button>
          ))}
        </div>

        {/* Today's Meals */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: 'white' }}>Today's Meals</h2>
            <button onClick={() => navigate('/log-meal')} style={{
              background: '#A6F882', border: 'none', color: '#080808',
              borderRadius: '8px', padding: '8px 14px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>+ Add Meal</button>
          </div>
          {meals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: '12px' }}>
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/>
                <path d="M7 2v20"/>
                <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
              </svg>
              <p style={{ color: '#D7D7D7', margin: 0, fontSize: '14px', fontWeight: '500' }}>No meals logged today</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meals.map((meal) => (
                <div key={meal._id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#0f0f0f', border: '1px solid #1a1a1a',
                  borderRadius: '12px', padding: '14px 16px'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', margin: '0 0 3px', fontSize: '14px', color: 'white' }}>{meal.name}</p>
                    <p style={{ color: '#D7D7D7', margin: 0, fontSize: '12px', fontWeight: '500' }}>
                      P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                    </p>
                  </div>
                  <span style={{ color: '#A6F882', fontWeight: '600', fontSize: '15px' }}>
                    {meal.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;