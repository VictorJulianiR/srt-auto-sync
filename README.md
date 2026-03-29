# 🎬 SRT Auto-Sync Tool

![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)

A professional, browser-based utility to automatically synchronize translated subtitle files (`.srt`) using a "Ground Truth" (correctly synced) file as a reference. Specially usefull to convert different subs of different languages into the same timing. 

**[Try It Here!](https://victorjulianir.github.io/srt-auto-sync/)**

## ✨ Features
- **Automatic Offset Detection:** Finds the exact millisecond delay between files.
- **Time-Stretching Analysis:** Detects if the lag is caused by framerate differences and calculates the exact multiplier.
- **Robust Matching Algorithm:** Uses a "Histogram Voting" logic to find the best match even if some lines are missing or merged in the translation.
- **100% Private:** All processing is done locally in your browser. Your files are never uploaded to a server.
- **Modern UI:** Clean, responsive interface built with Tailwind CSS.

## 🚀 How to Use
1. **Ground Truth File:** Upload the SRT file that is already perfectly synced to your video, probably in English.
2. **Translated File:** Upload the SRT file that has the wrong timing, but the correct language.
3. **Analyze:** Click "Analyze & Sync".
4. **Download:** Review the analysis report (showing what was fixed) and download your new, perfectly synced SRT.

## 🛠️ How it Works
The tool doesn't just compare the first line. It performs a statistical analysis:
- **Step 1:** It tests several common framerate conversion ratios (23.976 ↔ 24 ↔ 25).
- **Step 2:** For each ratio, it builds a histogram of all possible time offsets between every subtitle block.
- **Step 3:** The "peak" of the histogram identifies the most likely global offset, effectively ignoring "noise" like translator credits or missing scenes.
- **Step 4:** It reapplies the winning transformation (Stretch * Time + Offset) to the entire file.
