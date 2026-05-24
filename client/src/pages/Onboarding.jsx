import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/Final_Logo-removebg-preview.png';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: ''
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // TDEE Preview calculation
  const calculatePreview = () => {
    if (!data.age || !data.gender || !data.height || !data.weight || !data.goal || !data.activityLevel) return null;

    let bmr;
    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    }

    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, very_active: 1.725 };
    let tdee = bmr * multipliers[data.activityLevel];
    if (data.goal === 'lose_weight') tdee -= 500;
    else if (data.goal === 'gain_muscle') tdee += 300;

    const calories = Math.round(tdee);
    const protein = Math.round(data.weight * 2);
    const fat = Math.round((tdee * 0.25) / 9);
    const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);

    return { calories, protein, fat, carbs };
  };

  const preview = calculatePreview();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/onboarding',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: '#141414',
    border: '1.5px solid #222',
    borderRadius: '12px',
    padding: '14px 16px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Space Grotesk', sans-serif"
  };

  const optionBtn = (selected, onClick, label, sub) => (
    <button
      onClick={onClick}
      style={{
        background: selected ? '#A6F882' : '#141414',
        border: `1.5px solid ${selected ? '#A6F882' : '#222'}`,
        borderRadius: '12px',
        padding: '16px 20px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.2s',
        fontFamily: "'Space Grotesk', sans-serif"
      }}
    >
      <p style={{
        color: selected ? '#080808' : 'white',
        fontWeight: '600', margin: '0 0 2px', fontSize: '15px'
      }}>{label}</p>
      {sub && <p style={{
        color: selected ? '#0a2a00' : '#666',
        margin: 0, fontSize: '12px'
      }}>{sub}</p>}
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      color: 'white',
      fontFamily: "'Space Grotesk', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <img src={logo} alt="FitFuel" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '24px', letterSpacing: '2px', color: '#A6F882'
        }}>FITFUEL</span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', maxWidth: '520px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#666', fontSize: '13px' }}>Step {step} of 4</span>
          <span style={{ color: '#A6F882', fontSize: '13px', fontWeight: '600' }}>{Math.round((step / 4) * 100)}%</span>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '999px', height: '4px' }}>
          <div style={{
            background: '#A6F882', height: '4px',
            borderRadius: '999px',
            width: `${(step / 4) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '520px',
        background: '#111', border: '1px solid #1a1a1a',
        borderRadius: '20px', padding: '36px'
      }}>

        {/* Step 1 — Basic Info */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }}>Let's get to know you</h2>
            <p style={{ color: '#666', margin: '0 0 28px', fontSize: '14px' }}>This helps us calculate your personalized nutrition goals</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Age</label>
                <input
                  type="number"
                  placeholder="e.g. 22"
                  value={data.age}
                  onChange={e => updateData('age', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Gender</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {optionBtn(data.gender === 'male', () => updateData('gender', 'male'), 'Male')}
                  {optionBtn(data.gender === 'female', () => updateData('gender', 'female'), 'Female')}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 175"
                    value={data.height}
                    onChange={e => updateData('height', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 70"
                    value={data.weight}
                    onChange={e => updateData('weight', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Goal */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }}>What's your goal?</h2>
            <p style={{ color: '#666', margin: '0 0 28px', fontSize: '14px' }}>We'll adjust your calorie target based on this</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {optionBtn(data.goal === 'lose_weight', () => updateData('goal', 'lose_weight'), 'Lose Weight', 'Calorie deficit — burn more than you eat')}
              {optionBtn(data.goal === 'maintain', () => updateData('goal', 'maintain'), 'Maintain Weight', 'Stay at your current weight')}
              {optionBtn(data.goal === 'gain_muscle', () => updateData('goal', 'gain_muscle'), 'Gain Muscle', 'Calorie surplus — build mass and strength')}
            </div>
          </div>
        )}

        {/* Step 3 — Activity Level */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }}>How active are you?</h2>
            <p style={{ color: '#666', margin: '0 0 28px', fontSize: '14px' }}>Be honest — this directly affects your calorie needs</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {optionBtn(data.activityLevel === 'sedentary', () => updateData('activityLevel', 'sedentary'), 'Sedentary', 'Little or no exercise, desk job')}
              {optionBtn(data.activityLevel === 'light', () => updateData('activityLevel', 'light'), 'Lightly Active', 'Light exercise 1-3 days/week')}
              {optionBtn(data.activityLevel === 'moderate', () => updateData('activityLevel', 'moderate'), 'Moderately Active', 'Moderate exercise 3-5 days/week')}
              {optionBtn(data.activityLevel === 'very_active', () => updateData('activityLevel', 'very_active'), 'Very Active', 'Hard exercise 6-7 days/week')}
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }}>Your personalized plan</h2>
            <p style={{ color: '#666', margin: '0 0 28px', fontSize: '14px' }}>
              Based on your profile — calculated using the Mifflin-St Jeor formula
            </p>

            {preview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>

                {/* Calories — Big */}
                <div style={{
                  background: '#0a1a00', border: '1px solid #1a3a00',
                  borderRadius: '14px', padding: '20px', textAlign: 'center'
                }}>
                  <p style={{ color: '#666', fontSize: '13px', margin: '0 0 4px' }}>Daily Calorie Goal</p>
                  <p style={{ fontSize: '48px', fontWeight: '700', color: '#A6F882', margin: '0 0 4px' }}>{preview.calories}</p>
                  <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>kcal / day</p>
                </div>

                {/* Macros */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Protein', value: preview.protein, unit: 'g', color: '#A6F882' },
                    { label: 'Carbs', value: preview.carbs, unit: 'g', color: '#6EE7B7' },
                    { label: 'Fat', value: preview.fat, unit: 'g', color: '#4CAF50' },
                  ].map(m => (
                    <div key={m.label} style={{
                      background: '#141414', border: '1px solid #222',
                      borderRadius: '12px', padding: '14px', textAlign: 'center'
                    }}>
                      <p style={{ color: '#666', fontSize: '12px', margin: '0 0 4px' }}>{m.label}</p>
                      <p style={{ fontSize: '22px', fontWeight: '700', color: m.color, margin: '0 0 2px' }}>{m.value}</p>
                      <p style={{ color: '#444', fontSize: '11px', margin: 0 }}>{m.unit}/day</p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div style={{
                  background: '#141414', border: '1px solid #222',
                  borderRadius: '12px', padding: '16px'
                }}>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 10px', fontWeight: '600' }}>Your Profile Summary</p>
                  {[
                    { label: 'Goal', value: data.goal === 'lose_weight' ? 'Lose Weight' : data.goal === 'maintain' ? 'Maintain Weight' : 'Gain Muscle' },
                    { label: 'Activity', value: data.activityLevel === 'sedentary' ? 'Sedentary' : data.activityLevel === 'light' ? 'Lightly Active' : data.activityLevel === 'moderate' ? 'Moderately Active' : 'Very Active' },
                    { label: 'Weight', value: `${data.weight} kg` },
                    { label: 'Height', value: `${data.height} cm` },
                  ].map(item => (
                    <div key={item.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}>
                      <span style={{ color: '#555', fontSize: '13px' }}>{item.label}</span>
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{
                background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: '10px', padding: '12px 16px',
                color: '#f87171', fontSize: '14px', marginBottom: '16px'
              }}>{error}</div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1, background: '#141414',
                border: '1px solid #222', color: 'white',
                borderRadius: '12px', padding: '14px',
                cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >← Back</button>
          )}
          <button
            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
            disabled={loading}
            style={{
              flex: 1,
              background: loading ? '#4a7a2a' : '#A6F882',
              border: 'none', color: '#080808',
              borderRadius: '12px', padding: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px', fontWeight: '700',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            {loading ? 'Saving...' : step === 4 ? "Let's Go 🚀" : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;