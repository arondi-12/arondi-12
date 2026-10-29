export function HalloweenBanner() {
  return (
    <div className="halloween" role="note">
      <span className="halloween-dot" aria-hidden="true" />
      <span className="halloween-text">
        <b>Halloween weekend</b> · ghost games in the daily drop{' '}
        <span className="halloween-tail">until Sunday midnight</span>
      </span>
      <a href="#tournament">See the picks →</a>
    </div>
  );
}
