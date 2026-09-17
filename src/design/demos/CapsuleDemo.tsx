import { useMemo, useState, type CSSProperties } from 'react';
import './demos.css';

/*
 * Trackya's core idea, rebuilt live: every hour is a capsule coloured by a
 * personal activity threshold. The data below is illustrative.
 */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const STEPS: number[][] = [
  [420, 1310, 2240, 640, 180, 960, 1520, 300, 210],
  [1002, 1223, 230, 1323, 231, 231, 1323, 1323, 231],
  [2945, 1231, 388, 601, 175, 1480, 920, 260, 1710],
  [760, 1840, 320, 1150, 140, 410, 2210, 1090, 280],
  [1180, 240, 190, 1620, 330, 1240, 360, 1980, 450],
  [253, 3285, 167, 1574, 5545, 820, 310, 1260, 190],
  [1630, 2080, 940, 380, 2760, 1410, 520, 330, 1120],
];
const CONTEXT = ['Sunny · Home', 'Cloudy · Lab', 'Rainy · Lab', 'Sunny · Campus', 'Windy · Lab', 'Sunny · Downtown', 'Cloudy · Home'];

const formatHour = (hour: number) => `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'pm' : 'am'}`;

export function CapsuleDemo() {
  const [threshold, setThreshold] = useState(1000);
  const [view, setView] = useState<'week' | 'day'>('week');
  const [day, setDay] = useState(4);
  const [hover, setHover] = useState<{ day: number; hour: number } | null>(null);

  const sedentaryShare = useMemo(() => {
    const cells = view === 'day' ? STEPS[day] : STEPS.flat();
    return Math.round((cells.filter(steps => steps < threshold).length / cells.length) * 100);
  }, [threshold, view, day]);

  const focus = hover ?? null;
  const readout = focus
    ? `${DAYS[focus.day]} · ${formatHour(HOURS[focus.hour])} — ${STEPS[focus.day][focus.hour].toLocaleString()} steps · ${CONTEXT[focus.day]}`
    : view === 'day'
      ? `${DAYS[day]} · ${CONTEXT[day]}`
      : 'One column per day, one capsule per hour';

  return (
    <div className="demo capsules" style={{ '--demo-accent': '#5d5fee' } as CSSProperties}>
      <div className="capsules__panel">
        <div className="capsules__stat" aria-live="polite">
          <span className="capsules__value">{sedentaryShare}<small>%</small></span>
          <span className="mono">Sedentary {view === 'day' ? `on ${DAYS[day]}` : 'this week'}</span>
        </div>

        <div className="demo-toggle" role="group" aria-label="View">
          {(['week', 'day'] as const).map(option => (
            <button key={option} type="button" className={view === option ? 'is-on' : ''} aria-pressed={view === option} onClick={() => setView(option)}>
              {option === 'week' ? 'Week' : 'Day'}
            </button>
          ))}
        </div>

        <label className="capsules__slider">
          <span className="mono">An hour counts as active at</span>
          <strong>{threshold.toLocaleString()} steps</strong>
          <input
            type="range"
            min={200}
            max={2400}
            step={100}
            value={threshold}
            onChange={event => setThreshold(Number(event.target.value))}
            aria-label="Steps per hour that count as active"
          />
        </label>

        <ul className="capsules__legend mono">
          <li><i style={{ background: '#47d5b3' }} />Active hour</li>
          <li><i style={{ background: '#f078b5' }} />Sedentary hour</li>
        </ul>
      </div>

      <div className={`capsules__stage capsules__stage--${view}`}>
        {view === 'week' ? (
          <div className="capsules__grid" role="img" aria-label={`Week grid of hourly activity. ${sedentaryShare}% of hours are below the threshold.`}>
            {DAYS.map((label, dayIndex) => (
              <button
                key={label}
                type="button"
                className={`capsules__col${dayIndex === day ? ' is-picked' : ''}`}
                onClick={() => { setDay(dayIndex); setView('day'); }}
                aria-label={`Open ${label}`}
              >
                <span className="mono">{label}</span>
                {HOURS.map((hour, hourIndex) => {
                  const steps = STEPS[dayIndex][hourIndex];
                  return (
                    <i
                      key={hour}
                      className={steps >= threshold ? 'is-active' : ''}
                      style={{ '--n': dayIndex + hourIndex } as CSSProperties}
                      onPointerEnter={() => setHover({ day: dayIndex, hour: hourIndex })}
                      onPointerLeave={() => setHover(null)}
                    />
                  );
                })}
              </button>
            ))}
          </div>
        ) : (
          <div className="capsules__list">
            <div className="capsules__days" role="tablist" aria-label="Day">
              {DAYS.map((label, index) => (
                <button key={label} type="button" role="tab" aria-selected={index === day} className={index === day ? 'is-on' : ''} onClick={() => setDay(index)}>
                  {label}
                </button>
              ))}
            </div>
            <ol>
              {HOURS.map((hour, hourIndex) => {
                const steps = STEPS[day][hourIndex];
                return (
                  <li
                    key={hour}
                    className={steps >= threshold ? 'is-active' : ''}
                    style={{ '--n': hourIndex } as CSSProperties}
                    onPointerEnter={() => setHover({ day, hour: hourIndex })}
                    onPointerLeave={() => setHover(null)}
                  >
                    <span className="mono">{formatHour(hour)}</span>
                    <b>{steps.toLocaleString()}</b>
                    <em>steps</em>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
        <p className="capsules__readout mono" aria-hidden="true">{readout}</p>
      </div>
    </div>
  );
}
