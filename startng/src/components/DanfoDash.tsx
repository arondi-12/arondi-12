import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { writeBestScore, useBestScore } from '../hooks/useBestScore';

type Phase = 'idle' | 'running' | 'over';

type Obstacle = {
  id: number;
  lane: number;
  y: number;
  coin: boolean;
  taken: boolean;
};

const TICK = 60; // ms per logic step
const LANE_WIDTH = 100 / 3;

// geometry, in % of the stage height
const SPAWN_Y = -14;
const HIT_TOP = 69;
const HIT_BOTTOM = 89;
const PASS_Y = 104;
const SPAWN_GAP = 27; // keep this much clear between obstacles
const START_SPEED = 1.9;
const MAX_SPEED = 4.4;

const LANES = [0, 1, 2];

const ruleLines = [
  { icon: '⬅️', text: 'Move with the arrow keys, A / D, or the buttons under the road.' },
  { icon: '🕳️', text: 'Every pothole you pass is a point. Touch one and the run ends.' },
  { icon: '🪙', text: 'Naira in your lane is worth two. Pure vibes.' },
];

export function DanfoDash() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [paused, setPaused] = useState(false);
  const [lane, setLane] = useState(1);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [crashed, setCrashed] = useState(false);
  const [newBest, setNewBest] = useState(false);

  const best = useBestScore();

  const laneRef = useRef(1);
  const phaseRef = useRef<Phase>('idle');
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const speedRef = useRef(START_SPEED);
  const nextId = useRef(1);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const finish = useCallback(() => {
    phaseRef.current = 'over';
    setPhase('over');
    setCrashed(true);
    const final = scoreRef.current;
    if (final > 0 && final > best) {
      writeBestScore(final);
      setNewBest(true);
    }
  }, [best]);

  const start = useCallback(() => {
    laneRef.current = 1;
    obstaclesRef.current = [];
    scoreRef.current = 0;
    speedRef.current = START_SPEED;
    nextId.current = 1;
    setLane(1);
    setScore(0);
    setObstacles([]);
    setCrashed(false);
    setNewBest(false);
    setPaused(false);
    phaseRef.current = 'running';
    setPhase('running');
    stageRef.current?.focus({ preventScroll: true });
  }, []);

  const move = useCallback((direction: -1 | 1) => {
    const next = Math.min(2, Math.max(0, laneRef.current + direction));
    if (next === laneRef.current) return;
    laneRef.current = next;
    setLane(next);
  }, []);

  // one logic step: drift everything down, spawn, score, collide
  useEffect(() => {
    if (phase !== 'running' || paused) return;

    const id = window.setInterval(() => {
      if (phaseRef.current !== 'running') return;

      const speed = Math.min(MAX_SPEED, speedRef.current + 0.0035);
      speedRef.current = speed;

      const moved = obstaclesRef.current.map((item) => ({ ...item, y: item.y + speed }));
      const kept: Obstacle[] = [];
      let gained = 0;

      for (const item of moved) {
        const inPlayerZone = item.y > HIT_TOP && item.y < HIT_BOTTOM + speed;

        if (inPlayerZone && item.lane === laneRef.current) {
          if (!item.coin) {
            finish();
            return;
          }
          if (!item.taken) {
            item.taken = true;
            gained += 2;
          }
        }

        if (item.y > PASS_Y) {
          if (!item.coin) gained += 1;
          continue;
        }

        kept.push(item);
      }

      const last = kept[kept.length - 1];
      if (!last || last.y > SPAWN_GAP) {
        kept.push({
          id: nextId.current++,
          lane: Math.floor(Math.random() * 3),
          y: SPAWN_Y,
          coin: Math.random() < 0.26,
          taken: false,
        });
      }

      obstaclesRef.current = kept;
      setObstacles(kept);

      if (gained > 0) {
        scoreRef.current += gained;
        setScore(scoreRef.current);
      }
    }, TICK);

    return () => window.clearInterval(id);
  }, [phase, paused, finish]);

  // keyboard controls
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const key = event.key.toLowerCase();
      const isLeft = key === 'arrowleft' || key === 'a';
      const isRight = key === 'arrowright' || key === 'd';

      if (event.key === 'Escape' && phaseRef.current === 'running') {
        setPaused(true);
        return;
      }

      if (event.key === ' ' || event.key === 'Enter') {
        if (phaseRef.current !== 'running') {
          event.preventDefault();
          start();
        }
        return;
      }

      if (!isLeft && !isRight) return;

      event.preventDefault();
      if (phaseRef.current !== 'running') {
        start();
        return;
      }
      if (paused) {
        setPaused(false);
        return;
      }
      move(isLeft ? -1 : 1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move, paused, start]);

  // do not punish a visitor who switches tabs mid-run
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && phaseRef.current === 'running') setPaused(true);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const onStagePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (phaseRef.current !== 'running') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    if (x < 0.34) move(-1);
    else if (x > 0.66) move(1);
  };

  const lit = Math.max(
    0,
    Math.min(3, Math.round(((speedRef.current - START_SPEED) / (MAX_SPEED - START_SPEED)) * 3)),
  );

  return (
    <section className="container section" id="play" aria-labelledby="play-title">
      <div className="play-card">
        <div className="play-copy">
          <p className="eyebrow">Play right here</p>
          <h2 id="play-title">
            Danfo <em>Dash</em>
          </h2>
          <p>
            Three lanes, one yellow bus, and every pothole in Lagos. A small taste of what a
            start.ng game feels like in the same tab you were already reading in.
          </p>

          <ul className="play-rules">
            {ruleLines.map((rule) => (
              <li key={rule.text}>
                <span className="play-rules-icon" aria-hidden="true">
                  {rule.icon}
                </span>
                <span>{rule.text}</span>
              </li>
            ))}
          </ul>

          <div className="play-keys">
            <kbd>←</kbd>
            <kbd>→</kbd>
            <span>or</span>
            <kbd>A</kbd>
            <kbd>D</kbd>
            <span aria-hidden="true">·</span>
            <kbd>Esc</kbd>
            <span>to pause</span>
          </div>

          <p className="play-note hand">
            a tiny demo, not one of the 188 — the real shelf is right below
          </p>
        </div>

        <div className="dd-wrap">
          <div
            ref={stageRef}
            className={`dd-stage${phase === 'running' ? ' is-running' : ''}${
              phase === 'idle' ? ' is-idle' : ''
            }${paused ? ' is-paused' : ''}`}
            role="group"
            aria-label="Danfo Dash play area"
            tabIndex={0}
            onPointerDown={onStagePointer}
          >
            <div className="dd-road" aria-hidden="true" />
            <div className="dd-lanes" aria-hidden="true">
              {LANES.map((item) => (
                <span key={item} />
              ))}
            </div>

            <div className="dd-hud">
              <span className="dd-chip">
                dodged <b>{String(score).padStart(2, '0')}</b>
              </span>
              <span className="dd-chip">
                best <b>{String(best).padStart(2, '0')}</b>
              </span>
            </div>

            {obstacles.map((item) => (
              <div
                key={item.id}
                className={`dd-hole${item.coin ? ' dd-hole--coin' : ''}`}
                style={{ top: `${item.y}%`, left: `${item.lane * LANE_WIDTH}%` }}
                aria-hidden="true"
              >
                <div className="dd-hole-inner">{item.coin ? '₦' : ''}</div>
              </div>
            ))}

            <div
              className={`dd-bus${crashed ? ' is-hit' : ''}`}
              style={{ left: `${lane * LANE_WIDTH}%` }}
              aria-hidden="true"
            >
              <div className="dd-bus-inner">
                <span className="dd-bus-window" />
                <span className="dd-bus-window" />
                <i className="dd-bus-wheel dd-bus-wheel--left" />
                <i className="dd-bus-wheel dd-bus-wheel--right" />
              </div>
            </div>

            <div className="dd-speed" aria-hidden="true">
              {[0, 1, 2].map((bar) => (
                <i key={bar} className={bar < lit ? 'on' : undefined} />
              ))}
            </div>

            {phase !== 'running' && (
              <div className="dd-overlay">
                <div className="dd-modal">
                  {phase === 'over' ? (
                    <>
                      {newBest && <span className="dd-best-flag">new personal best</span>}
                      <h3>{newBest ? 'Omo, you flew!' : 'Pothole 1, bus 0'}</h3>
                      <p className="dd-modal-score">
                        <b>{score}</b>
                        <span>dodged</span>
                      </p>
                      <p aria-live="polite">
                        Best so far: <b>{Math.max(best, score)}</b>. The next run is always the
                        good one.
                      </p>
                      <button type="button" className="btn" onClick={start}>
                        Again ↺
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>Ready, driver?</h3>
                      <p>Dodge the potholes. Grab the naira. Keep the bus yellow.</p>
                      <button type="button" className="btn" onClick={start}>
                        Start the engine ▶
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {paused && phase === 'running' && (
              <div className="dd-overlay">
                <div className="dd-modal">
                  <h3>Parked</h3>
                  <p>Traffic is on hold. Score so far: {score}.</p>
                  <button type="button" className="btn" onClick={() => setPaused(false)}>
                    Drive on ▶
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="dd-touch">
            <button type="button" onClick={() => move(-1)} aria-label="Move one lane left">
              ← Left
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Move one lane right">
              Right →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


