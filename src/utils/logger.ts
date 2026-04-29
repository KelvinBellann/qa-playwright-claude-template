type LogLevel = 'info' | 'warn' | 'error';

interface LogEvent {
  level: LogLevel;
  event: string;
  detail?: string;
  durationMs?: number;
}

export function logEvent(entry: LogEvent): void {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const payload = JSON.stringify({
    level: entry.level,
    event: entry.event,
    detail: entry.detail,
    durationMs: entry.durationMs,
  });

  console.log(payload);
}
