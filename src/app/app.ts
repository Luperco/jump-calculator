import { Component, computed, DOCUMENT, inject, signal } from '@angular/core';
import { Language, translations, UnitName } from './translations';
import { APP_VERSION } from './version';

@Component({ selector: 'app-root', styleUrl: './app.css', templateUrl: './app.html' })
export class App {
  private readonly document = inject(DOCUMENT);
  protected readonly language = signal<Language>('it');
  protected readonly copy = computed(() => translations[this.language()]);
  protected readonly version = APP_VERSION;
  protected readonly showVersion = signal(false);

  protected closeVersionOnFocusExit(event: FocusEvent): void {
    const badge = event.currentTarget as HTMLElement;
    if (!badge.contains(event.relatedTarget as Node | null)) this.showVersion.set(false);
  }

  protected readonly referenceSpeed = 12.6;
  protected readonly units: ReadonlyArray<{ name: UnitName; speed: number }> = [
    { name: 'Infantry', speed: 36 },
    { name: 'Armored Car', speed: 72 },
    { name: 'Stormtrooper', speed: 48 },
    { name: 'Cavalry', speed: 48 },
    { name: 'Light Artillery', speed: 36 },
    { name: 'Artillery', speed: 25 },
    { name: 'Tank', speed: 42 },
    { name: 'Heavy Tank', speed: 30 },
    { name: 'Balloons', speed: 25 },
  ];
  protected readonly selectedUnit = signal<UnitName | ''>(this.units[0].name);
  protected readonly formattedReferenceSpeed = computed(() =>
    new Intl.NumberFormat(this.language()).format(this.referenceSpeed));
  protected readonly nominalSpeed = signal<number | null>(this.units[0].speed);
  protected readonly territoryMultiplier = signal(0.35);
  protected readonly gameSpeed = signal(1);
  protected readonly speed = signal<number | null>(this.referenceSpeed);
  protected readonly durationHours = signal(0);
  protected readonly durationMinutes = signal(0);
  protected readonly validDuration = computed(() =>
    [this.durationHours(), this.durationMinutes()].every(value => Number.isSafeInteger(value) && value >= 0)
    && Number.isSafeInteger(this.durationHours() * 3600 + this.durationMinutes() * 60));
  protected readonly remaining = computed(() => {
    const result = this.result();
    if (!result || !this.validDuration()) return null;
    const total = this.durationHours() * 3600 + this.durationMinutes() * 60 - result.total;
    return {
      exceeded: total < 0,
      hours: Math.floor(Math.max(0, total) / 3600),
      minutes: Math.floor(Math.max(0, total) % 3600 / 60),
      seconds: (Math.max(0, total) % 60).toString().padStart(2, '0'),
    };
  });
  protected readonly result = computed(() => {
    const speed = this.speed();
    if (speed === null || !Number.isFinite(speed) || speed <= 0) return null;
    const total = Math.round(1428 * this.referenceSpeed / this.gameSpeed() / speed);
    if (!Number.isSafeInteger(total)) return null;
    return { minutes: Math.floor(total / 60), seconds: (total % 60).toString().padStart(2, '0'), total };
  });
  constructor() {
    try {
      const savedLanguage = this.document.defaultView?.localStorage.getItem('jump-calculator-language');
      if (savedLanguage === 'en') this.applyLanguage(savedLanguage);
    } catch {
      // Keep the default language when storage is unavailable.
    }
  }

  protected setLanguage(language: Language): void {
    this.applyLanguage(language);
    try {
      this.document.defaultView?.localStorage.setItem('jump-calculator-language', language);
    } catch {
      // Switching languages still works for the current session.
    }
  }

  private applyLanguage(language: Language): void {
    this.language.set(language);
    this.document.documentElement.lang = language;
    this.document.title = `${this.copy().title} | Supremacy 1914`;
  }

  protected updateGameSpeed(value: string): void {
    this.gameSpeed.set(Number(value));
  }

  protected updateSpeed(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.speed.set(input.value === '' ? null : input.valueAsNumber);
  }
  protected updateUnit(name: string): void {
    const unit = this.units.find(candidate => candidate.name === name);
    if (!unit) return;

    this.selectedUnit.set(unit.name);
    this.nominalSpeed.set(unit.speed);
    this.applyTerritorySpeed();
  }

  protected updateNominalSpeed(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedUnit.set('');
    this.nominalSpeed.set(input.value === '' ? null : input.valueAsNumber);
    this.applyTerritorySpeed();
  }

  protected updateTerritory(value: string): void {
    this.territoryMultiplier.set(Number(value));
    this.applyTerritorySpeed();
  }

  private applyTerritorySpeed(): void {
    const nominal = this.nominalSpeed();
    if (nominal === null || !Number.isFinite(nominal) || nominal <= 0) {
      this.speed.set(null);
      return;
    }

    const effective = nominal * this.territoryMultiplier();
    // Remove floating-point artifacts such as 31.499999999999996 from the input.
    this.speed.set(Number(effective.toPrecision(15)));
  }

  protected updateDuration(event: Event, field: 'hours' | 'minutes'): void {
    const input = event.target as HTMLInputElement;
    const value = input.value === '' && !input.validity.badInput ? 0 : input.valueAsNumber;
    (field === 'hours' ? this.durationHours : this.durationMinutes).set(value);
  }
}

