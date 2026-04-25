import { generatePDF } from '../utils/pdfGenerator';
import { Download, RefreshCw, Sprout, TrendingUp, ShieldCheck } from 'lucide-react';

const ResultsDisplay = ({ results, onReset }) => {
  const topCrop = results.recommendations[0];
  const alternates = results.recommendations.slice(1);

  return (
    <div className="animate-up">
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', marginBottom: '1rem' }}>
            <Sprout size={48} />
          </div>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {topCrop.crop.charAt(0).toUpperCase() + topCrop.crop.slice(1)}
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
            Top Recommended Crop ({topCrop.confidence}% Match)
          </p>
        </div>

        <div className="grid-2">
          <div className="result-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--text-main)' }}>
              <TrendingUp size={20} className="text-primary" /> Expected Profit
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
              ₹{topCrop.expectedProfit.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-light)', fontWeight: '400' }}>/ acre</span>
            </p>
          </div>

          <div className="result-card secondary">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <ShieldCheck size={20} /> AI Reasoning
            </h3>
            <p style={{ color: 'var(--text-light)' }}>
              {topCrop.reason}
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Fertilizer & Growth Roadmap</h3>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Pre-sowing:</span> {topCrop.fertilizerRoadmap.pre_sowing}
            </li>
            <li style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>Growth:</span> {topCrop.fertilizerRoadmap.growth_stage}
            </li>
            <li style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#F59E0B' }}>Harvest:</span> {topCrop.fertilizerRoadmap.harvest_stage}
            </li>
          </ul>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Alternate Recommendations</h3>
        <div className="grid-2">
          {alternates.map((rec, index) => (
            <div key={index} className="result-card tertiary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{rec.crop.toUpperCase()}</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Match: {rec.confidence}%</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{rec.expectedProfit.toLocaleString()}</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>per acre</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 2rem' }} onClick={() => generatePDF(results)}>
          <Download size={20} /> Download PDF Report
        </button>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={onReset}>
          <RefreshCw size={20} /> Start New Analysis
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
