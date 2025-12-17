class Audio {
  static #instance;

  constructor() {
      if (Audio.#instance) return Audio.#instance;
      Audio.#instance = this;
      
      this.streams = new Map();
      this.sfxChannels = new Map();
      this.masterVolume = 100;
      this.musicVolume = 80;
      this.sfxVolume = 100;
      this.currentMusic = null;
      this.musicFading = false;
      this.fadeTimer = null;
  }
  
  playMusic(streamAsset, loop = true, fadeIn = 0) {
      if (!streamAsset) {
          console.warn('[Audio] Stream asset inválido');
          return false;
      }

      if (this.currentMusic === streamAsset && streamAsset.playing()) {
          return true;
      }

      this.stopMusic(fadeIn > 0 ? fadeIn : 0);

      this.currentMusic = streamAsset;
      streamAsset.loop = loop;

      if (fadeIn > 0) {
          this.#fadeInMusic(streamAsset, fadeIn);
      } else {
          streamAsset.play();
      }

      this.streams.set('current', streamAsset);
      return true;
  }

  stopMusic(fadeOut = 0) {
      if (!this.currentMusic) return;

      if (fadeOut > 0) {
          this.#fadeOutMusic(this.currentMusic, fadeOut);
      } else {
          this.currentMusic.pause();
          this.currentMusic = null;
          this.streams.delete('current');
      }
  }

  pauseMusic() {
      if (this.currentMusic && this.currentMusic.playing()) {
          this.currentMusic.pause();
          return true;
      }
      return false;
  }

  resumeMusic() {
      if (this.currentMusic && !this.currentMusic.playing()) {
          this.currentMusic.play();
          return true;
      }
      return false;
  }

  isMusicPlaying() {
      return this.currentMusic && this.currentMusic.playing();
  }

  setMusicPosition(position) {
      if (this.currentMusic) {
          this.currentMusic.position = Math.max(0, Math.min(position, this.currentMusic.length));
      }
  }

  getMusicPosition() {
      return this.currentMusic ? this.currentMusic.position : 0;
  }

  getMusicLength() {
      return this.currentMusic ? this.currentMusic.length : 0;
  }

  setMusicLoop(loop) {
      if (this.currentMusic) {
          this.currentMusic.loop = loop;
      }
  }

  rewindMusic() {
      if (this.currentMusic) {
          this.currentMusic.rewind();
      }
  }

  playSfx(sfxAsset, channel = null) {
      if (!sfxAsset) {
          console.warn('[Audio] SFX asset inválido');
          return -1;
      }

      const usedChannel = channel !== null ? channel : Sound.findChannel();
      
      if (usedChannel === -1) {
          console.warn('[Audio] Nenhum canal disponível para SFX');
          return -1;
      }

      sfxAsset.volume = this.sfxVolume;
      const result = sfxAsset.play(usedChannel);
      
      if (result !== undefined) {
          this.sfxChannels.set(usedChannel, sfxAsset);
          return usedChannel;
      }

      return result !== undefined ? usedChannel : -1;
  }

  stopSfx(channel) {
      if (typeof channel !== 'number' || channel < 0) {
          console.warn('[Audio] Canal inválido');
          return false;
      }

      const sfx = this.sfxChannels.get(channel);
      if (sfx && sfx.playing(channel)) {
          sfx.volume = 0;
          this.sfxChannels.delete(channel);
          return true;
      }

      return false;
  }

  isSfxPlaying(channel) {
      const sfx = this.sfxChannels.get(channel);
      return sfx ? sfx.playing(channel) : false;
  }

  setSfxPan(sfxAsset, pan) {
      if (sfxAsset) {
          sfxAsset.pan = Math.max(-100, Math.min(100, pan));
      }
  }

  setSfxPitch(sfxAsset, pitch) {
      if (sfxAsset) {
          sfxAsset.pitch = Math.max(-100, Math.min(100, pitch));
      }
  }

  setMasterVolume(volume) {
      this.masterVolume = Math.max(0, Math.min(100, volume));
      Sound.setVolume(this.masterVolume);
  }

  getMasterVolume() {
      return this.masterVolume;
  }

  setMusicVolume(volume) {
      this.musicVolume = Math.max(0, Math.min(100, volume));
  }

  getMusicVolume() {
      return this.musicVolume;
  }

  setSfxVolume(volume) {
      this.sfxVolume = Math.max(0, Math.min(100, volume));
      
      for (const sfx of this.sfxChannels.values()) {
          sfx.volume = this.sfxVolume;
      }
  }

  getSfxVolume() {
      return this.sfxVolume;
  }

  #fadeInMusic(stream, duration) {
      if (this.musicFading) return;

      this.musicFading = true;
      const startTime = Date.now();
      const initialVolume = 0;
      const targetVolume = this.musicVolume;

      stream.play();

      const fade = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1.0);
          
          const currentVolume = initialVolume + (targetVolume - initialVolume) * progress;
          
          Sound.setVolume(Math.floor(currentVolume));

          if (progress < 1.0) {
              this.fadeTimer = os.setTimeout(fade, 16);
          } else {
              this.musicFading = false;
              this.fadeTimer = null;
          }
      };

      fade();
  }

  #fadeOutMusic(stream, duration) {
      if (this.musicFading) return;

      this.musicFading = true;
      const startTime = Date.now();
      const initialVolume = this.musicVolume;
      const targetVolume = 0;

      const fade = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1.0);
          
          const currentVolume = initialVolume + (targetVolume - initialVolume) * progress;
          
          Sound.setVolume(Math.floor(currentVolume));

          if (progress < 1.0) {
              this.fadeTimer = os.setTimeout(fade, 16);
          } else {
              stream.pause();
              Sound.setVolume(this.masterVolume);
              this.musicFading = false;
              this.fadeTimer = null;
              this.currentMusic = null;
              this.streams.delete('current');
          }
      };

      fade();
  }

  cancelFade() {
      if (this.fadeTimer) {
          os.clearTimeout(this.fadeTimer);
          this.fadeTimer = null;
          this.musicFading = false;
          Sound.setVolume(this.masterVolume);
      }
  }

  clear() {
      this.stopMusic(0);
      this.cancelFade();
      this.sfxChannels.clear();
      this.streams.clear();
      this.currentMusic = null;
  }

  getStats() {
      return {
          masterVolume: this.masterVolume,
          musicVolume: this.musicVolume,
          sfxVolume: this.sfxVolume,
          activeSfxChannels: this.sfxChannels.size,
          musicPlaying: this.isMusicPlaying(),
          musicFading: this.musicFading
      };
  }
}

export default new Audio();