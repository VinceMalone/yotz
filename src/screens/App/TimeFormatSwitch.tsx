import { useHour12State } from '../../state/hour12';

export function TimeFormatSwitch() {
  const [hour12, setHour12] = useHour12State();

  return (
    <div className="flex items-center space-x-2 h-8">
      <label className="leading-tight" htmlFor="hour-12__switch" style={{ textAlign: 'end' }}>
        Use 12 hour time format
      </label>
      <input
        checked={hour12}
        id="hour-12__switch"
        onChange={(event) => setHour12(event.target.checked)}
        type="checkbox"
      />
    </div>
  );
}
