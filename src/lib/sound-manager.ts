"use client";

import { Howl } from "howler";

class SoundManager {
  private static instance: SoundManager;
  private sounds: Record<string, Howl> = {};
  private muted: boolean = false;

  private constructor() {
    // We'll use public URLs or standard sounds
    // For now, these are placeholders that will be replaced with real assets if available
    this.sounds = {
      click: new Howl({ src: ["https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"], volume: 0.5 }),
      hover: new Howl({ src: ["https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"], volume: 0.2 }),
      glitch: new Howl({ src: ["https://assets.mixkit.co/active_storage/sfx/2564/2564-preview.mp3"], volume: 0.4 }),
      hum: new Howl({ src: ["https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3"], volume: 0.1, loop: true }),
      success: new Howl({ src: ["https://assets.mixkit.co/active_storage/sfx/2561/2561-preview.mp3"], volume: 0.5 }),
    };
  }

  public static getInstance(): SoundManager {
    if (typeof window === "undefined") return {} as SoundManager;
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public play(name: string) {
    if (this.muted || !this.sounds[name]) return;
    this.sounds[name].play();
  }

  public startLoop(name: string) {
    if (this.muted || !this.sounds[name]) return;
    if (!this.sounds[name].playing()) {
      this.sounds[name].play();
    }
  }

  public stop(name: string) {
    if (this.sounds[name]) {
      this.sounds[name].stop();
    }
  }

  public setVolume(name: string, volume: number) {
    if (this.sounds[name]) {
      this.sounds[name].volume(volume);
    }
  }

  public toggleMute() {
    this.muted = !this.muted;
    Object.values(this.sounds).forEach((s) => s.mute(this.muted));
  }
}

export const soundManager = SoundManager;
