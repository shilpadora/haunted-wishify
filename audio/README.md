# Audio Assets for Spooky Web Builder

This directory contains audio files for the retro landing page sequence.

## Required Audio Files:

### Retro Landing Page Sequence:
- `typing.mp3` / `typing.ogg` - Mechanical keyboard typing sounds
- `glitch.mp3` / `glitch.ogg` - Digital glitch/static effects  
- `voiceover.mp3` / `voiceover.ogg` - "Welcome to the Floppy Graveyard" voiceover
- `scream.mp3` / `scream.ogg` - Scream sound for disk full error
- `static.mp3` / `static.ogg` - TV static/white noise for finale

### General Spooky Sounds (from main builder):
- `whisper.mp3` / `whisper.ogg` - Ghostly whispers
- `chains.mp3` / `chains.ogg` - Rattling chains
- `creak.mp3` / `creak.ogg` - Creaking door sounds

## Audio Format Notes:
- MP3 files for broad compatibility
- OGG files as fallback for browsers that don't support MP3
- All audio should be normalized to prevent volume spikes
- Recommended sample rate: 44.1kHz
- Recommended bit rate: 128kbps for effects, 192kbps for voiceover

## Implementation:
The audio files are loaded and managed by the AudioManager class and RetroLandingSequence class. If audio files are missing, the sequence will continue without sound effects.